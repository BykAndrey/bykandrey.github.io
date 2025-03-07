import {
    FeatureGroup,
    MapContainer,
    GeoJSON,
    useMap,
    Tooltip,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import st from './Map.module.scss'
import './Map.scss'

import React, { useEffect, useMemo } from 'react'
import { LeafletEventHandlerFnMap, PathOptions } from 'leaflet'
import { PUBLIC_BASE_URL } from '@/config'

function loadBorders() {
    return fetch(PUBLIC_BASE_URL +'/data/World.json').then((res) => res.json())
}

function Country(props: {
    id: string
    feature: GeoJSON.Feature
    defaultStyles: PathOptions
    hoverStyles: PathOptions
    isActive: boolean,
    onClick?: (code: string | null, feature: object) => void
}) {
    const map = new Map();
    
    const handlerCountry = useMemo<LeafletEventHandlerFnMap>(
        () => ({
            click: () => {
                props.onClick?.(props.id, props.feature)
            },
            mouseover: (event) => {
                event.sourceTarget.setStyle(props.hoverStyles)
            },
            mouseout: (event) => {
                event.sourceTarget.setStyle(props.defaultStyles)
            },
        }),
        [map, props],
    )
    return (
        <GeoJSON
            data={props.feature}
            style={props.isActive ? props.hoverStyles : props.defaultStyles}
            eventHandlers={handlerCountry}
        >
            <Tooltip sticky direction="top">
                {props.feature.properties?.['name_en']}
            </Tooltip>
        </GeoJSON>
    )
}
function ReactMap(props: {
    data: { [key: string]: { value: number } }
    perfectValue: number
    positiveColor?: string
    negativeColor?: string
    invertColors?: boolean
    activeValue: string | null
    onCountryClick?: (countryCode: string | null) => void
}) {
    const [borders, setBorders] = React.useState<GeoJSON.FeatureCollection>()

    const [countryStyles, setCountryStyles] = React.useState<
        Record<string, { default: PathOptions; hover: PathOptions }>
    >({})
    const [minMaxValue, setMinMaxValue] = React.useState<{
        min: number
        max: number
    }>({ min: Infinity, max: -Infinity })

    const map = useMap()
    useEffect(() => {
        loadBorders().then((borders) => {
            setBorders(borders as GeoJSON.FeatureCollection)
        })
    }, [])

    useEffect(() => {
        const minMax = Object.values(props.data).reduce(
            (acc, d) => {
                if (!d) return acc
                let min = acc.min
                let max = acc.max
                if (d.value < min) {
                    min = d.value
                }
                if (d.value > max) {
                    max = d.value
                }
                return {
                    min,
                    max,
                }
            },
            { min: Infinity, max: -Infinity },
        )
        setMinMaxValue(minMax)
    }, [props.data])

    const handlerMap = useMemo<LeafletEventHandlerFnMap>(
        () => ({
            add(event) {
                map.fitBounds(event.sourceTarget.getBounds())
            },
        }),
        [map],
    )

    useEffect(() => {
        if (!borders) return

        const styles = borders.features.reduce(
            (acc, feature) => {
                if (!feature) return acc
                const name = feature?.properties?.['name_en']
                const code = feature?.properties?.['adm0_a3']
                if (!name || !code) return acc

                const info = props.data[code]?.value
                if (!info) {
                    return {
                        ...acc,
                        [name]: {
                            default: {
                                stroke: true,
                                fillColor: 'grey',
                                color: 'grey',
                                weight: 1,
                                opacity: 0.5,
                                fillOpacity: 0.5,
                            },
                            hover: {
                                stroke: true,
                                fillColor: 'grey',
                                color: 'grey',
                                weight: 1,
                                opacity: 0.5,
                                fillOpacity: 0.5,
                            },
                        },
                    }
                }
                const scale = (v: number, min: number, max: number) => {
                    const range = max - min
                    return parseFloat(((v - min) / range).toFixed(3))
                }
                const p = scale(
                    props.perfectValue,
                    minMaxValue.min,
                    minMaxValue.max,
                )
                const v = scale(info, minMaxValue.min, minMaxValue.max)
                const positive = props.positiveColor ?? 'rgb(0, 153, 255)'
                const negative = props.negativeColor ?? 'rgba(255, 35, 0, 1)'
                const goodColor = props.invertColors ? negative : positive
                const badColoor = props.invertColors ? positive : negative
                const color = v > p ? badColoor : goodColor
                let opacity = 0
                const large = Math.max(p, 1 - p)
                if (v > p) {
                    opacity = scale(v, p, 1)
                } else {
                    opacity = scale(p - v, 0, large)
                }
                opacity = Math.max(opacity, 0.1)

                return {
                    ...acc,
                    [name]: {
                        default: {
                            stroke: true,
                            fillColor: color,
                            color: color,
                            weight: 1,
                            opacity: 0.5,
                            fillOpacity: opacity,
                        },
                        hover: {
                            stroke: true,
                            fillColor: color,
                            color: color,
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 1,
                        },
                    },
                }
            },
            {} as Record<string, { default: PathOptions; hover: PathOptions }>,
        )
        setCountryStyles(styles)
    }, [borders, minMaxValue, props.data, props.perfectValue])

    if (!borders) return <></>
    return (
        <>
            <FeatureGroup eventHandlers={handlerMap}>
                {borders.features.map((feature) => {
                    const name = feature?.properties?.['name_en'] || null
                    const code = feature?.properties?.['adm0_a3'] || null
                    if (!name || !code) return
                    const styles = countryStyles[name] || {}
                    return (
                        <Country
                            key={name}
                            id={code}
                            feature={feature}
                            isActive={props.activeValue === code}
                            defaultStyles={styles.default}
                            hoverStyles={styles.hover}
                            onClick={props.onCountryClick}
                        />
                    )
                })}
            </FeatureGroup>
        </>
    )
}

export interface MapProps {
    data: { [key: string]: { value: number } }
    perfectValue: number
    positiveColor?: string
    negativeColor?: string,
    invertColors?: boolean,
    activeValue: string | null,
    onCountryClick?: (key: string | null) => void
}
function ReactMapContainer(props: MapProps) {
    return (
        <div className={st.map}>
            <MapContainer
                center={[0, 0]}
                zoom={0}
                zoomSnap={0}
                scrollWheelZoom={false}
            >
                <ReactMap
                    data={props.data}
                    perfectValue={props.perfectValue}
                    positiveColor={props.positiveColor}
                    negativeColor={props.negativeColor}
                    invertColors={props.invertColors}
                    activeValue={props.activeValue}
                    onCountryClick={props.onCountryClick}
                />
            </MapContainer>
        </div>
    )
}
export default ReactMapContainer
