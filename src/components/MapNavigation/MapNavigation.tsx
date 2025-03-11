import React from "react";
import st from './MapNavigation.module.scss'
import Link from "next/link";
export const MapNavigation: React.FC<object> = () => {
    return <header className={st.header}>
        <nav className={st.nav}> 
            <ul className={st.menu}>
            <li className={st.menuItem}>
                    <Link href="/">Home</Link>
                </li>
                <li className={st.menuItem}>
                    <Link href="/statistics">Statistics</Link>
                </li>
            </ul>
        </nav>
    </header>
}