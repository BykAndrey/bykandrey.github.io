import Link from 'next/link';
import st from './StatisticsList.module.scss'




const ListItem: React.FC<{ id: string; title: string; href: string, description: string, tags: string[] }> = (
    props,
) => {
    return (
        <li className={st.listItem}>
            <div>
            <Link href={props.href} className={st.name}>{props.title}</Link>
            <div className={st.tags}>{props.tags.map(tag => <span className={st.tag} key={tag}>{tag}</span>)}</div>
            </div>
            
            
            <div className={st.description}>
                {props.description}
            </div>
            
        </li>
    )
}

export const StatisticsList: React.FC<{
    items: {id:string, name: string, href: string, description: string, tags: string[]}[]
}> = (props) => {
    return <ul className={st["list"]}>
    {props.items.map((i) => {
        return (
            <ListItem
                key={i.id}
                title={i.name}
                id={i.id}
                href={'/map/' + i.id}
                description={i.description}
                tags={i.tags}
            />
        )
    })}
</ul>
}