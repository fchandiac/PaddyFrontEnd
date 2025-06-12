// src/app/paddy/receptions/new/ui/Parameter.tsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Skeleton,
} from "@mui/material";
import {
  Percent as PercentIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Range } from "@/types/reception";
import { useReceptionContext } from "@/context/ReceptionDataContext";

const boxStyle = {
  flex: "1 1 110px",
  minWidth: 110,
  display: "flex",
  alignItems: "center",
};

const cleanDecimal = (val: string) => {
  if (val === "") return "";
  const regex = /^\d*(?:\.\d{0,2})?$/;
  return regex.test(val) ? val : val.slice(0, -1);
};

export interface GrainAnalysisParam {
  type: string;
  name: string;
  order: number;
  percent: number;
  tolerance: number;
  penalty: number;
  available: boolean;
  showRange?: boolean;
  showPercent?: boolean;
  showTolerance?: boolean;
  showToleranceButton?: boolean;
  showPenalty?: boolean;
  penaltyLabel?: string;
  groupTolerance?: boolean;
  ranges?: Range[];
  setPercent: (value: number) => void;
  setTolerance: (value: number) => void;
  setPenalty: (value: number) => void;
  setShowTolerance: (value: boolean) => void;
  loading?: boolean;
  setAvailable?: (value: boolean) => void;
  setGroupTolerance?: (value: boolean) => void;
  setShowPercent?: (value: boolean) => void;
  setShowPenalty?: (value: boolean) => void;
  setName?: (value: string) => void;
  setType?: (value: string) => void;
  setRanges?: (value: Range[]) => void;
}

const Parameter: React.FC<GrainAnalysisParam> = ({
  type,
  name,
  order,
  percent,
  tolerance,
  penalty,
  available,
  showRange,
  showPercent,
  showTolerance,
  showToleranceButton = true,
  showPenalty,
  penaltyLabel,
  groupTolerance,
  ranges = [],
  setPercent,
  setTolerance,
  setPenalty,
  setAvailable,
  setGroupTolerance,
  setShowPercent,
  setShowPenalty,
  setShowTolerance,
  loading = false,
}) => {
  if (!available) return null;

  // Local input states as strings
  const [rangeInput, setRangeInput] = useState<string>("");
  const [percentInput, setPercentInput] = useState<string>(percent.toString());
  const [tolInput, setTolInput] = useState<string>(tolerance.toString());

  useEffect(() => {
    setPercentInput(percent.toString());
  }, [percent]);

  useEffect(() => {
    setTolInput(tolerance.toString());
  }, [tolerance]);

  // derive percent from range
  const getPercentageFromRange = (val: number): number => {
    const found = ranges.find((r: any) => val >= r.start && val <= r.end);
    return found ? Math.abs(found.percent) : 0;

     console.log(ranges)
  };

  if (loading) {
    return (
      <Skeleton variant="rectangular" height={80} sx={{ width: "100%" }} />
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          mb: 0,
          mt: 0,
          lineHeight: 1,
          display: showRange ? "block" : "none",
        }}
      >
        {name}
      </Typography>

      <Stack direction="row" flexWrap="wrap" spacing={1} my={0.8} p={0}>
        {/* Rango */}
        <Box sx={boxStyle}>
          {showRange ? (
            <TextField
              label="Rango"
              size="small"
              value={rangeInput}
              onChange={(e) => {
                set
              }}
              onFocus={(e) => e.target.select()}
              sx={{ minWidth: 110 }}
            />
          ) : (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                mb: 0,
                mt: 0,
                lineHeight: 1,
                display: "block",
              }}
            >
              {name}
            </Typography>
          )}
        </Box>

        {/* Porcentaje */}
        <Box sx={boxStyle}>
          <TextField
            label="Porcentaje"
            size="small"
            value={percentInput}
            onChange={(e) => {
              const raw = e.target.value;
              const clean = cleanDecimal(raw);
              setPercentInput(clean);
              if (clean === "") {
                setPercent(0);
              } else {
                const num = parseFloat(clean);
                const clamped = Math.max(0, Math.min(100, num));
                setPercent(clamped);
              }
            }}
            onFocus={(e) => e.target.select()}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
              readOnly: type === "resume" || type === "toleranceGroupResume",
            }}
            sx={{
              minWidth: 110,
              visibility: showPercent ? "visible" : "hidden",
              backgroundColor:
                groupTolerance && type === "toleranceGroupParam"
                  ? "#e8f5e9"
                  : type === "resume"
                  ? "grey.200"
                  : "inherit",
            }}
          />
        </Box>

        {/* Tolerancia */}
        <Box sx={boxStyle}>
          <TextField
            label="Tolerancia"
            size="small"
            value={tolInput}
            onChange={(e) => {
              const raw = e.target.value;
              const clean = cleanDecimal(raw);
              setTolInput(clean);
              if (clean === "") {
                setTolerance(0);
              } else {
                const num = parseFloat(clean);
                const clamped = Math.max(0, Math.min(100, num));
                setTolerance(clamped);
              }
            }}
            onFocus={(e) => e.target.select()}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
              readOnly:
                type === "resume" ||
                type === "toleranceGroupResume" ||
                type === "toleranceGroupParam",
            }}
            sx={{
              minWidth: 110,
              visibility: showTolerance ? "visible" : "hidden",
              backgroundColor:
                groupTolerance && type === "toleranceGroupParam"
                  ? "#e8f5e9"
                  : type === "resume"
                  ? "grey.200"
                  : "inherit",
            }}
          />
          {showToleranceButton && (
            <IconButton
              size="small"
              onClick={() => setShowTolerance(!showTolerance)}
              sx={{ ml: 0.5 }}
            >
              {showTolerance ? (
                <VisibilityOff fontSize="small" />
              ) : (
                <Visibility fontSize="small" />
              )}
            </IconButton>
          )}
        </Box>

        {/* Castigo */}
        <Box sx={boxStyle}>
          <TextField
            label={penaltyLabel}
            type="number"
            size="small"
            value={penalty}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              readOnly: true,
            }}
            sx={{
              minWidth: 110,
              visibility: showPenalty ? "visible" : "hidden",
              backgroundColor:
                groupTolerance && type === "toleranceGroupParam"
                  ? "#e8f5e9"
                  : type === "resume"
                  ? "grey.200"
                  : "inherit",
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default React.memo(Parameter);
