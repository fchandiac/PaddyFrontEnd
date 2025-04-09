"use client";

import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  InputAdornment,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { getDiscountPercentsByCode } from "@/app/actions/discount-percent";

type Range = {
  start: number;
  end: number;
  percent: number;
};

interface Props {
  label: string;
  discountCode: number;
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
  discountCode,
  netWeight,
  withTolerance = true,
  onChange,
}) => {
  const validNetWeight = Math.max(0, netWeight);

  const [inputValue, setInputValue] = useState<string>("");
  const [percentage, setPercentage] = useState<number>(0);
  const [tolerance, setTolerance] = useState<number>(0);
  const [kgDiscount, setKgDiscount] = useState<number>(0);
  const [ranges, setRanges] = useState<Range[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getPercentage = (value: number): number => {
    const match = ranges.find((r) => value >= r.start && value <= r.end);
    return match ? Math.abs(match.percent) : 0;
  };

  const calculateKgDiscount = (pct: number, tol: number): number => {
    const effectiveTolerance = withTolerance ? tol : 0;
    const realPct = Math.max(pct - effectiveTolerance, 0);
    return parseFloat(((realPct * validNetWeight) / 100).toFixed(2));
  };

  const updateAll = (rango: number, pct: number, tol: number) => {
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
    async function loadRanges() {
      setLoading(true);
      const result = await getDiscountPercentsByCode(discountCode);
      setRanges(result || []);
      setLoading(false);
    }
    loadRanges();
  }, [discountCode]);

  useEffect(() => {
    const val = parseFloat(inputValue);
    if (!isNaN(val)) {
      const pct = getPercentage(val);
      setPercentage(pct);
      updateAll(val, pct, tolerance);
    } else {
      updateAll(0, 0, 0);
    }
  }, [ranges, validNetWeight, withTolerance]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Cargando rangos...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" mt={0.5}>
        <TextField
          label="Rango"
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
          }}
          inputProps={{
            min: 0,
            max: 100,
            style: { padding: 4 },
          }}
          value={inputValue}
          onChange={handleValueChange}
        />

        <TextField
          label="Porcentaje"
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
          value={percentage}
          onChange={handlePercentageChange}
        />

        <TextField
          label="Tolerancia"
          type="number"
          size="small"
          sx={{ width: 110 , visibility: withTolerance ? "visible" : "hidden",}}
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

        <TextField
          label="Castigo"
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
            endAdornment: <InputAdornment position="end" sx={{
              fontSize: "0.4rem",
            }}>kg</InputAdornment>,
          }}
          inputProps={{
            readOnly: true,
            style: { padding: 4 },
          }}
          value={kgDiscount}
        />
      </Stack>
    </Box>
  );
};

export default PercentageByRange;
