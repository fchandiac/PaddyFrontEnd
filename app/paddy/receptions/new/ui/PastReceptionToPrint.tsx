"use client";

import {
  Box,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getDefaultTemplate } from "@/app/actions/discount-template";
import { ReceptionToPrintDto } from "@/types/reception";

interface ReceptionToPrintProps {
  data: ReceptionToPrintDto;
}

export default function ReceptionToPrint({ data }: ReceptionToPrintProps) {
  const [notGrouped, setNotGrouped] = useState<string[]>([]);
  const [grouped, setGrouped] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const LABEL_ORDER = [
    "Humedad",
    "GranosVerdes",
    "Impurezas",
    "Vano",
    "Hualcacho",
    "GranosPelados",
    "GranosYesosos",
    "GranosManchados",
  ];

  useEffect(() => {
    const fetchTemplate = async () => {
      const res = await getDefaultTemplate();
      const notTemp: string[] = [];
      const grpTemp: string[] = [];

      LABEL_ORDER.forEach((label) => {
        const key = label.replace(/\s/g, "");
        const available = res[`available${key}` as keyof typeof res];
        const grouped = res[`groupTolerance${key}` as keyof typeof res];
        if (available) grouped ? grpTemp.push(label) : notTemp.push(label);
      });

      setNotGrouped(notTemp);
      setGrouped(grpTemp);
      setLoading(false);
    };
    fetchTemplate();
  }, []);

  const getValue = (label: string) =>
    Number(data[`percent${label}` as keyof typeof data]) || 0;
  const getTolerance = (label: string) =>
    Number(data[`tolerance${label}` as keyof typeof data]) || 0;
  const calcKg = (p: number, t: number) =>
    Math.round(((Math.max(0, p - t) * Number(data.netWeight)) / 100) * 100) /
    100;

  if (loading)
    return (
      <Box p={2}>
        <CircularProgress />
      </Box>
    );

  const totalGroupPercent = grouped.reduce((sum, l) => sum + getValue(l), 0);
  const totalGroupTolerance = grouped.reduce(
    (sum, l) => sum + getTolerance(l),
    0
  );
  const totalGroupKg = grouped.reduce(
    (sum, l) => sum + calcKg(getValue(l), getTolerance(l)),
    0
  );

  const totalAnalysisPercent = [...notGrouped, ...grouped].reduce(
    (sum, l) => sum + getValue(l),
    0
  );
  const totalAnalysisTolerance = [...notGrouped, ...grouped].reduce(
    (sum, l) => sum + getTolerance(l),
    0
  );
  const totalAnalysisKg = [...notGrouped, ...grouped].reduce(
    (sum, l) => sum + calcKg(getValue(l), getTolerance(l)),
    0
  );

  const bonusTolerance = Number(data.toleranceBonificacion) || 0;
  const bonusKg =
    Math.round(((bonusTolerance * Number(data.netWeight)) / 100) * 100) / 100;
  const paddyNet =
    Math.round((Number(data.netWeight) - totalAnalysisKg + bonusKg) * 100) /
    100;
  const hasBonus = bonusTolerance > 0;
  const hasDry = data.percentSecado > 0;

  return (
    <Box p={4} sx={{ fontFamily: "Arial", maxWidth: 900, margin: "auto" }}>
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
            Fecha: {new Date(data.createdAt).toLocaleDateString("es-CL")}
          </Typography>
          <Typography>N°: {data.id}</Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2, borderBottomWidth: 2 }} />

      {/* Productor */}
      <Box>
        <Typography>
          <strong>Sr.:</strong> {data.producer.name}
        </Typography>
        <Typography>
          <strong>RUT:</strong> {data.producer.rut}
        </Typography>
        <Typography>
          <strong>Dirección:</strong> {data.producer.address}
        </Typography>
        <Typography>
          <strong>Guía N°:</strong> {data.guide}
        </Typography>
      </Box>
      <Divider sx={{ my: 2, borderBottomWidth: 2 }} />

      {/* Vehículo */}
      <Box display="flex" justifyContent="space-between">
        <Box width="50%">
          <Typography>
            <strong>Placa patente:</strong> {data.licensePlate}
          </Typography>
        </Box>
        <Box width="50%" textAlign="right">
          <Typography>
            <strong>Peso bruto:</strong>{" "}
            {Number(data.grossWeight).toLocaleString("es-CL", {
              minimumFractionDigits: 2,
            })}{" "}
            kg
          </Typography>
          <Typography>
            <strong>Tara camión:</strong>{" "}
            {Number(data.tare).toLocaleString("es-CL", {
              minimumFractionDigits: 2,
            })}{" "}
            kg
          </Typography>
          <Typography>
            <strong>Peso neto:</strong>{" "}
            {Number(data.netWeight).toLocaleString("es-CL", {
              minimumFractionDigits: 2,
            })}{" "}
            kg
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2, borderBottomWidth: 2 }} />

      {/* Análisis */}
      <Box>
        <Typography variant="h6">Análisis de granos</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Parámetro</strong>
              </TableCell>
              <TableCell>
                <strong>Porcentaje</strong>
              </TableCell>
              <TableCell>
                <strong>Tolerancia</strong>
              </TableCell>
              <TableCell>
                <strong>Descuento neto (kg)</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...notGrouped, ...grouped].map((label) => {
              const isGrouped = grouped.includes(label);
              return (
                <TableRow
                  key={label}
                  sx={isGrouped ? { backgroundColor: "#f5f5f5" } : {}}
                >
                  <TableCell>{label}</TableCell>
                  <TableCell>
                    {getValue(label).toLocaleString("es-CL")}%
                  </TableCell>
                  <TableCell>
                    {isGrouped
                      ? ""
                      : getTolerance(label).toLocaleString("es-CL") + "%"}
                  </TableCell>
                  <TableCell>
                    {calcKg(
                      getValue(label),
                      getTolerance(label)
                    ).toLocaleString("es-CL")}{" "}
                    kg
                  </TableCell>
                </TableRow>
              );
            })}

            {grouped.length > 0 && (
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <strong>Total Granos</strong>
                </TableCell>
                <TableCell>
                  <strong>{totalGroupPercent.toLocaleString("es-CL")}%</strong>
                </TableCell>
                <TableCell>
                  <strong>
                    {totalGroupTolerance.toLocaleString("es-CL")}%
                  </strong>
                </TableCell>
                <TableCell>
                  <strong>{totalGroupKg.toLocaleString("es-CL")} kg</strong>
                </TableCell>
              </TableRow>
            )}

            <TableRow>
              <TableCell>
                <strong>Total Análisis</strong>
              </TableCell>
              <TableCell>
                <strong>{totalAnalysisPercent.toLocaleString("es-CL")}%</strong>
              </TableCell>
              <TableCell>
                <strong>
                  {totalAnalysisTolerance.toLocaleString("es-CL")}%
                </strong>
              </TableCell>
              <TableCell>
                <strong>{totalAnalysisKg.toLocaleString("es-CL")} kg</strong>
              </TableCell>
            </TableRow>

            {hasBonus && (
              <TableRow>
                <TableCell>
                  <strong>Bonificación</strong>
                </TableCell>
                <TableCell />
                <TableCell>
                  <strong>{bonusTolerance.toLocaleString("es-CL")}%</strong>
                </TableCell>
                <TableCell>
                  <strong>{bonusKg.toLocaleString("es-CL")} kg</strong>
                </TableCell>
              </TableRow>
            )}

            {hasDry && (
              <TableRow>
                <TableCell>
                  <strong>Secado</strong>
                </TableCell>
                <TableCell>
                  <strong>{data.percentSecado}%</strong>
                </TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Resumen final */}
      <Box mt={2} textAlign="right">
        <Typography>
          <strong>Total descuentos:</strong>{" "}
          {totalAnalysisKg.toLocaleString("es-CL")} kg
        </Typography>
        <Typography>
          <strong>Bonificación (kg):</strong> {bonusKg.toLocaleString("es-CL")}{" "}
          kg
        </Typography>
        <Typography>
          <strong>Paddy neto:</strong>{" "}
          {paddyNet.toLocaleString("es-CL", { minimumFractionDigits: 2 })} kg
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderBottomWidth: 2 }} />

      {/* Observaciones */}
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Box width="50%">
          <Typography>
            <strong>Observaciones:</strong>
          </Typography>
          <Typography whiteSpace="pre-wrap">{data.note}</Typography>
        </Box>
        <Box
          width="50%"
          px={2}
          py={1}
          sx={{ border: "1px solid #ccc", backgroundColor: "#f9f9f9" }}
        >
          <Typography fontSize={13}>
            Arroz Paddy recibido en depósito para posible compra posterior, sin
            responsabilidad para nuestra industria.
          </Typography>
        </Box>
      </Box>

      <Box textAlign="left" mt={4}>
        <Typography fontWeight="bold">
          p.p. Aparicio y García Limitada
        </Typography>
      </Box>
    </Box>
  );
}
