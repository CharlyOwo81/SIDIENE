import React from 'react';
import InputField from './InputField';
import Label from '../Label/Label';
import styles from './ManageStudents.module.css';

interface GradoGrupoProps {
  grado: string;
  grupo: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GradoGrupo: React.FC<GradoGrupoProps> = ({ grado, grupo, onChange }) => {
  return (
    <div className={styles.gradoGrupoContainer}>
      <div className={styles.gradoGrupoField}>
        <Label htmlFor="grado">Grado</Label>
        <InputField
                  type="text"
                  name="grado"
                  value={grado}
                  onChange={onChange}
                  maxLength={1} // Assuming single digit for grado
                  className={styles.compactInput} placeholder={''}        />
      </div>
      
      <div className={styles.gradoGrupoField}>
        <Label htmlFor="grupo">Grupo</Label>
        <InputField
                  type="text"
                  name="grupo"
                  value={grupo}
                  onChange={onChange}
                  maxLength={1} // Assuming single character for grupo
                  className={styles.compactInput} placeholder={''}        />
      </div>
    </div>
  );
};

export default GradoGrupo;