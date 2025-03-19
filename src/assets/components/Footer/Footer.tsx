import styles from "./Footer.module.css";

type Props = {};

function Footer({}: Props) {
  return (
    <footer className={styles.footer}>
      <p>Escuela Secundaria Técnica No. 56 "José Luis Osuna Villa"</p>
    </footer>
  );
}

export default Footer;
