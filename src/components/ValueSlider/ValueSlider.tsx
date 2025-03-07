import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import st from './ValueSlider.module.scss'
import React from 'react'
interface Props {
    min: number
    max: number
    step: number
    value: number
    onChange: (value: number | number[]) => void
    formatValue?: (value: number) => string
}
export default class ValueSlider extends React.Component<Props> {
    formatValue(v: number): string {
        if (!this.props.formatValue) return v.toString()
        return this.props.formatValue(v)
    }
    render() {
        return (
            <div className={st.slider}>
                <div className={st.values}>
                    <div className={st.value + ' ' + st.valueMin}>{this.formatValue(this.props.min)}</div>
                    <div className={st.value + ' ' + st.valueCurrent}>{this.formatValue(this.props.value)}</div>
                    <div className={st.value + ' ' + st.valueMax}>{this.formatValue(this.props.max)}</div>
                </div>

                <Slider
                    defaultValue={this.props.value}
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                    onChange={this.props.onChange}
                />
            </div>
        )
    }
}
