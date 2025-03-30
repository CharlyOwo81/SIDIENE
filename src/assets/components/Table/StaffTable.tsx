import React from "react";
import { motion } from "framer-motion";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import styles from "./Table.module.css"; // Import the new CSS module

interface Staff {
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rol: string;
}

interface StaffTableProps {
  staff: Staff[];
}

const columns: GridColDef[] = [
  { field: "curp", headerName: "CURP", width: 200 },
  { field: "nombres", headerName: "Nombres", width: 150 },
  { field: "apellidoPaterno", headerName: "Apellido Paterno", width: 150 },
  { field: "apellidoMaterno", headerName: "Apellido Materno", width: 150 },
  { field: "rol", headerName: "Rol", width: 120 },
];

const StaffTable: React.FC<StaffTableProps> = ({ staff }) => {
  const rows = staff.map((staffMember) => ({
    id: staffMember.curp, // Unique ID for DataGrid
    ...staffMember,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
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

export default StaffTable;