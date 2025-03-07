import cnn from '@/utils/ccn'
import st from './SlideSelector.module.scss'
import { useEffect, useMemo, useRef, useState } from 'react'
interface SlideSelectorProps {
    value: string
    min?: number
    max?: number
    step?: number
    options: (string | number | { title: string; value: string | number })[]
    onChange: (value: string | number) => void
}
function SlideSelector(props: Readonly<SlideSelectorProps>) {
    const [value, setValue] = useState<null | string | number>(props.value)
    const [nextValue, setNextValue] = useState<null | string | number>(null)
    const [side, setSide] = useState<'left' | 'right' | 'center' | null>(null)
    const [width, setWidth] = useState(0)

    const prevRef = useRef<HTMLDivElement>(null)
    const currentRef = useRef<HTMLDivElement>(null)
    const nextRef = useRef<HTMLDivElement>(null)
    const options = useMemo(() => {
        return props.options.map((option) => {
            if (typeof option === 'object') {
                return {
                    title: option.title,
                    value: option.value,
                }
            }
            return {
                title: option,
                value: option,
            }
        })
    }, [props.options])
    const onLeftClick = () => {
        if (side) return

        const currentIndex = options.findIndex(
            (option) => option.value === value,
        )
        const nextIndex = currentIndex - 1
        const newValue = options[nextIndex]?.value
        if (newValue) {
            setNextValue(newValue)
            setSide('right')
        }
    }
    const onRightClick = () => {
        if (side) return
        const currentIndex = options.findIndex(
            (option) => option.value === value,
        )
        const nextIndex = currentIndex + 1
        const newValue = options[nextIndex]?.value
        if (newValue) {
            setNextValue(newValue)
            setSide('left')
        }
    }
    const end = () => {
        setSide(null)
        if (nextValue) {
            setValue(nextValue)
            props.onChange(nextValue)
        }
    }

    useEffect(() => {
        if (currentRef.current && prevRef.current && nextRef.current && value) {
            const width = Math.max(
                currentRef.current.clientWidth,
                prevRef.current.clientWidth,
                nextRef.current.clientWidth,
            )
            if (width !== 0) setWidth(width)
        }
    }, [nextValue, value, options.length])

    const currentIndex = options.findIndex((option) => option.value === value)
    const prevIndex = currentIndex - 1
    const nextIndex = currentIndex + 1
    
    if (!options[currentIndex]?.title) {
        return null
    }
    return (
        <div className={st.container}>
            <button
                onClick={onLeftClick}
                className={st.left}
                style={{
                    opacity: options[prevIndex]?.title ? 1 : 0,
                }}
            ></button>
            <div
                className={st['value-container']}
                style={{
                    width: width,
                }}
            >
                <div
                    className={cnn({
                        [st['dummy-value']]: true,
                        [st['value']]: true,
                    }).join(' ')}
                    style={{
                        width: width,
                    }}
                >
                    {options[currentIndex]?.title}
                </div>
                <div
                    className={cnn({
                        [st['float-value']]: true,
                        [st[`float-value--${side}`]]: side,
                    }).join(' ')}
                >
                    <div
                        className={cnn({
                            [st['prev-value']]: true,
                            [st['value']]: true,
                        }).join(' ')}
                        style={{
                            width: width,
                        }}
                    >
                        <div ref={prevRef} className={st['value-style']}>
                            {options[prevIndex]?.title}
                        </div>
                    </div>
                    <div
                        className={cnn({
                            [st['current-value']]: true,
                            [st['value']]: true,
                        }).join(' ')}
                        onTransitionEnd={end}
                        style={{
                            width: width,
                        }}
                    >
                        {options[currentIndex]?.title && (
                            <div ref={currentRef} className={st['value-style']}>
                                {options[currentIndex]?.title}
                            </div>
                        )}
                    </div>
                    <div
                        className={cnn({
                            [st['next-value']]: true,
                            [st['value']]: true,
                        }).join(' ')}
                        style={{
                            width: width,
                            opacity: options[nextIndex]?.title ? 1 : 0,
                        }}
                    >
                        <div ref={nextRef} className={st['value-style']}>
                            {' '}
                            {options[nextIndex]?.title}
                        </div>
                    </div>
                </div>
            </div>
            <button
                onClick={onRightClick}
                className={st.right}
                style={{
                    opacity: options[nextIndex]?.title ? 1 : 0,
                }}
            ></button>
        </div>
    )
}

export default SlideSelector
