import Link from "next/link"
import headerStyles from "../styles/Header.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Nav from "./Nav"
export default function Header() {
  return (
    <>
      <div className={headerStyles.header}>
        <div className={headerStyles.infoheader}>
          <h1>Saver Tounsi</h1>
          <h3>chaque dinar, chaque rêve</h3>
        </div>
      </div>
    </>
  );
}

