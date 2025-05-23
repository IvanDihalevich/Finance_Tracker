import styles from "../../css/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerDarkContainer}>
        <div className={styles.footerDarkContent}>
          <h6>About</h6>
          <p>
            FinanceTracker.com — платформа для ефективного управління фінансами,
            створена студентами факультету комп’ютерних наук НУОА.
          </p>
        </div>
        <div className={styles.footerDarkBottom}>
          <p>
            © 2025 Всі права захищені. Дігалевич Іван та Максим Кошин.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
