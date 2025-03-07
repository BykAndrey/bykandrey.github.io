import st from './ValueRange.module.scss';
interface Props {
    value: number,
    min: number,
    max: number,
    onChange: (v: number) => void,
}
const ValueRange = (props: Props) => {
    return <div className={st.range}>
        <div className={[st.min, st.edgeValue].join(' ')}> {props.min} </div>
        {props.value}
        <div className={[st.max, st.edgeValue].join(' ')}> {props.max} </div>
        <div className={st.rail}>
        <div className={st.drag}></div>
        </div>
        
    </div>
}

export default ValueRange;