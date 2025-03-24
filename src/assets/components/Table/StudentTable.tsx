// src/assets/components/Table/StudentTable.tsx
import React from "react";
import { motion } from "framer-motion";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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

const columns: GridColDef[] = [
  { field: "curp", headerName: "CURP", width: 200 },
  { field: "nombres", headerName: "Nombres", width: 150 },
  { field: "apellidoPaterno", headerName: "Apellido Paterno", width: 150 },
  { field: "apellidoMaterno", headerName: "Apellido Materno", width: 150 },
  { field: "grado", headerName: "Grado", width: 100 },
  { field: "grupo", headerName: "Grupo", width: 100 },
];

const StudentTable: React.FC<StudentTableProps> = ({ students }) => {
  // Map students to include an 'id' field required by DataGrid (using curp as unique identifier)
  const rows = students.map((student) => ({
    id: student.curp, // DataGrid requires a unique 'id' field
    ...student,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.tableContainer}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        className={styles.table}
        autoHeight
        disableRowSelectionOnClick
      />
    </motion.div>
  );
};

export default StudentTable;