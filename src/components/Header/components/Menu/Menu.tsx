import Link from 'next/link';
import st from './Menu.module.scss'
export const Menu = () => {
  return (
    <nav className={st.menu}>
      <ul>
      <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/statistics">Statistics</Link>
        </li>
      </ul>
    </nav>
  );
};
