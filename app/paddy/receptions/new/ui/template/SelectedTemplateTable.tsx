"use client";

import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Switch,
  IconButton,
  Typography,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { TemplateType } from  "@/types/discount-template"
import { useReceptionContext } from "@/context/ReceptionDataContext";




const keyMap: Record<string, string> = {
  humedad: "Humedad",
  granosVerdes: "Granos verdes",
  impurezas: "Impurezas",
  vano: "Vano",
  hualcacho: "Hualcacho",
  granosManchados: "Granos manchados",
  granosPelados: "Granos pelados",
  granosYesosos: "Granos yesosos",
  bonus: "Bonificación",
  dry: "Secado",
};


interface SelectedTemplateTableProps {
  selectedTemplate: TemplateType;
  closeDialog: () => void;
}




const SelectedTemplateTable: React.FC<SelectedTemplateTableProps> = ({selectedTemplate, closeDialog}) =>  {
  const { setTemplateField, setTemplate, data } = useReceptionContext();



  const paramsData = [
    { name: "Humedad", available: selectedTemplate.availableHumedad, showTolerance: selectedTemplate.showToleranceHumedad, groupTolerance: selectedTemplate.groupToleranceHumedad },
    { name: "Granos verdes", available: selectedTemplate.availableGranosVerdes, showTolerance: selectedTemplate.showToleranceGranosVerdes, groupTolerance: selectedTemplate.groupToleranceGranosVerdes },
    { name: "Impurezas", available: selectedTemplate.availableImpurezas, showTolerance: selectedTemplate.showToleranceImpurezas, groupTolerance: selectedTemplate.groupToleranceImpurezas },
    { name: "Vano", available: selectedTemplate.availableVano, showTolerance: selectedTemplate.showToleranceVano, groupTolerance: selectedTemplate.groupToleranceVano },
    { name: "Hualcacho", available: selectedTemplate.availableHualcacho, showTolerance: selectedTemplate.showToleranceHualcacho, groupTolerance: selectedTemplate.groupToleranceHualcacho },
    { name: "Granos pelados", available: selectedTemplate.availableGranosPelados, showTolerance: selectedTemplate.showToleranceGranosPelados, groupTolerance: selectedTemplate.groupToleranceGranosPelados },
    { name: "Granos yesosos", available: selectedTemplate.availableGranosYesosos, showTolerance: selectedTemplate.showToleranceGranosYesosos, groupTolerance: selectedTemplate.groupToleranceGranosYesosos },
    { name: "Granos manchados", available: selectedTemplate.availableGranosManchados, showTolerance: selectedTemplate.showToleranceGranosManchados, groupTolerance: selectedTemplate.groupToleranceGranosManchados },
    { name: "Bonificación", available: selectedTemplate.availableBonus, showTolerance: true, groupTolerance: false },
    { name: "Secado", available: selectedTemplate.availableDry, showTolerance: false, groupTolerance: false },
  ];



  const handleApply = () => {
    if (!selectedTemplate) return;
    console.log('🔥 Cargando plantilla:', selectedTemplate);
    console.log('🔥 Available flags:', {
      availableHumedad: selectedTemplate.availableHumedad,
      availableGranosVerdes: selectedTemplate.availableGranosVerdes,
      availableImpurezas: selectedTemplate.availableImpurezas,
      availableVano: selectedTemplate.availableVano,
      availableHualcacho: selectedTemplate.availableHualcacho,
      availableGranosManchados: selectedTemplate.availableGranosManchados,
      availableGranosPelados: selectedTemplate.availableGranosPelados,
      availableGranosYesosos: selectedTemplate.availableGranosYesosos,
      availableBonus: selectedTemplate.availableBonus,
      availableDry: selectedTemplate.availableDry,
    });
    setTemplate(selectedTemplate);
    closeDialog();
  };

  return (
    <Box sx={{ px: 2 }}>
      <Box sx={{ py: 1 }} display="flex" justifyContent="space-between">
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          Plantilla: {selectedTemplate?.name}
        </Typography>
        {selectedTemplate?.producer?.name && (
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Productor: {selectedTemplate?.producer.name}
          </Typography>
        )}
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Disponible</TableCell>
            <TableCell>Parámetro</TableCell>
            <TableCell>Mostrar Tol.</TableCell>
            <TableCell>Grupo Tol.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paramsData.map((row, idx) => {
            const key = keyMap[row.name];
            return (
              <TableRow key={idx}>
                <TableCell>
                  <Switch
                    checked={row.available}
                    size="small"
                    onChange={(_, v) => setTemplateField(`available${key}` as any, v)}
                  />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  {row.showTolerance !== undefined && (
                    <Switch
                      checked={row.showTolerance}
                      size="small"
                      onChange={(_, v) => setTemplateField(`showTolerance${key}` as any, v)}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {row.groupTolerance !== undefined && (
                    <Switch
                      checked={row.groupTolerance}
                      size="small"
                      onChange={(_, v) => setTemplateField(`groupTolerance${key}` as any, v)}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Box display="flex" justifyContent="center" mt={2}>
        <IconButton onClick={handleApply}>
          <PlayCircleIcon fontSize="large" color="primary" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SelectedTemplateTable;


