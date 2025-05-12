// PDFModal.tsx
import React from "react";
import styles from "./PDFModal.module.css";

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
}

const PDFModal: React.FC<PDFModalProps> = ({ isOpen, onClose, pdfUrl }) => {
  if (!isOpen || !pdfUrl) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <iframe
          src={pdfUrl}
          title="PDF Viewer"
          className={styles.pdfViewer}
        />
      </div>
    </div>
  );
};

export default PDFModal;