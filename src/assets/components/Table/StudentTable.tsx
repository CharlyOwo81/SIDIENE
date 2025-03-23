// components/StudentTable/StudentTable.tsx
import React from "react";
import { motion } from "framer-motion";
import styles from "../../../pages/ManageStudents/ManageStudents.module.css";

interface Student {
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado: string;
  grupo: string;
  anio_ingreso: string;
}

interface StudentTableProps {
  students: Student[];
}

const StudentTable: React.FC<StudentTableProps> = ({ students }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Nombre Completo</th>
          <th>Grado y Grupo</th>
          <th>CURP</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <motion.tr
            key={student.curp}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <td>{`${student.nombres} ${student.apellidoPaterno} ${student.apellidoMaterno}`}</td>
            <td>{`${student.grado} - ${student.grupo}`}</td>
            <td>{student.curp}</td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;