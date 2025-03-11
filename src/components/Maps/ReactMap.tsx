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
// import L from 'leaflet'
// import { flatten } from '@turf/turf'
function loadBorders() {
    return fetch(PUBLIC_BASE_URL + '/data/World.json').then((res) => res.json())
}

// const NumberMarker = ({ number, position }) => {
//     const map = useMap()

//     const div = L.DomUtil.create('div', 'number-marker')
//     div.innerHTML = number

//     L.DomEvent.disableClickPropagation(div)

//     const marker = L.marker(position, {
//         icon: L.divIcon({
//             html: div,
//             className: 'number-marker',
//             iconSize: [30, 30],
//         }),
//     }).addTo(map)

//     return null
// }

function Country(props: {
    id: string
    feature: GeoJSON.Feature
    defaultStyles: PathOptions
    hoverStyles: PathOptions
    isActive: boolean,
    value: number,
    onClick?: (code: string | null, feature: object) => void
}) {
    // const [features, setFeatures] = useState<GeoJSON.Feature[]>(() => {
    //     if (props.feature?.geometry.type === 'MultiPolygon') {
    //         const polygons = flatten(props.feature);
    //         return polygons.features as GeoJSON.Feature[]
    //     } else if (props.feature?.geometry.type === 'Polygon') {
    //         return [props.feature]
    //     }
    // })
    const map = new Map()

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

    // useEffect(() => {
    //     if (props.feature?.geometry.type === 'MultiPolygon') {
    //         const polygons = flatten(props.feature);
    //         setFeatures(polygons.features as GeoJSON.Feature[])
    //     } else if (props.feature?.geometry.type === 'Polygon') {
    //         setFeatures([props.feature])
    //     }
    // }, [props.feature]);

    // if (features.length === 0) return null
    // return features.map((p, index) => {
    //     return (
    //         <GeoJSON
    //             key={props.id + '-' + index}
    //             data={p}
    //             style={props.isActive ? props.hoverStyles : props.defaultStyles}
    //             eventHandlers={handlerCountry}
    //         >
    //             {/* {' '} */}
    //             {/* <NumberMarker number={1} position={[0, 0]} /> */}
    //             <Tooltip sticky direction="top">
    //                 {props.feature.properties?.['name_en']} : {props.value}
    //             </Tooltip>
    //         </GeoJSON>
    //     )
    // })

    return (
        <GeoJSON
            data={props.feature}
            style={props.isActive ? props.hoverStyles : props.defaultStyles}
            eventHandlers={handlerCountry}
        >
            <Tooltip sticky direction="top">
                {props.feature.properties?.['name_en']} : {props.value}
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
    isShowValues?: number
    borders: GeoJSON.FeatureCollection
    onCountryClick?: (countryCode: string | null) => void
}) {
    const [countryStyles, setCountryStyles] = React.useState<
        Record<string, { default: PathOptions; hover: PathOptions }>
    >({})
    const [minMaxValue, setMinMaxValue] = React.useState<{
        min: number
        max: number
    }>({ min: Infinity, max: -Infinity })

    const map = useMap()

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
                const v = event.sourceTarget.getBounds()
                if (v) map.fitBounds(v)
            },
        }),
        [map],
    )

    useEffect(() => {
        if (!props.borders) return

        const styles = props.borders.features.reduce(
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
    }, [props.borders, minMaxValue, props.data, props.perfectValue])
    return (
        <FeatureGroup eventHandlers={handlerMap}>
            {props.borders.features.map((feature) => {
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
                        value={props.data[code]?.value}
                    />
                )
            })}
        </FeatureGroup>
    )
}

export interface MapProps {
    data: { [key: string]: { value: number } }
    perfectValue: number
    positiveColor?: string
    negativeColor?: string
    invertColors?: boolean
    activeValue: string | null
    isShowValues?: number
    onCountryClick?: (key: string | null) => void
}
function ReactMapContainer(props: MapProps) {
    const [borders, setBorders] = React.useState<GeoJSON.FeatureCollection>()

    useEffect(() => {
        loadBorders().then((borders) => {
            setBorders(borders as GeoJSON.FeatureCollection)
        })
    }, [])
    if (!borders) return null
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
                    isShowValues={props.isShowValues}
                    activeValue={props.activeValue}
                    borders={borders}
                    onCountryClick={props.onCountryClick}
                />
            </MapContainer>
        </div>
    )
}
export default ReactMapContainer
