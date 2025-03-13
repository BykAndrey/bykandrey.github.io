import StatisticsService from '@/core/services/StatisticsService'
import React from 'react'
import st from './styles.module.scss'
import { StatisticsList } from '@/components/StatisticsList/StatisticsList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Statistics',
}
const Page = async () => {
    const info = (await StatisticsService.getStatisticsInfo().then((data) =>
        data.map((i) => {
            return {
                ...i,

                href: '/map/' + i.id,
            }
        }),
    )) as {
        id: string
        name: string
        description: string
        href: string
        tags: string[]
    }[]
    return (
        <div className={'container ' + st['page']}>
            <h1>Statistics:</h1>
            <div className={st.stats}>
                <StatisticsList items={info} />
            </div>
        </div>
    )
}

export default Page
