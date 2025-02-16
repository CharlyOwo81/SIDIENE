import styles from "./Footer.module.css";

type Props = {};

function Footer({}: Props) {
  return (
    <footer className={styles.footer}>
      <p>Footer</p>
    </footer>
  );
}

export default Footer;
