import { Header } from '@/components/Header/Header'

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Header />
            <div className="container">{children}</div>
        </>
    )
}
