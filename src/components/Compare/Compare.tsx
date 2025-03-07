import st from './Compare.module.scss'

const CompareItem = (props: {
    id: string,
    name: string,
    value: string,
    onRemove: (id: string) => void,
    
}) => {
    const handlerRemove = () => {
        props.onRemove(props.id)
    }
    return <div className={st.item}>
        <button className={st.remove} onClick={handlerRemove}>remove</button>
        <h2>{props.name}</h2>
        <div className={st.itemValue}>{props.value}</div>
    </div>
}
interface Option {
    id: string
    name: string
    value: string
}
const Compare = (props: {
    options: Option[],
    onItemRemove: (id: string) => void,
})=> {
    return <div className={st.compare}>
        {props.options.map((option) => <CompareItem key={option.name} id={option.id} name={option.name} value={option.value} onRemove={props.onItemRemove}/> )}
    </div>
}


export default Compare  