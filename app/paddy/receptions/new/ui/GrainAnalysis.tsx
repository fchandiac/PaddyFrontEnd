"use client";

import { Box, Typography, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import PercentageByRange from "./PercentageByRange";
import Bonus from "./Bonus";

interface ResultadoItem {
  label: string;
  porcentaje: number;
  tolerancia: number;
  kgCastigo: number;
}

interface DefectoMeta {
  code: number;
  label: keyof Omit<ResumenReception, "totalDescuento" | "totalBonificacion" | "secado">;
  withTolerance?: boolean;
}

interface ResumenReception {
  humedad: number;
  granosVerdes: number;
  impurezas: number;
  granosManchados: number;
  hualcacho: number;
  granosPelados: number;
  granosYesosos: number;
  bonificacion: number;
  secado: number;
  totalDescuento: number;
  totalBonificacion: number;
}

interface Props {
  netWeight: number;
  onResumenChange?: (resumen: ResumenReception) => void;
}

const DEFECTOS_META: DefectoMeta[] = [
  { code: 1, label: "humedad", withTolerance: true },
  { code: 7, label: "granosVerdes" },
  { code: 6, label: "impurezas" },
  { code: 5, label: "granosManchados" },
  { code: 4, label: "hualcacho" },
  { code: 3, label: "granosPelados" },
  { code: 2, label: "granosYesosos" },
];

export default function DescuentoPorcentajeCalculator({
  netWeight,
  onResumenChange,
}: Props) {
  const [resultados, setResultados] = useState<ResultadoItem[]>([]);
  const [bonificacion, setBonificacion] = useState<ResultadoItem | null>(null);
  const [secado, setSecado] = useState<ResultadoItem | null>(null);

  const handleChange = (
    label: string,
    porcentaje: number,
    tolerancia: number,
    kgCastigo: number
  ) => {
    const nuevo = { label, porcentaje, tolerancia, kgCastigo };

    if (label === "Bonificación") {
      setBonificacion(nuevo);
      return;
    }

    if (label === "Secado") {
      setSecado(nuevo);
      return;
    }

    setResultados((prev) => {
      const otros = prev.filter((r) => r.label !== label);
      return [...otros, nuevo];
    });
  };

  const totalDescuento = resultados.reduce((acc, r) => acc + r.kgCastigo, 0);
  const totalBonificacion = bonificacion?.kgCastigo || 0;
  const totalTolerancia = resultados.reduce((acc, r) => acc + r.tolerancia, 0) + (bonificacion?.tolerancia || 0);
  const secadoKg = secado?.kgCastigo || 0;
  const totalPorcentajeDescuento = resultados.reduce((acc, r) => acc + r.porcentaje, 0);
  const totalKgCastigo = totalDescuento - totalBonificacion;

  useEffect(() => {
    const resumen: ResumenReception = {
      humedad: 0,
      granosVerdes: 0,
      impurezas: 0,
      granosManchados: 0,
      hualcacho: 0,
      granosPelados: 0,
      granosYesosos: 0,
      bonificacion: bonificacion?.porcentaje || 0,
      secado: secado?.porcentaje || 0,
      totalDescuento,
      totalBonificacion,
    };

    resultados.forEach((r) => {
      const key = r.label as keyof ResumenReception;
      if (key in resumen) resumen[key] = r.porcentaje;
    });

    onResumenChange?.(resumen);
  }, [resultados, bonificacion, secado, totalDescuento, totalBonificacion, onResumenChange]);

  return (
    <Box sx={{ p: 1, borderRadius: 1, width: "100%" }}>
      {DEFECTOS_META.map(({ code, label, withTolerance }) => (
        <PercentageByRange
          key={code}
          label={label}
          discountCode={code}
          netWeight={netWeight}
          withTolerance={withTolerance ?? false}
          onChange={handleChange}
        />
      ))}

      <Bonus
        label="Bonificación"
        netWeight={netWeight}
        withTolerance={true}
        onChange={handleChange}
      />

      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Box width={110} bgcolor={"#f0f0f0"} p={0.5} borderRadius={1} height={40}>
          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
            Totales
          </Typography>
        </Box>

        <Box
          width={110}
          height={40}
          bgcolor={"#f0f0f0"}
          p={1}
          borderRadius={1}
          display={"flex"}
          flexDirection="column"
          textAlign={"center"}
        >
          <Typography variant="caption" fontSize={10} sx={{ fontWeight: "bold" }}>
            % Descuentos
          </Typography>
          <Typography variant="caption" fontSize={10} sx={{ fontWeight: "bold" }}>
            {totalPorcentajeDescuento.toFixed(2)}%
          </Typography>
        </Box>

        <Box
          width={110}
          height={40}
          bgcolor={"#f0f0f0"}
          p={1}
          borderRadius={1}
          display={"flex"}
          flexDirection="column"
          textAlign={"center"}
        >
          <Typography variant="caption" fontSize={10} sx={{ fontWeight: "bold" }}>
            % Tolerancia
          </Typography>
          <Typography variant="caption" fontSize={10} sx={{ fontWeight: "bold" }}>
            {totalTolerancia.toFixed(2)}%
          </Typography>
        </Box>

        <Box
          width={110}
          bgcolor={"#f0f0f0"}
          p={0.5}
          height={40}
          borderRadius={1}
          display={"flex"}
          flexDirection="column"
          textAlign={"center"}
        >
          <Typography variant="caption" fontSize={10} sx={{ fontWeight: "bold" }}>
            Kg Castigo
          </Typography>
          <Typography variant="caption" fontSize={10} sx={{ fontWeight: "bold" }}>
            {totalKgCastigo.toFixed(2)} kg
          </Typography>
        </Box>
      </Stack>

      <PercentageByRange
        label="Secado"
        discountCode={8}
        netWeight={netWeight}
        withTolerance={false}
        onChange={handleChange}
      />
    </Box>
  );
}