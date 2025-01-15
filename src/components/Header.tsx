import Link from "next/link"
import headerStyles from "../styles/Header.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons';
export default function Header() {
  return (
    <>
      <div className={headerStyles.header}>
        <div className={headerStyles.infoheader}>
          <h1>Saver Tounsi</h1>
          <h3>chaque dinar, chaque rêve</h3>
        </div>
        <nav className={headerStyles.nav} >
          <Link href="/">
          <FontAwesomeIcon icon={faHouse} className="text-black" />
          <p>HOME</p>
          </Link>
          <Link href="/features">
            <p>BUDGETING FEATURES</p>
          </Link>
          <Link href="/manager">
            <p>BUDGET MANAGER</p>
          </Link>
          <Link href="/statistic">
            <p>STATISTIC</p>
          </Link>
        </nav>
      </div>
    </>
  );
}

