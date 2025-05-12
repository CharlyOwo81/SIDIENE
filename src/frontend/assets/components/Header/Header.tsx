import styles from "././Header.module.css";
import gobSon from "../../../../../public/GobSonora.svg";
import logoEsc from "../../../../../public/Tecnica 56.svg";

type Props = {};

function Header({}: Props) {
  return (
    <header className={styles.header}>
      <img
        src={logoEsc}
        alt="Logo Tecnica 56"
        className={styles.logoLeft}
      />
      <p className={styles.headertext}>
        Sistema de Digitalización de Expedientes e Incidencias para la Nueva
        Escuela
      </p>
      <img
        src={gobSon}
        alt="Logo Gobierno de Sonora"
        className={styles.logoRight}
      />
    </header>
  );
}

export default Header;
