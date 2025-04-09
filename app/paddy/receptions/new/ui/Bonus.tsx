"use client";

import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";

interface Props {
  label: string;
  netWeight: number;
  withTolerance?: boolean;
  onChange?: (
    label: string,
    porcentaje: number,
    tolerancia: number,
    kgBonus: number
  ) => void;
}

const Bonus: React.FC<Props> = ({
  label,
  netWeight,
  withTolerance = true,
  onChange,
}) => {
  const validNetWeight = Math.max(0, netWeight);
  const [tolerance, setTolerance] = useState<number>(0);
  const [kgBonus, setKgBonus] = useState<number>(0);

  const calculateKgBonus = (tol: number): number => {
    const effectiveTol = withTolerance ? tol : 0;
    return parseFloat(((effectiveTol * validNetWeight) / 100).toFixed(2));
  };

  const handleToleranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const tol = isNaN(val) ? 0 : val;
    setTolerance(tol);
    const bonus = calculateKgBonus(tol);
    setKgBonus(bonus);
    onChange?.(label, 0, tol, bonus);
  };

  useEffect(() => {
    const bonus = calculateKgBonus(tolerance);
    setKgBonus(bonus);
    onChange?.(label, 0, tolerance, bonus);
  }, [netWeight, withTolerance]);

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" mt={0.5}>
        {/* Rango oculto */}
        <Typography variant="caption" sx={{ color: "text.secondary" }} width={110}>
        {label}
      </Typography>

        {/* Porcentaje oculto */}
        <TextField
          label="Porcentaje"
          size="small"
          sx={{ width: 110, visibility: "hidden" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />

        {/* Tolerancia visible */}
        <TextField
          label="Tolerancia"
          type="number"
          size="small"
          sx={{ width: 110 }}
          InputLabelProps={{
            sx: { fontSize: "0.7rem" },
          }}
          InputProps={{
            sx: {
              height: 25,
              fontSize: "0.75rem",
              padding: "0 8px",
            },
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          inputProps={{
            min: 0,
            max: 100,
            style: { padding: 4 },
          }}
          value={withTolerance ? tolerance : 0}
          onChange={handleToleranceChange}
          disabled={!withTolerance}
        />

        {/* Castigo (bono) visible */}
        <TextField
          label="Bono"
          type="number"
          size="small"
          sx={{ width: 110 }}
          InputLabelProps={{
            sx: { fontSize: "0.7rem" },
          }}
          InputProps={{
            sx: {
              height: 26,
              fontSize: "0.75rem",
              padding: "0 8px",
            },
            endAdornment: (
              <InputAdornment position="end" sx={{ fontSize: "0.4rem" }}>
                kg
              </InputAdornment>
            ),
          }}
          inputProps={{
            readOnly: true,
            style: { padding: 4 },
          }}
          value={kgBonus}
        />
      </Stack>
    </Box>
  );
};

export default Bonus;
