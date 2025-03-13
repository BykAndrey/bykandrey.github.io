import MapPage from '@/components/MapPage/MapPage'


import type { Metadata,  } from 'next'

type Props = {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // read route params
    const { id } = await params

    const stats = (await import('@/assets/data/statisticsData.json'))
        .default as Record<
        string,
        {
            meta: {
                title: string
                description: string
                canonical: string
                keywords: string
            }
        }
    >
    const statData = stats[id]
    const meta = statData.meta
    return {
        title: meta.title,
        description: meta.description,
        openGraph: {
            title: meta.title,
            description: meta.description,
        },
    }
}
export default async function Page({
    params,
}: {
    params: Promise<{
        id: string
        meta: {
            title: string
            description: string
            canonical: string
            keywords: string
        }
    }>
}) {
    const { id } = await params

    return (
        <>
            <MapPage id={id} />
        </>
    )
}

export async function generateStaticParams() {
    const posts = (await import('@/assets/data/statisticsData.json')).default
    return Object.entries(posts).map(([id]) => {
        return {
            id: id,
        }
    })
}

export const dynamicParams = false
