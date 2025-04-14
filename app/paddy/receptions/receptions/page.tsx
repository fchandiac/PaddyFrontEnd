'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { getReceptionResumen } from '@/app/actions/reception';
import AppDataGrid from '@/components/appDataGrid/AppDataGrid'; // ajusta ruta si cambia
import { AnyARecord } from 'node:dns';

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const fetchReceptions = async () => {
      const data = await getReceptionResumen();
      setRows(data || []);
    };

    fetchReceptions();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'riceType', headerName: 'Tipo de arroz', flex: 1 },
    { field: 'producer', headerName: 'Productor', flex: 1.5 },
    { field: 'guide', headerName: 'Guía', flex: 1 },
    { field: 'licensePlate', headerName: 'Patente', flex: 1 },
    {
      field: 'price',
      headerName: 'Precio',
      type: 'number',
      flex: 1,
      valueFormatter: (params:any) =>
        params.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }),
    },
    {
      field: 'grossWeight',
      headerName: 'Bruto (kg)',
      type: 'number',
      width: 120,
      valueFormatter: (params:any) =>
        params.toLocaleString('es-CL', { minimumFractionDigits: 2 }),
    },
    {
      field: 'netWeight',
      headerName: 'Neto (kg)',
      type: 'number',
      width: 120,
      valueFormatter: (params:any) =>
        params.toLocaleString('es-CL', { minimumFractionDigits: 2 }),
    },
    {
      field: 'totalConDescuentos',
      headerName: 'Total c/ desc.',
      type: 'number',
      width: 140,
      valueFormatter: (params:any) =>
        params.toLocaleString('es-CL', { minimumFractionDigits: 2 }),
    },
    {
      field: 'totalToPay',
      headerName: 'Total a pagar',
      type: 'number',
      width: 160,
      valueFormatter: (params:any) =>
        params.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }),
    },
  ];

  return (
    <Box p={2}>
      <AppDataGrid
        title="Recepciones"
        rows={rows}
        columns={columns}
        height={'80vh'}
      />
    </Box>
  );
}
