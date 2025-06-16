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
} from "@mui/material";
import { useReceptionContext } from "@/context/ReceptionDataContext";

interface ParamLoadType {
  name: string;
  available: boolean;
  percent: number;
  tolerance: number;
  showTolerance: boolean;
  groupTolerance: boolean;
  setAvailable: (value: boolean) => void;
  setShowTolerance?: (value: boolean) => void;
  setGroupTolerance?: (value: boolean) => void;
  setPercent?: (value: number) => void;
  setTolerance?: (value: number) => void;
}

const TemplateTable: React.FC = () => {
  const { data, liveClusters, setTemplateField } = useReceptionContext();

  const grainParamsData: ParamLoadType[] = [
    {
      name: "Humedad",
      available: data.template.availableHumedad,
      percent: liveClusters.Humedad.percent.value,
      tolerance: liveClusters.Humedad.tolerance.value,
      showTolerance: data.template.showToleranceHumedad,
      groupTolerance: data.template.groupToleranceHumedad,
      setAvailable: (v) => setTemplateField("availableHumedad", v),
      setShowTolerance: (v) => setTemplateField("showToleranceHumedad", v),
      setGroupTolerance: (v) => setTemplateField("groupToleranceHumedad", v),
      setPercent: (v) => setTemplateField("percentHumedad", v),
      setTolerance: (v) => setTemplateField("toleranceHumedad", v),
    },
    {
      name: "Granos verdes",
      available: data.template.availableGranosVerdes,
      percent: liveClusters.GranosVerdes.percent.value,
      tolerance: liveClusters.GranosVerdes.tolerance.value,
      showTolerance: data.template.showToleranceGranosVerdes,
      groupTolerance: data.template.groupToleranceGranosVerdes,
      setAvailable: (v) => setTemplateField("availableGranosVerdes", v),
      setShowTolerance: (v) => setTemplateField("showToleranceGranosVerdes", v),
      setGroupTolerance: (v) => setTemplateField("groupToleranceGranosVerdes", v),
      setPercent: (v) => setTemplateField("percentGranosVerdes", v),
      setTolerance: (v) => setTemplateField("toleranceGranosVerdes", v),
    },
    {
      name: "Impurezas",
      available: data.template.availableImpurezas,
      percent: liveClusters.Impurezas.percent.value,
      tolerance: liveClusters.Impurezas.tolerance.value,
      showTolerance: data.template.showToleranceImpurezas,
      groupTolerance: data.template.groupToleranceImpurezas,
      setAvailable: (v) => setTemplateField("availableImpurezas", v),
      setShowTolerance: (v) => setTemplateField("showToleranceImpurezas", v),
      setGroupTolerance: (v) => setTemplateField("groupToleranceImpurezas", v),
      setPercent: (v) => setTemplateField("percentImpurezas", v),
      setTolerance: (v) => setTemplateField("toleranceImpurezas", v),
    },
    {
      name: "Vano",
      available: data.template.availableVano,
      percent: liveClusters.Vano.percent.value,
      tolerance: liveClusters.Vano.tolerance.value,
      showTolerance: data.template.showToleranceVano,
      groupTolerance: data.template.groupToleranceVano,
      setAvailable: (v) => setTemplateField("availableVano", v),
      setShowTolerance: (v) => setTemplateField("showToleranceVano", v),
      setGroupTolerance: (v) => setTemplateField("groupToleranceVano", v),
      setPercent: (v) => setTemplateField("percentVano", v),
      setTolerance: (v) => setTemplateField("toleranceVano", v),
    },
    {
      name: "Hualcacho",
      available: data.template.availableHualcacho,
      percent: liveClusters.Hualcacho.percent.value,
      tolerance: liveClusters.Hualcacho.tolerance.value,
      showTolerance: data.template.showToleranceHualcacho,
      groupTolerance: data.template.groupToleranceHualcacho,
      setAvailable: (v) => setTemplateField("availableHualcacho", v),
      setShowTolerance: (v) => setTemplateField("showToleranceHualcacho", v),
      setGroupTolerance: (v) => setTemplateField("groupToleranceHualcacho", v),
      setPercent: (v) => setTemplateField("percentHualcacho", v),
      setTolerance: (v) => setTemplateField("toleranceHualcacho", v),
    },
    {
      name: "Granos manchados",
      available: data.template.availableGranosManchados,
      percent: liveClusters.GranosManchados.percent.value,
      tolerance: liveClusters.GranosManchados.tolerance.value,
      showTolerance: data.template.showToleranceGranosManchados,
      groupTolerance: data.template.groupToleranceGranosManchados,
      setAvailable: (v) => setTemplateField("availableGranosManchados", v),
      setShowTolerance: (v) => setTemplateField("showToleranceGranosManchados", v),
      setGroupTolerance: (v) => setTemplateField("groupToleranceGranosManchados", v),
      setPercent: (v) => setTemplateField("percentGranosManchados", v),
      setTolerance: (v) => setTemplateField("toleranceGranosManchados", v),
    },
    {
      name: "Granos pelados",
      available: data.template.availableGranosPelados,
      percent: liveClusters.GranosPelados.percent.value,
      tolerance: liveClusters.GranosPelados.tolerance.value,
      showTolerance: data.template.showToleranceGranosPelados,
      groupTolerance: data.template.groupToleranceGranosPelados,
      setAvailable: (v) => setTemplateField("availableGranosPelados", v),
      setShowTolerance: (v) => setTemplateField("showToleranceGranosPelados", v),
      setGroupTolerance: (v) => setTemplateField("groupToleranceGranosPelados", v),
      setPercent: (v) => setTemplateField("percentGranosPelados", v),
      setTolerance: (v) => setTemplateField("toleranceGranosPelados", v),
    },
    {
      name: "Granos yesosos",
      available: data.template.availableGranosYesosos,
      percent: liveClusters.GranosYesosos.percent.value,
      tolerance: liveClusters.GranosYesosos.tolerance.value,
      showTolerance: data.template.showToleranceGranosYesosos,
      groupTolerance: data.template.groupToleranceGranosYesosos,
      setAvailable: (v) => setTemplateField("availableGranosYesosos", v),
      setShowTolerance: (v) => setTemplateField("showToleranceGranosYesosos", v),
      setGroupTolerance: (v) => setTemplateField("groupToleranceGranosYesosos", v),
      setPercent: (v) => setTemplateField("percentGranosYesosos", v),
      setTolerance: (v) => setTemplateField("toleranceGranosYesosos", v),
    },
    {
      name: "Bonificación",
      available: data.template.availableBonus,
      percent:  0,
      tolerance: liveClusters.Bonus.tolerance.value,
      showTolerance: true,
      groupTolerance: false,
      setAvailable: (v) => setTemplateField("availableBonus", v),
      setShowTolerance: () => undefined,
      setGroupTolerance: () => undefined,
      setPercent: (v) => {},
      setTolerance: (v) => setTemplateField("toleranceBonus", v),
    },
    {
      name: "Secado",
      available: data.template.availableDry,
      percent: liveClusters.Dry.percent.value,
      tolerance: 0,
      showTolerance: false,
      groupTolerance: false,
      setAvailable: (v) => setTemplateField("availableDry", v),
      setShowTolerance: () => undefined,
      setGroupTolerance: () => undefined,
      setPercent: (v) => setTemplateField("percentDry", v),
      setTolerance: (v => {}),
    }
  ];

  return (
    <Box sx={{ px: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Disponible</TableCell>
            <TableCell>Parámetro</TableCell>
            <TableCell>Porcentaje</TableCell>
            <TableCell>Tolerancia</TableCell>
            <TableCell>Mostrar Tolerancia</TableCell>
            <TableCell>Grupo Tolerancia</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grainParamsData.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Switch
                  checked={row.available}
                  size="small"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    row.setAvailable(checked);
                    if (!checked) {
                      row.setShowTolerance?.(false);
                      row.setGroupTolerance?.(false);
                      row.setPercent?.(0);
                      row.setTolerance?.(0);
                    }
                  }}
                />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{`${row.percent.toFixed(2)} %`}</TableCell>
              <TableCell>{`${row.tolerance.toFixed(2)} %`}</TableCell>
              <TableCell>
                <Switch
                  disabled={!row.available}
                  checked={row.showTolerance}
                  size="small"
                  onChange={(e) => row.setShowTolerance?.(e.target.checked)}
                />
              </TableCell>
              <TableCell>
                <Switch
                  disabled={!data.template.useToleranceGroup || !row.available}
                  checked={row.groupTolerance}
                  size="small"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    row.setGroupTolerance?.(checked);
                    if (checked) row.setShowTolerance?.(false);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TemplateTable;
