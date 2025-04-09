"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";

type Range = {
  start: number;
  end: number;
  percent: number;
};

interface Props {
  label: string;
  data: Range[];
  netWeight: number;
  withTolerance?: boolean;
  onChange?: (
    label: string,
    porcentaje: number,
    tolerancia: number,
    kgCastigo: number
  ) => void;
}

const PercentageByRange: React.FC<Props> = ({
  label,
  data,
  netWeight,
  withTolerance = true,
  onChange,
}) => {
  const validNetWeight = Math.max(0, netWeight);

  const [inputValue, setInputValue] = useState<string>("");
  const [percentage, setPercentage] = useState<number>(0);
  const [tolerance, setTolerance] = useState<number>(0);
  const [kgDiscount, setKgDiscount] = useState<number>(0);

  const getPercentage = (value: number): number => {
    const match = data.find((r) => value >= r.start && value <= r.end);
    return match ? Math.abs(match.percent) : 0;
  };

  const calculateKgDiscount = (pct: number, tol: number): number => {
    const effectiveTolerance = withTolerance ? tol : 0;
    const realPct = Math.max(pct - effectiveTolerance, 0);
    return parseFloat(((realPct * validNetWeight) / 100).toFixed(2));
  };

  const updateAll = (
    rango: number,
    pct: number,
    tol: number
  ) => {
    const newKg = calculateKgDiscount(pct, tol);
    setKgDiscount(newKg);
    onChange?.(label, pct, tol, newKg);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setInputValue(valStr);

    const val = parseFloat(valStr);
    if (isNaN(val) || val < 0 || val > 100) {
      setPercentage(0);
      updateAll(0, 0, tolerance);
    } else {
      const pct = getPercentage(val);
      setPercentage(pct);
      updateAll(val, pct, tolerance);
    }
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const pct = isNaN(val) ? 0 : Math.abs(val);
    setPercentage(pct);
    updateAll(parseFloat(inputValue) || 0, pct, tolerance);
  };

  const handleToleranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const tol = isNaN(val) ? 0 : val;
    setTolerance(tol);
    updateAll(parseFloat(inputValue) || 0, percentage, tol);
  };

  useEffect(() => {
    const val = parseFloat(inputValue);
    if (!isNaN(val)) {
      const pct = getPercentage(val);
      setPercentage(pct);
      updateAll(val, pct, tolerance);
    } else {
      updateAll(0, 0, 0);
    }
  }, [data, validNetWeight, withTolerance]);

  return (
    <Box sx={{ mb: 1, width: "100%" }}>
      <Typography variant="caption" sx={{ color: "text.secondary", mb: 1 }}>
        {label}
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        <TextField
          label="Rango"
          type="number"
          size="small"
          sx={{ width: 110 }}
          inputProps={{ min: 0, max: 100 }}
          value={inputValue}
          onChange={handleValueChange}
        />

        <TextField
          label="Porcentaje"
          type="number"
          size="small"
          sx={{ width: 110 }}
          inputProps={{ min: 0, max: 100 }}
          value={percentage}
          onChange={handlePercentageChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />

        <TextField
          label="Tolerancia"
          type="number"
          size="small"
          sx={{ width: 110 }}
          inputProps={{ min: 0, max: 100 }}
          value={withTolerance ? tolerance : 0}
          onChange={handleToleranceChange}
          disabled={!withTolerance}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />

        <TextField
          label="Kg Castigo"
          type="number"
          size="small"
          sx={{ width: 130 }}
          inputProps={{ readOnly: true }}
          value={kgDiscount}
        />
      </Stack>
    </Box>
  );
};

export default PercentageByRange;
