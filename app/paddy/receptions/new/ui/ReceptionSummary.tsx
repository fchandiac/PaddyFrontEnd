// ui/ReceptionSummary.tsx
'use client';

import { useReceptionContext } from '@/context/ReceptionDataContext';
import React from 'react';
import { DataReceptionContextType, ParamTableEntry } from '@/types/reception';
import { TemplateType } from '@/types/discount-template'; 
import { Box } from '@mui/material';


export interface ReceptionSummaryProps {
  template: TemplateType;
  loadingTemplate?: boolean;
}

export default function ReceptionSummary({  }: ReceptionSummaryProps) {
  const { liveClusters } = useReceptionContext();

  return (
    <Box sx={{
      border: '1px solid #1976d2',
      borderRadius: 2,
      p: 2,
      mb: 2,
      background: '#f7fafd',
    }}>
      <Box component="dl" sx={{ m: 0 }}>
        <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Box component="dt">Peso Bruto</Box>
          <Box component="dd">{isNaN(liveClusters.grossWeight.node.value) ? '0 kg' : `${liveClusters.grossWeight.node.value} kg`}</Box>
        </Box>
        <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Box component="dt">Tara</Box>
          <Box component="dd">{isNaN(liveClusters.tare.node.value) ? '0 kg' : `${liveClusters.tare.node.value} kg`}</Box>
        </Box>
        <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Box component="dt">Peso Neto</Box>
          <Box component="dd">{isNaN(liveClusters.netWeight.node.value) ? '0 kg' : `${liveClusters.netWeight.node.value} kg`}</Box>
        </Box>
        <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Box component="dt">Total Descuentos</Box>
          <Box component="dd">{isNaN(liveClusters.DiscountTotal.node.value) ? '0 kg' : `${liveClusters.DiscountTotal.node.value} kg`}</Box>
        </Box>
        <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Box component="dt">Bonificación</Box>
          <Box component="dd">{liveClusters.Bonus.tolerance && !isNaN(liveClusters.Bonus.penalty.value) ? `${liveClusters.Bonus.tolerance.value} kg` : '0 kg'}</Box>
        </Box>
        <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Box component="dt">Paddy Neto</Box>
          <Box component="dd">{isNaN(liveClusters.totalPaddy.node.value) ? '0 kg' : `${liveClusters.totalPaddy.node.value} kg`}</Box>
        </Box>
      </Box>
    </Box>
  );
}