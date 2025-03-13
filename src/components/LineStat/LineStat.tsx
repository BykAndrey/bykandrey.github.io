'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import st from './LineStat.module.scss'
import { formatNumber } from '@/utils/formatNumber';
interface Props {
    options: { title: string; value: number; color?: string }[]
    side?: string
}

const sortOptions = (options: Props['options']): Props['options'] => {
    return options.slice(0).sort((a, b) => {
        return a.value > b.value ? -1 : 1
    })
}

const Option: React.FC<{
    title: string
    valuePercentage: number
    value: number
    positions: number
    color?: string
    side: string
    disableAnimaition: boolean
}> = (props) => {
    return (
        <div
            className={`${st.line} ${st['lineSide' + props.side]} ${props.disableAnimaition ? st.disabled : ''}`}
            style={{
                transform: `translateY(${props.positions}px)`,
            }}
        >
            <div className={st.title}>{props.title}</div>
            <div className={st.valueContainer}>
                <div
                    className={st.value}
                    style={{
                        width: props.valuePercentage + '%',
                        backgroundColor: props.color ?? 'red',
                    }}
                >
                    {formatNumber(props.value)}
                </div>
            </div>
        </div>
    )
}
const LineStat: React.FC<Props> = (props) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [options, setOptions] = useState(() => {
        return sortOptions(props.options.slice(0))
    })
    const [positions, setPositions] = useState<{ [key: string]: number }>({})
    useEffect(() => {
        const options = props.options.slice(0)
        setOptions(options)

        setPositions((positions) => {
            return options.slice(0).reduce(
                (acc, option, index) => {
                    return {
                        ...acc,
                        [option.title]: positions[option.title]
                            ? index * 30
                            : options.length * 30,
                    }
                },
                {} as { [key: string]: number },
            )
        })
        setTimeout(() => {
            setPositions(
                options.slice(0).reduce(
                    (acc, option, index) => {
                        return {
                            ...acc,
                            [option.title]: index * 30,
                        }
                    },
                    {} as { [key: string]: number },
                ),
            )
        }, 0)
    }, [props.options])
    const maxValue = useMemo(() => {
        return sortOptions(options.slice(0))[0]?.value || 0
    }, [options])

    const scale = (v: number) => (v / maxValue) * 100
    return (
        <div
            ref={containerRef}
            className={st.container}
            style={{
                height: options.length * 30,
            }}
        >
            {props.options.map((option) => (
                <Option
                    disableAnimaition={!positions[option.title]}
                    key={option.title}
                    side={props.side ?? 'left'}
                    title={option.title}
                    valuePercentage={scale(option.value)}
                    positions={positions[option.title] || 0}
                    color={option.color}
                    value={option.value}
                />
            ))}
        </div>
    )
}

export default LineStat
