"use client";

import { Box, Typography, Stack } from "@mui/material";
import React from "react";
import PercentageByRange from "./PercentageByRange";
import { useReceptionContext } from "@/context/ReceptionDataContext";

const DEFECTOS_META: {
  code: number;
  label:
    | "humedad"
    | "granosVerdes"
    | "impurezas"
    | "granosManchados"
    | "hualcacho"
    | "granosPelados"
    | "granosYesosos";
  withTolerance: boolean;
}[] = [
  { code: 1, label: "humedad", withTolerance: true },
  { code: 7, label: "granosVerdes", withTolerance: false },
  { code: 6, label: "impurezas", withTolerance: false },
  { code: 5, label: "granosManchados", withTolerance: false },
  { code: 4, label: "hualcacho", withTolerance: false },
  { code: 3, label: "granosPelados", withTolerance: false },
  { code: 2, label: "granosYesosos", withTolerance: false },
];

export default function GrainAnalysis() {
  const {
    data,
    getTotalPercentDiscounts,
    getTotalTolerances,
    getTotalKgPenalties,
  } = useReceptionContext();

  return (
    <Box
      sx={{ border: "1px solid #ccc", borderRadius: 1, width: "100%", p: 1 }}
    >
      {DEFECTOS_META.map(({ code, label, withTolerance }) => (
        <PercentageByRange
          key={code}
          label={label}
          discountCode={code}
          withTolerance={withTolerance}
          withPenalty={true}
        />
      ))}

      <Box >
        <PercentageByRange
          label="bonificacion"
          discountCode={9}
          withTolerance={true}
          withPenalty={true}
          withRange={false}
          withPercent={false}
          penaltyLabel="Bonificación"
        />
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
        <Box sx={boxStyleHeader}>Totales</Box>
        <Box sx={boxStyle("center")}>
          <Typography variant="caption" fontSize={10} fontWeight="bold">
            % Descuentos
          </Typography>
          <Typography variant="caption" fontSize={10} fontWeight="bold">
            {getTotalPercentDiscounts().toFixed(2)}%
          </Typography>
        </Box>
        <Box sx={boxStyle("center")}>
          <Typography variant="caption" fontSize={10} fontWeight="bold">
            % Tolerancia
          </Typography>
          <Typography variant="caption" fontSize={10} fontWeight="bold">
            {getTotalTolerances().toFixed(2)}%
          </Typography>
        </Box>
        <Box sx={boxStyle("center")}>
          <Typography variant="caption" fontSize={10} fontWeight="bold">
            Kg Castigo
          </Typography>
          <Typography variant="caption" fontSize={10} fontWeight="bold">
            {getTotalKgPenalties().toLocaleString("es-CL", {
              minimumFractionDigits: 2,
            })}{" "}
            kg
          </Typography>
        </Box>
      </Stack>

      <Box>
        <PercentageByRange
          label="secado"
          discountCode={8}
          withTolerance={false}
          withPenalty={false}
          withRange={true}
          withPercent={true}
        />
      </Box>
    </Box>
  );
}

const boxStyleHeader = {
  flex: "1 1 110px",
  minWidth: 110,
  bgcolor: "#f0f0f0",
  p: 0.5,
  borderRadius: 1,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const boxStyle = (align: "center" | "start" = "center") => ({
  flex: "1 1 110px",
  minWidth: 110,
  height: 40,
  bgcolor: "#f0f0f0",
  p: 1,
  borderRadius: 1,
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  justifyContent: align,
});
