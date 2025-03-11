import { MapNavigation } from '@/components/MapNavigation/MapNavigation'
import st from './layout.module.scss'
export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className={st.layout}>
            <div className={st.header}>
                {' '}
                <MapNavigation />
            </div>

            <div className={st.map}>{children}</div>
        </div>
    )
}
