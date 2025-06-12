import React, { useEffect, useState } from "react";
import { getReceptionById } from "@/app/actions/reception";
import type { FindReceptionByIdType } from "@/types/reception";
import { useReceptionContext } from "@/context/ReceptionDataContext";
import { Moment } from "moment-timezone";
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

type ReceptionData = {
  receptionId: number;
  createdAt: string;
  producerName: string;
  riceTypeName: string;
  bussinessName: string;
  licensePlate: string;
  guide: string;
  producerRut: string;
  producerAddress: string;
  producerBusinessName: string;
  note?: string;
};

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

export default function ReceptionToPrint({
  receptionId,
}: {
  receptionId: number;
}) {
  const {
    data,
    setGrossWeight,
    setTare,
    setPercentHumedad,
    setToleranceHumedad,
    setPercentGranosVerdes,
    setToleranceGranosVerdes,
    setPercentImpurezas,
    setToleranceImpurezas,
    setPercentVano,
    setToleranceVano,
    setPercentHualcacho,
    setToleranceHualcacho,
    setPercentGranosPelados,
    setToleranceGranosPelados,
    setPercentGranosYesosos,
    setToleranceGranosYesosos,
    setPercentGranosManchados,
    setToleranceGranosManchados,
    setToleranceBonificacion,
    setPercentSecado,
    setUseToleranceGroup,
    setToleranceGroupValue,
  } = useReceptionContext();

  const [template, setTemplate] = useState<
    FindReceptionByIdType["discountTemplate"] | null
  >(null);

  const [ReceptionData, setReceptionData] = useState<ReceptionData>({
    receptionId: 0,
    createdAt: "",
    producerName: "",
    producerRut: "",
    producerAddress: "",
    riceTypeName: "",
    bussinessName: "",
    licensePlate: "",
    guide: "",
    producerBusinessName: "",
    note: "",
  });

  useEffect(() => {
    async function fetchReception() {
      const reception = (await getReceptionById(
        receptionId
      )) as unknown as FindReceptionByIdType;
      setTemplate(reception.discountTemplate);
      setGrossWeight(Number(reception.grossWeight));
      setTare(Number(reception.tare));
      setPercentHumedad(reception.percentHumedad);
      setToleranceHumedad(reception.toleranceHumedad);
      setPercentGranosVerdes(reception.percentGranosVerdes);
      setToleranceGranosVerdes(reception.toleranceGranosVerdes);
      setPercentImpurezas(reception.percentImpurezas);
      setToleranceImpurezas(reception.toleranceImpurezas);
      setPercentVano(reception.percentVano);
      setToleranceVano(reception.toleranceVano);
      setPercentHualcacho(reception.percentHualcacho);
      setToleranceHualcacho(reception.toleranceHualcacho);
      setPercentGranosPelados(reception.percentGranosPelados);
      setToleranceGranosPelados(reception.toleranceGranosPelados);
      setPercentGranosYesosos(reception.percentGranosYesosos);
      setToleranceGranosYesosos(reception.toleranceGranosYesosos);
      setPercentGranosManchados(reception.percentGranosManchados);
      setToleranceGranosManchados(reception.toleranceGranosManchados);

      // Cargar bonificación y secado
      setToleranceBonificacion(reception.toleranceBonificacion);
      setPercentSecado(reception.percentSecado);

      // Configurar tolerancia grupal y distribuir valores
      setUseToleranceGroup(reception.discountTemplate.useToleranceGroup);
      setToleranceGroupValue(reception.discountTemplate.groupToleranceValue);

      setReceptionData({
        receptionId: reception.id,
        createdAt: reception.createdAt,
        producerName: reception.producer.name,
        riceTypeName: reception.riceType.name,
        bussinessName: reception.producer.businessName,
        licensePlate: reception.licensePlate,
        guide: reception.guide,
        producerRut: reception.producer.rut,
        producerAddress: reception.producer.address,
        producerBusinessName: reception.producer.businessName,
        note: reception.note,
      });
    }
    fetchReception();
  }, [receptionId]);

  if (!template) return null;
  const netWeight = data.netWeight;

  // Map config for each base parameter
  const mapConfig: Record<
    string,
    {
      name: string;
      percent: number;
      tolerance: number;
      showTolerance: boolean;
      available: boolean;
      groupTolerance: boolean;
    }
  > = {
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
    //const tol = cfg.showTolerance ? cfg.tolerance : 0;
    //const tol = cfg.tolerance
    const tol =
      cfg.showTolerance || (cfg.groupTolerance && template.useToleranceGroup)
        ? cfg.tolerance
        : 0;
    const pen =
      cfg.percent > tol
        ? +(((cfg.percent - tol) * netWeight) / 100).toFixed(2)
        : 0;
    rows.push({
      name,
      percent: cfg.percent,
      tolerance: cfg.showTolerance ? cfg.tolerance : "",
      penalty: pen,
      groupTolerance: cfg.groupTolerance,
    });
  });

  // Total Granos
  const groupItems = Object.values(mapConfig).filter(
    (c) => c.groupTolerance && c.available
  );
  if (groupItems.length) {
    const tp = +groupItems.reduce((s, c) => s + c.percent, 0).toFixed(2);
    const tt = +groupItems.reduce((s, c) => s + c.tolerance, 0).toFixed(2);
    const pen = tp > tt ? +(((tp - tt) * netWeight) / 100).toFixed(2) : 0;
    rows.push({
      name: "Total Granos",
      percent: tp,
      tolerance: template.useToleranceGroup ? tt : "",
      penalty: pen,
      groupTolerance: template.useToleranceGroup,
    });
  }

  // Total Análisis
  const calcPercentTotalAnalisis = Object.values(mapConfig).reduce(
    (s, c) => s + c.percent,
    0
  );
  const calcToleranceTotalAnalisis = Object.values(mapConfig).reduce(
    (s, c) => s + c.tolerance,
    0
  );
  const calcPenaltyTotalAnalisis =
    calcPercentTotalAnalisis > calcToleranceTotalAnalisis
      ? +(
          ((calcPercentTotalAnalisis - calcToleranceTotalAnalisis) *
            netWeight) /
          100
        ).toFixed(2)
      : 0;
  rows.push({
    name: "Total Análisis",
    percent: calcPercentTotalAnalisis,
    tolerance: template.useToleranceGroup ? calcToleranceTotalAnalisis : "",
    penalty: calcPenaltyTotalAnalisis,
    groupTolerance: false,
  });

  // Bonificación
  const calcPenaltyBonificacion =
    data.toleranceBonificacion > 0
      ? +((data.toleranceBonificacion * netWeight) / 100).toFixed(2)
      : 0;
  if (template.availableBonificacion) {
    rows.push({
      name: "Bonificación",
      percent: data.toleranceBonificacion,
      tolerance: "",
      penalty: calcPenaltyBonificacion,
      groupTolerance: false,
    });
  }

  // Secado
  if (template.availableSecado)
    rows.push({
      name: "Secado",
      percent: data.percentSecado,
      tolerance: "",
      penalty: "",
      groupTolerance: false,
    });

  // Sort rows into desired order
  const baseNoGroup = rows.filter(
    (r) => parameterOrder.includes(r.name) && !r.groupTolerance
  );
  const baseGroup = rows.filter(
    (r) => parameterOrder.includes(r.name) && r.groupTolerance
  );
  const totalGranosRow = rows.find((r) => r.name === "Total Granos");
  const analysisRow = rows.find((r) => r.name === "Total Análisis");
  const bonusRows = rows.filter((r) => r.name === "Bonificación");
  const secadoRows = rows.filter((r) => r.name === "Secado");

  const sortedRows = [
    ...baseNoGroup,
    ...baseGroup,
    ...(totalGranosRow ? [totalGranosRow] : []),
    ...(analysisRow ? [analysisRow] : []),
    ...bonusRows,
    ...secadoRows,
  ];

  // Recompute indices for styling
  const totalGranosIdx = sortedRows.findIndex((r) => r.name === "Total Granos");
  const bonusIdx = sortedRows.findIndex((r) => r.name === "Bonificación");
  const analysisIdx = sortedRows.findIndex((r) => r.name === "Total Análisis");
  const secadoIdx = sortedRows.findIndex((r) => r.name === "Secado");
  const lastIdx = sortedRows.length - 1;

  return (
    <Box px={4}>
      {/* Encabezado */}
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography fontWeight="bold">Aparicio y García LTDA</Typography>
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
          <Typography>Recepción N° {ReceptionData.receptionId}</Typography>
        </Box>
      </Box>
      <Divider sx={{ borderBottom: "1px solid #212121", my: 2 }} />

      {/* Productor */}
      <Box
        sx={{
          width: "60%",
          display: "grid",
          // primera columna fija a 100px, segundo (los dos puntos) auto y tercera flexible
          gridTemplateColumns: "100px auto 1fr",
          rowGap: "1px",
          alignItems: "center",
        }}
      >
        {[
          { label: "Sr.", value: ReceptionData.producerName },
          { label: "Rut", value: ReceptionData.producerRut },
          { label: "Razón Social", value: ReceptionData.bussinessName },
          { label: "Dirección", value: ReceptionData.producerAddress },
          { label: "Guía N°", value: ReceptionData.guide },
        ].map(({ label, value }) => (
          <React.Fragment key={label}>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", textAlign: "left", py: 0 }}
            >
              <strong>{label}</strong>
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", textAlign: "center", py: 0 }}
            >
              <strong>:</strong>
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", textAlign: "left", py: 0, pl: 5 }}
            >
              {value}
            </Typography>
          </React.Fragment>
        ))}
      </Box>

      <Divider sx={{ borderBottom: "1px solid #212121", my: 2 }} />

      {/* Vehículo */}
      <Box display="flex" justifyContent="space-between">
        <Box
          width="50%"
          sx={{
            display: "grid",
            gridTemplateColumns: "100px auto 1fr",
            rowGap: 1, // 4px vertical gap
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontSize: "12px", textAlign: "left", py: 0 }}
          >
            <strong>Placa patente</strong>
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "12px", textAlign: "center", py: 0 }}
          >
            <strong>:</strong>
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "12px", textAlign: "left", py: 0, pl: 5 }}
          >
            {ReceptionData.licensePlate}
          </Typography>
        </Box>

        <Box
          width="35%"
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            rowGap: "1px",
          }}
        >
          {[
            {
              label: "Peso bruto",
              value: `${Number(data.grossWeight).toLocaleString("es-CL")} kg`,
            },
            {
              label: "Tara camión",
              value: `${Number(data.tare).toLocaleString("es-CL")} kg`,
            },
            {
              label: "Peso neto",
              value: `${Number(data.netWeight).toLocaleString("es-CL")} kg`,
            },
          ].map(({ label, value }) => (
            <React.Fragment key={label}>
              <Typography
                variant="body2"
                sx={{ textAlign: "left", fontSize: "12px", py: 0 }}
              >
                <strong>{label}</strong>
              </Typography>
              <Typography
                variant="body2"
                sx={{ textAlign: "center", fontSize: "12px", py: 0 }}
              >
                <strong>:</strong>
              </Typography>
              <Typography
                variant="body2"
                sx={{ textAlign: "right", fontSize: "12px", py: 0 }}
              >
                {value}
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Divider sx={{ borderBottom: "1px solid #212121", my: 2 }} />

      {/* Análisis */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Análisis de granos
        </Typography>
        {template.name && (
          <Typography variant="subtitle1" gutterBottom className="no-print">
            Plantilla: {template.name}
          </Typography>
        )}
      </Box>

      <Table
        size="small"
        sx={{
          "& th, & td": {
            fontSize: "12px", // tamaño de fuente en píxeles
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderBottom: "1px solid #212121" }}>
              Parámetro
            </TableCell>
            <TableCell sx={{ borderBottom: "1px solid #212121" }} align="right">
              Procentaje
            </TableCell>
            <TableCell sx={{ borderBottom: "1px solid #212121" }} align="right">
              Tolerancia
            </TableCell>
            <TableCell sx={{ borderBottom: "1px solid #212121" }} align="right">
              Descuento neto
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row, idx) => (
            <TableRow key={row.name}>
              <TableCell
                sx={{
                  py: 0.5,
                  backgroundColor: row.groupTolerance
                    ? "#f5f5f5"
                    : row.name === "Total Análisis"
                    ? "#eeeeee"
                    : "inherit",
                  borderBottom:
                    idx === lastIdx ||
                    idx === totalGranosIdx ||
                    idx === analysisIdx ||
                    idx === bonusIdx ||
                    idx === secadoIdx ||
                    idx === baseNoGroup.length - 1
                      ? "1px solid #212121"
                      : idx === baseNoGroup.length + baseGroup.length - 1
                      ? "1px solid #bdbdbd"
                      : "1px solid #e0e0e0",
                }}
              >
                {mapConfig[row.name]?.name ?? row.name}
              </TableCell>
              <TableCell
                sx={{
                  py: 0.5,
                  backgroundColor: row.groupTolerance
                    ? "#f5f5f5"
                    : row.name === "Total Análisis"
                    ? "#eeeeee"
                    : "inherit",
                  borderBottom:
                    idx === lastIdx ||
                    idx === totalGranosIdx ||
                    idx === analysisIdx ||
                    idx === bonusIdx ||
                    idx === secadoIdx ||
                    idx === baseNoGroup.length - 1
                      ? "1px solid #212121"
                      : idx === baseNoGroup.length + baseGroup.length - 1
                      ? "1px solid #bdbdbd"
                      : "1px solid #e0e0e0",
                }}
                align="right"
              >
                {typeof row.percent === "number" ? (
                  <>
                    {row.percent.toLocaleString("es-CL")}
                    <span> %</span>
                  </>
                ) : (
                  row.percent
                )}
              </TableCell>
              <TableCell
                sx={{
                  py: 0.5,
                  backgroundColor: row.groupTolerance
                    ? "#f5f5f5"
                    : row.name === "Total Análisis"
                    ? "#eeeeee"
                    : "inherit",
                  borderBottom:
                    idx === lastIdx ||
                    idx === totalGranosIdx ||
                    idx === analysisIdx ||
                    idx === bonusIdx ||
                    idx === secadoIdx ||
                    idx === baseNoGroup.length - 1
                      ? "1px solid #212121"
                      : idx === baseNoGroup.length + baseGroup.length - 1
                      ? "1px solid #bdbdbd"
                      : "1px solid #e0e0e0",
                }}
                align="right"
              >
                {typeof row.tolerance === "number" ? (
                  <>
                    {row.tolerance.toLocaleString("es-CL")}
                    <span> %</span>
                  </>
                ) : (
                  row.tolerance
                )}
              </TableCell>
              <TableCell
                sx={{
                  py: 0.5,
                  backgroundColor: row.groupTolerance
                    ? "#f5f5f5"
                    : row.name === "Total Análisis"
                    ? "#eeeeee"
                    : "inherit",
                  borderBottom:
                    idx === lastIdx ||
                    idx === totalGranosIdx ||
                    idx === analysisIdx ||
                    idx === bonusIdx ||
                    idx === secadoIdx ||
                    idx === baseNoGroup.length - 1
                      ? "1px solid #212121"
                      : idx === baseNoGroup.length + baseGroup.length - 1
                      ? "1px solid #bdbdbd"
                      : "1px solid #e0e0e0",
                }}
                align="right"
              >
                {typeof row.penalty === "number" ? (
                  <>
                    {row.penalty.toLocaleString("es-CL")}
                    <span> kg</span>
                  </>
                ) : (
                  row.penalty
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Resumen final con renderizado condicional y alineado a la derecha */}
      <Box
        mt={2}
        sx={{
          width: "35%",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          rowGap: "1px",
          alignItems: "center",
          ml: "auto", // esto empuja el box hacia la derecha
        }}
      >
        {(() => {
          const items: { label: string; value: number }[] = [
            { label: "Total descuentos", value: calcPenaltyTotalAnalisis },
          ];
          if (calcPenaltyBonificacion > 0) {
            items.push({
              label: "Bonificación",
              value: calcPenaltyBonificacion,
            });
          }
          const bonif =
            calcPenaltyBonificacion > 0 ? calcPenaltyBonificacion : 0;
          const paddyNet = data.netWeight - calcPenaltyTotalAnalisis + bonif;
          items.push({ label: "Paddy neto", value: paddyNet });

          return items.map(({ label, value }) => (
            <React.Fragment key={label}>
              <Typography
                variant="body2"
                sx={{ fontSize: "12px", textAlign: "left", py: 0 }}
              >
                <strong>{label}</strong>
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "12px", textAlign: "center", py: 0 }}
              >
                <strong>:</strong>
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "12px", textAlign: "right", py: 0 }}
              >
                {value
                  .toLocaleString("es-CL", {
                    minimumFractionDigits: label === "Paddy neto" ? 2 : 0,
                  })
                  .concat(" kg")}
              </Typography>
            </React.Fragment>
          ));
        })()}
      </Box>

      <Divider sx={{ borderBottom: "1px solid #212121", my: 2 }} />

      {/* Observaciones */}
      <Box display="flex" justifyContent="space-between" mt={2}>
        {/* Nota del usuario */}
        <Box
          width="50%"
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            rowGap: "1px",
            alignItems: "start",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontSize: "12px", textAlign: "left", py: 0 }}
          >
            <strong>Observaciones</strong>
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "12px", textAlign: "center", py: 0 }}
          >
            <strong>:</strong>
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "12px", textAlign: "left", py: 0 }}
          >
            {data.note || "-"}
          </Typography>
        </Box>

        {/* Aviso estático */}
        <Box
          width="50%"
          px={2}
          py={1}
          sx={{
            border: "0.5px solid #ccc",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography fontSize={13} sx={{ textAlign: "justify" }}>
            Arroz Paddy recibido en depósito para posible compra posterior, sin
            responsabilidad para nuestra industria.
          </Typography>
        </Box>
      </Box>

      {/* Firma */}
      <Box textAlign="right" mt={6}>
        <Typography sx={{ fontSize: 12 }}>
          p.p. Aparicio y García Limitada
        </Typography>
      </Box>
    </Box>
  );
}
