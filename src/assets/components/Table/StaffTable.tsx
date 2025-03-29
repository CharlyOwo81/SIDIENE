import React from 'react';
import { motion } from 'framer-motion';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import styles from '../../../pages/ManageStudents/ManageStudents.module.css';

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
  { field: 'curp', headerName: 'CURP', width: 200 },
  { field: 'nombres', headerName: 'Nombres', width: 150 },
  { field: 'apellidoPaterno', headerName: 'Apellido Paterno', width: 150 },
  { field: 'apellidoMaterno', headerName: 'Apellido Materno', width: 150 },
  { field: 'rol', headerName: 'Rol', width: 120 },
];

const StaffTable: React.FC<StaffTableProps> = ({ staff }) => {
  const rows = staff.map((staff) => ({
    id: staff.curp, // Unique ID for DataGrid
    ...staff,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={styles.tableContainer}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        className={styles.staffTable}
        autoHeight
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
            borderRadius: '12px',
            background: '#fff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          },
          '& .MuiDataGrid-columnHeaders': {
            background: 'linear-gradient(135deg, #891547 0%, #C26444 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.1rem',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(229, 130, 62, 0.1)',
            fontSize: '1rem',
            color: '#333',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(243, 196, 77, 0.1)',
            transition: 'background-color 0.3s ease',
          },
          '& .MuiDataGrid-footerContainer': {
            background: '#f9f9f9',
            borderTop: '1px solid rgba(229, 130, 62, 0.1)',
          },
        }}
      />
    </motion.div>
  );
};

export default StaffTable;