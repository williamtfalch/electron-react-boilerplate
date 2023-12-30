/* eslint-disable import/prefer-default-export */
import { Link, Outlet } from 'react-router-dom';
import styles from './styles.module.css';

export function Layout() {
  return (
    <div className={styles.container}>
      <div className={styles.navbarOuter}>
        <div className={styles.navbarInner}>
          <Link to="/Klick3R" className={styles.item}>
            Klick3R's TK checker
          </Link>
          {/*<Link to="/seeding" className={styles.item}>
            Seeding
  </Link>*/}
          <Link to="/scout" className={styles.item}>
            Scout
          </Link>
        </div>
      </div>

      <div className={styles.spacer} />

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
