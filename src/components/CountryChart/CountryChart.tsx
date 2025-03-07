import st from './CountryChart.module.scss'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
)

const colorPairs = [
    {
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
        borderColor: 'rgb(68, 235, 53)',
        backgroundColor: 'rgba(68, 235, 53, 0.5)',
    },
]

export const CountryChart = (props: {
    data: { title: string; labels: string[]; values: number[] }[]
    min: number
    max: number
    centerTo: string
    onClose: () => void
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [isRelativeToWorld, setRelativeToWorld] = useState(false)
    useEffect(() => {
        if (containerRef.current) {
            setSize({
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight,
            })
        }
    }, [])
    const data = useMemo(() => {
        if (props.data.length === 0)
            return {
                labels: [],
                datasets: [],
            }

        return {
            labels: props.data[0].labels,
            datasets: props.data.map((data, index) => {
                return {
                    label: data.title,
                    data: data.values,
                    borderColor: colorPairs[index].borderColor,
                    backgroundColor: colorPairs[index].backgroundColor,
                }
            }),
        }
    }, [props.data])
    const options = useMemo(() => {
        return {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: isRelativeToWorld ? {
                y: {
                    suggestedMin: props.min,
                    suggestedMax: props.max,
                },
            } : {},
        }
    }, [props.max, props.min,isRelativeToWorld])

    useEffect(() => {
        if (containerRef.current && props.data[0]?.values?.length) {
            const v = props.data[0]?.labels.findIndex(
                (v) => v === props.centerTo,
            )
            const p = v / props.data[0]?.labels.length
            const position = Math.max(
                Math.min(
                    containerRef.current.scrollWidth * p,
                    containerRef.current.scrollWidth -
                        containerRef.current.clientWidth,
                ),
                0,
            )
            if (containerRef.current.scrollLeft !== position)
                containerRef.current.scrollTo({
                    top: 0,
                    left: containerRef.current.scrollWidth * p,
                })
        }
    }, [props.data, props.centerTo, size])
    return (
        <div
            className={st.chart}
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <label> 
             
                <input type="checkbox" onChange={(e) => setRelativeToWorld(e.target.checked)} checked={isRelativeToWorld}/>
                <span> is relatively to world?</span>
            </label>
            <div className={st.names}>
                {props.data.map((d, index) => {
                    return (
                        <span
                            key={d.title}
                            style={{
                                color: colorPairs[index].borderColor,
                            }}
                        >
                            {d.title}
                        </span>
                    )
                })}
            </div>
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    // height: '100%',
                    overflowX: 'hidden',
                    flex: '1 0 auto'
                }}
            >
                {containerRef.current &&
                    size.height !== 0 &&
                    size.width !== 0 && (
                        <div
                            style={{
                                width: size.width * 2,
                                height: size.height,
                            }}
                        >
                            <Line
                                options={options}
                                data={data}
                                width={size.width * 2}
                                height={size.height}
                            />
                        </div>
                    )}
                <button className={st.close} onClick={props.onClose}>
                    Close
                </button>
            </div>
        </div>
    )
}
