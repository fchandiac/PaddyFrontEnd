'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useReceptionContext } from '@/context/ReceptionDataContext';

export default function ReceptionSummary() {
  const { data } = useReceptionContext();

  const totalConDescuentos = data.postTotal;
  const totalAPagar = data.totalToPay;

  return (
    <Box
      sx={{
        bgcolor: '#f7f7f7',
        p: 2,
        borderRadius: 2,
        border: '1px solid #ccc',
      }}
    >
      <table
        style={{
          width: '100%',
          fontSize: 12,
          borderCollapse: 'collapse',
        }}
      >
        <tbody>
          <tr>
            <td>Kg Bruto:</td>
            <td style={{ textAlign: 'right' }}>
              {data.grossWeight.toLocaleString('es-CL', {
                minimumFractionDigits: 2,
              }) + ' kg'}
            </td>
          </tr>
          <tr>
            <td>Tara:</td>
            <td style={{ textAlign: 'right' }}>
              {data.tare.toLocaleString('es-CL', {
                minimumFractionDigits: 2,
              }) + ' kg'}
            </td>
          </tr>
          <tr>
            <td>Peso neto:</td>
            <td style={{ textAlign: 'right' }}>
              {data.netWeight.toLocaleString('es-CL', {
                minimumFractionDigits: 2,
              }) + ' kg'}
            </td>
          </tr>
          <tr>
            <td style={{ color: 'red' }}>Total descuento:</td>
            <td style={{ textAlign: 'right', color: 'red' }}>
              {data.totalDiscounts.toLocaleString('es-CL', {
                minimumFractionDigits: 2,
              }) + ' kg'}
            </td>
          </tr>
          <tr>
            <td style={{ color: '#1976d2' }}>Bonificación:</td>
            <td style={{ textAlign: 'right', color: '#1976d2' }}>
              {data.weightBonificacion.toLocaleString('es-CL', {
                minimumFractionDigits: 2,
              }) + ' kg'}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Total con descuentos:</strong>
            </td>
            <td style={{ textAlign: 'right' }}>
              <strong>
                {totalConDescuentos.toLocaleString('es-CL', {
                  minimumFractionDigits: 2,
                }) + ' kg'}
              </strong>
            </td>
          </tr>
          <tr>
            <td>
              <strong style={{ color: 'green' }}>Total a pagar:</strong>
            </td>
            <td style={{ textAlign: 'right', color: 'green' }}>
              <strong>
                {totalAPagar.toLocaleString('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
                })}
              </strong>
            </td>
          </tr>
          <tr>
            <td>
              <em>Secado:</em>
            </td>
            <td style={{ textAlign: 'right' }}>
              {data.percentSecado.toFixed(2)}%
            </td>
          </tr>
        </tbody>
      </table>
    </Box>
  );
}
