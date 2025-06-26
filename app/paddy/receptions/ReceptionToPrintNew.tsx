"use client";
import React from "react";
import { useReceptionContext } from "@/context/ReceptionDataContext";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";

const parameterOrder = [
  "Humedad",
  "GranosVerdes", 
  "Impurezas",
  "Vano",
  "Hualcacho",
  "GranosPelados",
  "GranosYesosos",
  "GranosManchados",
];

export default function ReceptionToPrintNew() {
  const { data, liveClusters } = useReceptionContext();

  // Simulamos template básico para la vista previa
  const template = {
    name: "Plantilla por defecto",
    useToleranceGroup: false,
    availableHumedad: true,
    availableGranosVerdes: true,
    availableImpurezas: true,
    availableVano: true,
    availableHualcacho: true,
    availableGranosPelados: true,
    availableGranosYesosos: true,
    availableGranosManchados: true,
    availableBonificacion: true,
    availableSecado: true,
    showToleranceHumedad: true,
    showToleranceGranosVerdes: true,
    showToleranceImpurezas: true,
    showToleranceVano: true,
    showToleranceHualcacho: true,
    showToleranceGranosPelados: true,
    showToleranceGranosYesosos: true,
    showToleranceGranosManchados: true,
    groupToleranceHumedad: false,
    groupToleranceGranosVerdes: false,
    groupToleranceImpurezas: false,
    groupToleranceVano: false,
    groupToleranceHualcacho: false,
    groupToleranceGranosPelados: false,
    groupToleranceGranosYesosos: false,
    groupToleranceGranosManchados: false,
  };

  const netWeight = data.netWeight;

  // Map config for each base parameter
  const mapConfig: Record<string, {
    name: string;
    percent: number;
    tolerance: number;
    showTolerance: boolean;
    available: boolean;
    groupTolerance: boolean;
  }> = {
    Humedad: {
      name: "Humedad",
      percent: data.percentHumedad,
      tolerance: data.toleranceHumedad,
      showTolerance: template.showToleranceHumedad,
      available: template.availableHumedad,
      groupTolerance: template.groupToleranceHumedad,
    },
    GranosVerdes: {
      name: "Granos Verdes",
      percent: data.percentGranosVerdes,
      tolerance: data.toleranceGranosVerdes,
      showTolerance: template.showToleranceGranosVerdes,
      available: template.availableGranosVerdes,
      groupTolerance: template.groupToleranceGranosVerdes,
    },
    Impurezas: {
      name: "Impurezas",
      percent: data.percentImpurezas,
      tolerance: data.toleranceImpurezas,
      showTolerance: template.showToleranceImpurezas,
      available: template.availableImpurezas,
      groupTolerance: template.groupToleranceImpurezas,
    },
    Vano: {
      name: "Vano",
      percent: data.percentVano,
      tolerance: data.toleranceVano,
      showTolerance: template.showToleranceVano,
      available: template.availableVano,
      groupTolerance: template.groupToleranceVano,
    },
    Hualcacho: {
      name: "Hualcacho",
      percent: data.percentHualcacho,
      tolerance: data.toleranceHualcacho,
      showTolerance: template.showToleranceHualcacho,
      available: template.availableHualcacho,
      groupTolerance: template.groupToleranceHualcacho,
    },
    GranosPelados: {
      name: "Granos Pelados",
      percent: data.percentGranosPelados,
      tolerance: data.toleranceGranosPelados,
      showTolerance: template.showToleranceGranosPelados,
      available: template.availableGranosPelados,
      groupTolerance: template.groupToleranceGranosPelados,
    },
    GranosYesosos: {
      name: "Granos Yesosos",
      percent: data.percentGranosYesosos,
      tolerance: data.toleranceGranosYesosos,
      showTolerance: template.showToleranceGranosYesosos,
      available: template.availableGranosYesosos,
      groupTolerance: template.groupToleranceGranosYesosos,
    },
    GranosManchados: {
      name: "Granos Manchados",
      percent: data.percentGranosManchados,
      tolerance: data.toleranceGranosManchados,
      showTolerance: template.showToleranceGranosManchados,
      available: template.availableGranosManchados,
      groupTolerance: template.groupToleranceGranosManchados,
    },
  };

  // Build initial rows
  const rows: Array<{
    name: string;
    percent: number | string;
    tolerance: number | string;
    penalty: number | string;
    groupTolerance: boolean;
  }> = [];

  parameterOrder.forEach((name) => {
    const cfg = mapConfig[name];
    if (!cfg.available) return;
    const tol = cfg.showTolerance || (cfg.groupTolerance && template.useToleranceGroup)
      ? cfg.tolerance : 0;
    const pen = cfg.percent > tol
      ? +(((cfg.percent - tol) * netWeight) / 100).toFixed(2) : 0;
    rows.push({
      name,
      percent: cfg.percent,
      tolerance: cfg.showTolerance ? cfg.tolerance : "",
      penalty: pen,
      groupTolerance: cfg.groupTolerance,
    });
  });

  // Total Análisis
  const calcPercentTotalAnalisis = Object.values(mapConfig).reduce((s, c) => s + c.percent, 0);
  const calcToleranceTotalAnalisis = Object.values(mapConfig).reduce((s, c) => s + c.tolerance, 0);
  const calcPenaltyTotalAnalisis = calcPercentTotalAnalisis > calcToleranceTotalAnalisis
    ? +(((calcPercentTotalAnalisis - calcToleranceTotalAnalisis) * netWeight) / 100).toFixed(2) : 0;
  
  rows.push({
    name: "Total Análisis",
    percent: calcPercentTotalAnalisis,
    tolerance: template.useToleranceGroup ? calcToleranceTotalAnalisis : "",
    penalty: calcPenaltyTotalAnalisis,
    groupTolerance: false,
  });

  // Bonificación
  const calcPenaltyBonificacion = liveClusters.Bonus.tolerance.value > 0
    ? +((liveClusters.Bonus.tolerance.value * netWeight) / 100).toFixed(2) : 0;
  if (template.availableBonificacion) {
    rows.push({
      name: "Bonificación",
      percent: liveClusters.Bonus.tolerance.value,
      tolerance: "",
      penalty: calcPenaltyBonificacion,
      groupTolerance: false,
    });
  }

  // Secado
  if (template.availableSecado)
    rows.push({
      name: "Secado",
      percent: liveClusters.Dry.percent.value,
      tolerance: "",
      penalty: "",
      groupTolerance: false,
    });

  return (
    <Box px={4}>
      {/* Encabezado */}
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography fontWeight="bold">Sociedad Comercial e Industrial</Typography>
          <Typography fontWeight="bold">Aparicio y García Ltda</Typography>
          <Typography>Panamericana Sur km 345</Typography>
          <Typography>Parral</Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="h5" fontWeight="bold">
            Recepción Paddy
          </Typography>
          <Typography>
            Fecha: {new Date().toLocaleDateString("es-CL")}
          </Typography>
          <Typography>Recepción N° {data.guide || "Nueva"}</Typography>
        </Box>
      </Box>
      <Divider sx={{ borderBottom: "1px solid #212121", my: 2 }} />

      {/* Productor */}
      <Box
        sx={{
          width: "60%",
          display: "grid",
          gridTemplateColumns: "100px auto 1fr",
          rowGap: "1px",
          alignItems: "center",
        }}
      >
        {[
          { label: "Sr.", value: data.producerName || "N/A" },
          { label: "Rut", value: data.producerRut || "N/A" },
          { label: "Razón Social", value: data.producerBusinessName || "N/A" },
          { label: "Dirección", value: data.producerAddress || "N/A" },
          { label: "Guía N°", value: data.guide || "N/A" },
        ].map(({ label, value }) => (
          <React.Fragment key={label}>
            <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "left", py: 0 }}>
              <strong>{label}</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "center", py: 0 }}>
              <strong>:</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "left", py: 0, pl: 5 }}>
              {value}
            </Typography>
          </React.Fragment>
        ))}
      </Box>

      <Divider sx={{ borderBottom: "1px solid #212121", my: 2 }} />

      {/* Vehículo */}
      <Box display="flex" justifyContent="space-between">
        <Box width="50%" sx={{ display: "grid", gridTemplateColumns: "100px auto 1fr", rowGap: 1 }}>
          <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "left", py: 0 }}>
            <strong>Placa patente</strong>
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "center", py: 0 }}>
            <strong>:</strong>
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "left", py: 0, pl: 5 }}>
            {data.licensePlate || "N/A"}
          </Typography>
        </Box>

        <Box width="35%" sx={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", rowGap: "1px" }}>
          {[
            { label: "Peso bruto", value: `${Number(data.grossWeight || 0).toLocaleString("es-CL")} kg` },
            { label: "Tara camión", value: `${Number(data.tare || 0).toLocaleString("es-CL")} kg` },
            { label: "Peso neto", value: `${Number(data.netWeight || 0).toLocaleString("es-CL")} kg` },
          ].map(({ label, value }) => (
            <React.Fragment key={label}>
              <Typography variant="body2" sx={{ textAlign: "left", fontSize: "12px", py: 0 }}>
                <strong>{label}</strong>
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "center", fontSize: "12px", py: 0 }}>
                <strong>:</strong>
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "right", fontSize: "12px", py: 0 }}>
                {value}
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Divider sx={{ borderBottom: "1px solid #212121", my: 2 }} />

      {/* Análisis */}
      <Typography variant="h6" gutterBottom>
        Análisis de granos
      </Typography>

      <Table size="small" sx={{ "& th, & td": { fontSize: "12px" } }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderBottom: "1px solid #212121" }}>Parámetro</TableCell>
            <TableCell sx={{ borderBottom: "1px solid #212121" }} align="right">Porcentaje</TableCell>
            <TableCell sx={{ borderBottom: "1px solid #212121" }} align="right">Tolerancia</TableCell>
            <TableCell sx={{ borderBottom: "1px solid #212121" }} align="right">Descuento neto</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={row.name}>
              <TableCell sx={{ py: 0.5, borderBottom: idx === rows.length - 1 ? "1px solid #212121" : "1px solid #e0e0e0" }}>
                {mapConfig[row.name]?.name ?? row.name}
              </TableCell>
              <TableCell sx={{ py: 0.5, borderBottom: idx === rows.length - 1 ? "1px solid #212121" : "1px solid #e0e0e0" }} align="right">
                {typeof row.percent === "number" ? (
                  <>{row.percent.toLocaleString("es-CL")}<span> %</span></>
                ) : row.percent}
              </TableCell>
              <TableCell sx={{ py: 0.5, borderBottom: idx === rows.length - 1 ? "1px solid #212121" : "1px solid #e0e0e0" }} align="right">
                {typeof row.tolerance === "number" ? (
                  <>{row.tolerance.toLocaleString("es-CL")}<span> %</span></>
                ) : row.tolerance}
              </TableCell>
              <TableCell sx={{ py: 0.5, borderBottom: idx === rows.length - 1 ? "1px solid #212121" : "1px solid #e0e0e0" }} align="right">
                {typeof row.penalty === "number" ? (
                  <>{row.penalty.toLocaleString("es-CL")}<span> kg</span></>
                ) : row.penalty}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Resumen final */}
      <Box mt={2} sx={{ width: "35%", display: "grid", gridTemplateColumns: "1fr auto 1fr", rowGap: "1px", alignItems: "center", ml: "auto" }}>
        {(() => {
          const items: { label: string; value: number }[] = [
            { label: "Total descuentos", value: calcPenaltyTotalAnalisis },
          ];
          if (calcPenaltyBonificacion > 0) {
            items.push({ label: "Bonificación", value: calcPenaltyBonificacion });
          }
          const bonif = calcPenaltyBonificacion > 0 ? calcPenaltyBonificacion : 0;
          const paddyNet = data.netWeight - calcPenaltyTotalAnalisis + bonif;
          items.push({ label: "Paddy neto", value: paddyNet });

          return items.map(({ label, value }) => (
            <React.Fragment key={label}>
              <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "left", py: 0 }}>
                <strong>{label}</strong>
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "center", py: 0 }}>
                <strong>:</strong>
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "right", py: 0 }}>
                {value.toLocaleString("es-CL", {
                  minimumFractionDigits: label === "Paddy neto" ? 2 : 0,
                }).concat(" kg")}
              </Typography>
            </React.Fragment>
          ));
        })()}
      </Box>

      <Divider sx={{ borderBottom: "1px solid #212121", my: 2 }} />

      {/* Observaciones */}
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Box width="50%" sx={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", rowGap: "1px", alignItems: "start" }}>
          <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "left", py: 0 }}>
            <strong>Observaciones</strong>
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "center", py: 0 }}>
            <strong>:</strong>
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "left", py: 0 }}>
            {data.note || "-"}
          </Typography>
        </Box>

        <Box width="50%" px={2} py={1} sx={{ border: "0.5px solid #ccc", backgroundColor: "#f9f9f9" }}>
          <Typography fontSize={13} sx={{ textAlign: "justify" }}>
            Arroz Paddy recibido en depósito para posible compra posterior, sin
            responsabilidad para nuestra industria.
          </Typography>
        </Box>
      </Box>

      {/* Firma */}
      <Box textAlign="right" mt={6}>
        <Typography sx={{ fontSize: 12 }}>
          p.p. Sociedad Comercial e Industrial Aparicio y García Limitada
        </Typography>
      </Box>
    </Box>
  );
}
