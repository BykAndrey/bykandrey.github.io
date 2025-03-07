'use client'

import StatisticsService from '@/core/services/StatisticsService'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import st from './styles.module.scss'

const ListItem: React.FC<{ id: string; title: string; href: string, description: string }> = (
    props,
) => {
    return (
        <li className={st.listItem}>
            <Link href={props.href}>{props.title}</Link>
            <div>
                {props.description}
            </div>
        </li>
    )
}
const Page = () => {
    const [info, setInfo] = useState<
        { id: string; name: string; description: string }[]
    >([])
    useEffect(() => {
        StatisticsService.getStatisticsInfo().then((data) => {
            setInfo(data)
        })
    }, [])
    console.log('', info)
    return (
        <div className={'container ' + st['page']}>
            <h1>Statistics:</h1>
            <div>
                <ul className={st["list"]}>
                    {info.map((i) => {
                        return (
                            <ListItem
                                key={i.id}
                                title={i.name}
                                id={i.id}
                                href={'/map/' + i.id}
                                description={i.description}
                            />
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Page
