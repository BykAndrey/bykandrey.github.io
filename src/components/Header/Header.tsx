import { Menu } from './components/Menu/Menu'
import styles from './Header.module.scss'
export const Header = () => {
    return <header className={styles.header}>
        
        <div className={
            "container "+ styles.container
        }>
            <div className={styles.logo}>logo</div>
            <Menu/>
        </div>
    </header>
}