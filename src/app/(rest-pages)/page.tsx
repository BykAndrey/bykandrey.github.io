import st from './page.module.css'
import { StatisticsList } from '@/components/StatisticsList/StatisticsList'
// import { useEffect, useState } from 'react'
import StatisticsService from '@/core/services/StatisticsService'
// props: {
//     statistics: {
//         id: string
//         name: string
//         description: string
//         href: string
//         tags: string[]
//     }[]
// }
export default async function Home() {
    const items = await StatisticsService.getStatisticsInfo().then((data) => {
        return data.map((i) => {
            return {
                ...i,

                href: '/map/' + i.id,
            }
        })
    })
    return (
        <>
           
            <div className={st.page}>
            <h1>GeoMapStats.com</h1>
                <main className={st.main}>
                    <h2>Statistics:</h2>
                    <div className={st.stats}>
                        <StatisticsList items={items} />
                    </div>
                </main>
            </div>
        </>
    )
}

// export async function getStaticProps() {
//     const data = await StatisticsService.getStatisticsInfo().then((data) => {
//         return data.map((i) => {
//             return {
//                 ...i,

//                 href: '/map/' + i.id,
//             }
//         })
//     })

//     return {
//         props: {
//             statistics: data,
//         },
//     }
// }
