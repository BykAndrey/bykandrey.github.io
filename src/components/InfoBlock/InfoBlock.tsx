import { PropsWithChildren } from 'react'
import st from './InfoBlock.module.scss'
interface Props {
    id: string,
    title?: string,
    isShowAddToCompare?: boolean
    onAddToCompare?: (id: string) => void
}
export const InfoBlock = (props: PropsWithChildren<Props>) => {
    const handlerCompare  = ()  => {
        props.onAddToCompare?.(props.id)
    }
    return (
        <div className={st.info}>
            <h1>{props.title}</h1>
            <div className={st.params}>{props.children}</div>

            {props.isShowAddToCompare && (
                <button className={st.compareBtn} onClick={handlerCompare}>
                    add to compare
                </button>
            )}
        </div>
    )
}
