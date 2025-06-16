'use client';
import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

// Datos de ejemplo para la tabla de liquidaciones
const sampleSettlements = [
  { 
    id: 1, 
    date: '2025-06-01', 
    producer: 'Productor 1', 
    totalWeight: 12500, 
    totalAmount: 8750000,
    status: 'Pagada' 
  },
  { 
    id: 2, 
    date: '2025-06-05', 
    producer: 'Productor 2', 
    totalWeight: 8300, 
    totalAmount: 5810000,
    status: 'Pendiente' 
  },
  { 
    id: 3, 
    date: '2025-06-08', 
    producer: 'Productor 3', 
    totalWeight: 15200, 
    totalAmount: 10640000,
    status: 'Procesando' 
  },
];

// Definición de columnas para la tabla
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'date', headerName: 'Fecha', width: 130 },
  { field: 'producer', headerName: 'Productor', width: 200 },
  { 
    field: 'totalWeight', 
    headerName: 'Peso Total (kg)', 
    type: 'number', 
    width: 150,
   
  },
  { 
    field: 'totalAmount', 
    headerName: 'Monto Total ($)', 
    type: 'number', 
    width: 150,

  },
  { field: 'status', headerName: 'Estado', width: 130 },
];

export default function SettlementsList() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Listado de Liquidaciones
      </Typography>
      <DataGrid
        rows={sampleSettlements}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </Box>
  );
}
