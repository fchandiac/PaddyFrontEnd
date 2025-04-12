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
import { useReceptionContext } from "@/context/ReceptionDataContext";

type Range = {
  start: number;
  end: number;
  percent: number;
};

interface Props {
  label:
    | "humedad"
    | "granosVerdes"
    | "impurezas"
    | "granosManchados"
    | "hualcacho"
    | "granosPelados"
    | "granosYesosos"
    | "bonificacion"
    | "secado";
  discountCode: number;
  withTolerance?: boolean;
  withPenalty?: boolean;
  penaltyLabel?: string;
  withRange?: boolean;
  withPercent?: boolean;
}

const PercentageByRange: React.FC<Props> = ({
  label,
  discountCode,
  withTolerance = true,
  withPenalty = true,
  penaltyLabel = "Castigo",
  withRange = true,
  withPercent = true,
}) => {
  const { data, updateField } = useReceptionContext();
  const netWeight = Math.max(0, data.netWeight);

  const [inputValue, setInputValue] = useState<string>("");
  const [percentageInput, setPercentageInput] = useState<string>("");
  const [toleranceInput, setToleranceInput] = useState<string>("");
  const [kgDiscount, setKgDiscount] = useState<number>(0);
  const [ranges, setRanges] = useState<Range[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const cleanLeadingZeros = (value: string): string => {
    if (value === "" || value === "0" || value.startsWith("0.")) return value;
    return value.replace(/^0+/, "");
  };

  const getPercentage = (value: number): number => {
    const match = ranges.find((r) => value >= r.start && value <= r.end);
    return match ? Math.abs(match.percent) : 0;
  };

  const calculateKgDiscount = (pct: number, tol: number): number => {
    const effectiveTolerance = withTolerance ? tol : 0;
    const realPct = Math.max(pct - effectiveTolerance, 0);
    return parseFloat(((realPct * netWeight) / 100).toFixed(2));
  };

  const updateAll = (rango: number, pct: number, tol: number) => {
    const newKg = calculateKgDiscount(pct, tol);
    setKgDiscount(newKg);

    updateField(`percent${capitalize(label)}` as any, pct);
    if (withTolerance) updateField(`tolerance${capitalize(label)}` as any, tol);
    if (withPenalty) updateField(`penalty${capitalize(label)}` as any, newKg);
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = cleanLeadingZeros(e.target.value);
    setInputValue(valStr);

    const val = parseFloat(valStr);
    if (isNaN(val) || val < 0 || val > 100) {
      setPercentageInput("0");
      updateAll(0, 0, parseFloat(toleranceInput) || 0);
    } else {
      const pct = getPercentage(val);
      setPercentageInput(pct.toString());
      updateAll(val, pct, parseFloat(toleranceInput) || 0);
    }
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = cleanLeadingZeros(e.target.value);
    setPercentageInput(valStr);

    const pct = parseFloat(valStr);
    updateAll(
      parseFloat(inputValue) || 0,
      isNaN(pct) ? 0 : pct,
      parseFloat(toleranceInput) || 0
    );
  };

  const handleToleranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = cleanLeadingZeros(e.target.value);
    setToleranceInput(valStr);

    const tol = parseFloat(valStr);
    updateAll(
      parseFloat(inputValue) || 0,
      parseFloat(percentageInput) || 0,
      isNaN(tol) ? 0 : tol
    );
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
      setPercentageInput(pct.toString());
      updateAll(val, pct, parseFloat(toleranceInput) || 0);
    } else {
      updateAll(0, 0, 0);
    }
  }, [ranges, netWeight, withTolerance]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <CircularProgress size={12} />
        <Typography variant="body2" color="text.secondary">
          Cargando rangos...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          textTransform: "capitalize",
          fontWeight: 600,
          lineHeight: 1.5,
        }}
      >
        {label}
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        flexWrap="wrap"
        mt={withRange ? 0.5 : 0}
      >
        <TextField
          label="Rango"
          type="number"
          size="small"
          sx={{
            flex: "1 1 110px",
            minWidth: 110,
            visibility: withRange ? "visible" : "hidden",
          }}
          InputLabelProps={labelStyle}
          InputProps={inputStyle}
          inputProps={{ min: 0, max: 100 }}
          value={inputValue}
          onChange={handleValueChange}
        />

        <TextField
          label="Porcentaje"
          type="number"
          size="small"
          sx={{
            flex: "1 1 110px",
            minWidth: 110,
            visibility: withPercent ? "visible" : "hidden",
          }}
          InputLabelProps={labelStyle}
          InputProps={{
            ...inputStyle,
            endAdornment: (
              <InputAdornment position="end">
                <span style={{ fontSize: "inherit" }}>%</span>
              </InputAdornment>
            ),
          }}
          inputProps={{ min: 0, max: 100 }}
          value={percentageInput}
          onChange={handlePercentageChange}
        />

        <TextField
          label="Tolerancia"
          type="number"
          size="small"
          sx={{
            flex: "1 1 110px",
            minWidth: 110,
            visibility: withTolerance ? "visible" : "hidden",
          }}
          InputLabelProps={labelStyle}
          InputProps={{
            ...inputStyle,
            endAdornment: (
              <InputAdornment position="end">
                <span style={{ fontSize: "inherit" }}>%</span>
              </InputAdornment>
            ),
          }}
          inputProps={{ min: 0, max: 100 }}
          value={withTolerance ? toleranceInput : ""}
          onChange={handleToleranceChange}
          disabled={!withTolerance}
        />

        <TextField
          label={penaltyLabel}
          type="number"
          size="small"
          sx={{
            flex: "1 1 110px",
            minWidth: 110,
            visibility: withPenalty ? "visible" : "hidden",
          }}
          InputLabelProps={labelStyle}
          InputProps={{
            ...inputStyle,
            endAdornment: (
              <InputAdornment position="end">
                <span style={{ fontSize: "inherit" }}>kg</span>
              </InputAdornment>
            ),
          }}
          inputProps={{ readOnly: true }}
          value={kgDiscount}
        />
      </Stack>
    </Box>
  );
};

const labelStyle = {
  sx: {
    fontSize: "0.7rem",
    "@media (min-height: 900px)": { fontSize: "0.85rem" },
    "@media (min-height: 1100px)": { fontSize: "1rem" },
  },
};

const inputStyle = {
  sx: {
    height: 25,
    fontSize: "0.75rem",
    "& input": {
      padding: "0 8px",
      height: "100%",
      boxSizing: "border-box",
    },
    "@media (min-height: 900px)": {
      height: 35,
      fontSize: "1rem",
    },
    "@media (min-height: 1100px)": {
      height: 40,
      fontSize: "1.25rem",
    },
  },
};

export default PercentageByRange;
