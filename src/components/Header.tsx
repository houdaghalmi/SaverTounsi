import headerStyles from "../styles/Header.module.css"
export default function Header() {
  return (
    <>
      <div className={headerStyles.header}>
        <div className={headerStyles.infoheader}>
          <h1>Saver Tounsi</h1>
          <h3>chaque dinar, chaque rêve</h3>
          <p>Elli ysob ma ykhebbich 
            manage better ,live better

          </p>
        </div>
      </div>
    </>
  );
}

