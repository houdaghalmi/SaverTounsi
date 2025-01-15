import footerStyles from "../styles/Footer.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook,faLinkedin } from '@fortawesome/free-brands-svg-icons';
export default function Footer() {
  return (
    <>
      <div className={footerStyles.footer}>
        <div className="socialmedia">
          <a href="#" aria-label="Facebook">
          <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="#" aria-label="LinkedIn">
          <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
        <p>© 2025 SAVER TOUNSI</p>
      </div>
    </>
  );
}

