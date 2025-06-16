import { useReceptionContext } from "@/context/ReceptionDataContext";
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Node,
  Cluster,
  RangeNode,
  ParamCluster,
  createBlankNode,
} from "@/hooks/paramCells";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { getDiscountPercentsByCode } from "@/app/actions/discount-percent";

interface NodeProps {
  key: string;
  value: number | string;
  onChange: (newValue: number) => void;
  adorn?: string;
  readonly?: boolean;
  backgroundColor?: string;
  show: boolean;
  showVisilibilityButton?: boolean;
  label?: string;
  setShow: () => void;
  error: boolean;
}

const boxStyle = {
  display: "flex",
  alignItems: "center",
};

const NodeComponent: React.FC<NodeProps> = (node: NodeProps) => {
  return (
    <Box sx={boxStyle}>
      <TextField
        size="small"
        label={node.label}
        type={"number"}
        value={node.value}
        onChange={(e) => {
          node.onChange(parseFloat(e.target.value));
        }}
        onFocus={(e) => (e.target as HTMLInputElement).select()}
        InputProps={{
          endAdornment: node.adorn ? (
            <InputAdornment position="end">{node.adorn}</InputAdornment>
          ) : undefined,
          readOnly: node.readonly,
          sx: {
            ...(node.backgroundColor !== "inherit" && {
              backgroundColor: node.backgroundColor,
              borderRadius: '4px'
            })
          }
        }}
        sx={{
          minWidth: 110,
          visibility: node.show ? 'visible' : 'hidden'
        }}
      />
      {node.showVisilibilityButton && (
        <IconButton
          size="small"
          onClick={() => node.setShow()}
           aria-hidden="true"
          sx={{
            ml: 1,
            mr: 0,
          }}
        >
          {node.show ? (
            <VisibilityOff fontSize="small" />
          ) : (
            <Visibility fontSize="small" />
          )}
        </IconButton>
      )}
    </Box>
  );
};


export default function GrainAnalysis() {
  const { liveClusters, data } = useReceptionContext();

  const hasGroupToleranceParams = data.template && data.template.useToleranceGroup && (
    data.template.groupToleranceHumedad ||
    data.template.groupToleranceGranosVerdes ||
    data.template.groupToleranceImpurezas ||
    data.template.groupToleranceVano ||
    data.template.groupToleranceHualcacho ||
    data.template.groupToleranceGranosManchados ||
    data.template.groupToleranceGranosPelados ||
    data.template.groupToleranceGranosYesosos
  );

  useEffect(() => {
    const fetchHumedadRanges = async () => {
      const ranges = await getDiscountPercentsByCode(
        liveClusters.Humedad.range.code
      );
      liveClusters.Humedad.range.setRanges(ranges);
    };
    const fetchGranosVerdesRanges = async () => {
      const ranges = await getDiscountPercentsByCode(
        liveClusters.GranosVerdes.range.code
      );
      liveClusters.GranosVerdes.range.setRanges(ranges);
    };
    const fetchImpurezasRanges = async () => {
      const ranges = await getDiscountPercentsByCode(
        liveClusters.Impurezas.range.code
      );
      liveClusters.Impurezas.range.setRanges(ranges);
    };
    const fetchVanoRanges = async () => {
      const ranges = await getDiscountPercentsByCode(
        liveClusters.Vano.range.code
      );
      liveClusters.Vano.range.setRanges(ranges);
    };
    const fetchHualcachoRanges = async () => {
      const ranges = await getDiscountPercentsByCode(
        liveClusters.Hualcacho.range.code
      );
      liveClusters.Hualcacho.range.setRanges(ranges);
    };
    const fetchGranosManchadosRanges = async () => {
      const ranges = await getDiscountPercentsByCode(
        liveClusters.GranosManchados.range.code
      );
      liveClusters.GranosManchados.range.setRanges(ranges);
    };
    const fetchGranosPeladosRanges = async () => {
      const ranges = await getDiscountPercentsByCode(
        liveClusters.GranosPelados.range.code
      );
      liveClusters.GranosPelados.range.setRanges(ranges);
    };
    const fetchGranosYesososRanges = async () => {
      const ranges = await getDiscountPercentsByCode(
        liveClusters.GranosYesosos.range.code
      );
      liveClusters.GranosYesosos.range.setRanges(ranges);
    };

    fetchHumedadRanges();
    fetchGranosVerdesRanges();
    fetchImpurezasRanges();
    fetchVanoRanges();
    fetchHualcachoRanges();
    fetchGranosManchadosRanges();
    fetchGranosPeladosRanges();
    fetchGranosYesososRanges();
  }, [liveClusters.Humedad.range.code]);

  const paramClusters = Object.values(liveClusters).filter(
    (c): c is ParamCluster => c.type === "param"
  ).filter((cluster) => {
    // Si no hay template, mostrar todos los clusters
    if (!data?.template) {
      console.log(`🔥 No template - showing cluster ${cluster.key}`);
      return true;
    }
    
    // Filtrar clusters basado en la disponibilidad del template
    const availabilityMap: Record<string, boolean> = {
      'Humedad': data.template.availableHumedad,
      'GranosVerdes': data.template.availableGranosVerdes,
      'Impurezas': data.template.availableImpurezas,
      'Vano': data.template.availableVano,
      'Hualcacho': data.template.availableHualcacho,
      'GranosManchados': data.template.availableGranosManchados,
      'GranosPelados': data.template.availableGranosPelados,
      'GranosYesosos': data.template.availableGranosYesosos,
    };
    
    const isAvailable = availabilityMap[cluster.key] !== false;
    console.log(`🔥 Filtering cluster ${cluster.key}, available:`, isAvailable);
    return isAvailable;
  });

  // Separar los parámetros que pertenecen al grupo de tolerancia de los que no
  const groupToleranceMap: Record<string, boolean> = data?.template ? {
    'Humedad': data.template.groupToleranceHumedad,
    'GranosVerdes': data.template.groupToleranceGranosVerdes,
    'Impurezas': data.template.groupToleranceImpurezas,
    'Vano': data.template.groupToleranceVano,
    'Hualcacho': data.template.groupToleranceHualcacho,
    'GranosManchados': data.template.groupToleranceGranosManchados,
    'GranosPelados': data.template.groupToleranceGranosPelados,
    'GranosYesosos': data.template.groupToleranceGranosYesosos,
  } : {};

  // Separar los parámetros en dos grupos
  // Los parámetros que no pertenecen al grupo de tolerancia se mostrarán primero
  const nonGroupToleranceParams = paramClusters.filter(cluster => 
    !data?.template?.useToleranceGroup || !groupToleranceMap[cluster.key]
  );
  
  // Los parámetros del grupo de tolerancia se mostrarán después, justo antes de GroupSummary, Summary, Bonus y Dry
  const groupToleranceParams = paramClusters.filter(cluster => 
    data?.template?.useToleranceGroup && groupToleranceMap[cluster.key]
  );

  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        px: 2,
        py: 1,
        minWidth: 700,
      }}
    >
      {/* Renderizar primero los parámetros que NO pertenecen al grupo de tolerancia */}
      {nonGroupToleranceParams.map((cluster) => (
        <Box key={cluster.key} mb={0.2} mt={1}>
          <Stack spacing={2} direction="row">
            <Box sx={boxStyle}>
              <TextField
                size="small"
                label={""}
                type={"text"}
                value={cluster.name}
                inputProps={{ "data-skip-focus": true }}
                sx={{
                  textAlign: "left",
                  minWidth: 110,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "12px",
                      padding: "0px",
                    },
                  },
                }}
              />
            </Box>
            {[
              cluster.range,
              cluster.percent,
              cluster.tolerance,
              cluster.penalty,
            ].map((node) => (
              <NodeComponent
                key={node.key}
                value={node.value}
                onChange={node.onChange}
                adorn={node.adorn}
                readonly={node.readonly}
                backgroundColor={node.backgroundColor}
                show={node.show}
                setShow={node.setShow}
                label={node.label}
                error={node.error}
                showVisilibilityButton={node.showVisilibilityButton}
              />
            ))}
          </Stack>
        </Box>
      ))}
      
      {/* Renderizar después los parámetros del grupo de tolerancia */}
      {groupToleranceParams.map((cluster) => (
        <Box key={cluster.key} mb={0.2} mt={1}>
          <Stack spacing={2} direction="row">
            <Box sx={boxStyle}>
              <TextField
                size="small"
                label={""}
                type={"text"}
                value={cluster.name}
                inputProps={{ "data-skip-focus": true }}
                sx={{
                  textAlign: "left",
                  minWidth: 110,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "12px",
                      padding: "0px",
                    },
                  },
                }}
              />
            </Box>
            {[
              cluster.range,
              cluster.percent,
              cluster.tolerance,
              cluster.penalty,
            ].map((node) => (
              <NodeComponent
                key={node.key}
                value={node.value}
                onChange={node.onChange}
                adorn={node.adorn}
                readonly={node.readonly}
                backgroundColor={node.backgroundColor}
                show={node.show}
                setShow={node.setShow}
                label={node.label}
                error={node.error}
                showVisilibilityButton={node.showVisilibilityButton}
              />
            ))}
          </Stack>
        </Box>
      ))}
      
      {/* GroupSummary: Se muestra después de los parámetros del grupo de tolerancia */}
      {hasGroupToleranceParams && (
        <Box mb={0.2} mt={1}>
          <Stack spacing={2} direction="row">
            <Box sx={boxStyle}>
              <TextField
                size="small"
                label={""}
                type={"text"}
                value={""}
                inputProps={{ "data-skip-focus": true }}
                sx={{
                  padding: 0,
                  textAlign: "left",
                  minWidth: 110,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                    "& .MuiInputBase-input": {
                      padding: "0px",
                    },
                  },
                }}
              />
            </Box>
            
            <Box sx={boxStyle}>
              <TextField
                size="small"
                label={""}
                type={"text"}
                value={liveClusters.groupSummary.name}
                inputProps={{ "data-skip-focus": true }}
                sx={{
                  padding: 0,
                  textAlign: "left",
                  minWidth: 110,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                    "& .MuiInputBase-input": {
                      padding: "0px",
                    },
                  },
                }}
              />
            </Box>
            {[
              liveClusters.groupSummary.percent,
              liveClusters.groupSummary.tolerance,
              liveClusters.groupSummary.penalty,
            ].map((node) => (
              <NodeComponent
                key={node.key}
                label={node.label}
                value={node.value}
                onChange={node.onChange}
                adorn={node.adorn}
                readonly={node.readonly}
                backgroundColor={node.backgroundColor}
                show={node.show}
                setShow={node.setShow}
                showVisilibilityButton={false}
                error={node.error}
              />
            ))}
          </Stack>
        </Box>
      )}

      <Box mb={0.2} mt={1}>
        <Stack spacing={2} direction="row">
          <Box sx={boxStyle}>
            <TextField
              size="small"
              label={""}
              type={"text"}
              value={""}
              inputProps={{ "data-skip-focus": true }}
              sx={{
                padding: 0,
                textAlign: "left",
                minWidth: 110,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                  "& .MuiInputBase-input": {
                    padding: "0px",
                  },
                },
              }}
            />
          </Box>
          
          <Box sx={boxStyle}>
            <TextField
              size="small"
              label={""}
              type={"text"}
              value={liveClusters.Summary.name}
              inputProps={{ "data-skip-focus": true }}
              sx={{
                padding: 0,
                textAlign: "left",
                minWidth: 110,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                  "& .MuiInputBase-input": {
                    padding: "0px",
                  },
                },
              }}
            />
          </Box>
          {[
            liveClusters.Summary.percent,
            liveClusters.Summary.tolerance,
            liveClusters.Summary.penalty,
          ].map((node) => (
            <NodeComponent
              key={node.key}
              label={node.label}
              value={node.value}
              onChange={node.onChange}
              adorn={node.adorn}
              readonly={node.readonly}
              backgroundColor={node.backgroundColor}
              show={node.show}
              setShow={node.setShow}
              showVisilibilityButton={false}
              error={node.error}
            />
          ))}
        </Stack>
      </Box>
      
      {/* BONIFICACIÓN debajo de summary, siguiendo el patrón exacto de las filas superiores, con caja vacía para porcentaje */}
      {(!data?.template || data.template.availableBonus) && (
        <Box mb={0.2} mt={1}>
          <Stack spacing={2} direction="row">
            {/* Primer box vacío para alinear con las filas superiores */}
            <Box sx={boxStyle}>
              <TextField
                size="small"
                label={""}
                type={"text"}
                value={""}
                inputProps={{ "data-skip-focus": true }}
                sx={{
                  padding: 0,
                  minWidth: 110,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                    '& .MuiInputBase-input': { padding: '0px' },
                  },
                }}
              />
            </Box>
            {/* Segundo box con el nombre */}
            <Box sx={boxStyle}>
              <TextField
                size="small"
                label={""}
                type={"text"}
                value={liveClusters.Bonus.name}
                inputProps={{ "data-skip-focus": true }}
                sx={{
                  padding: 0,
                  textAlign: "left",
                  minWidth: 110,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                    '& .MuiInputBase-input': { padding: '0px' },
                  },
                }}
              />
            </Box>
            {/* Caja vacía para el porcentaje */}
            <Box sx={{ minWidth: 110 }} />
            {/* Contenedor para tolerance y penalty - usando Stack con spacing para alinear y dar ancho consistente */}
            <Stack spacing={2} direction="row">
              {/* tolerance - minWidth asegura que ocupa el mismo espacio que otros campos */}
              {liveClusters.Bonus.tolerance ? (
                <NodeComponent
                  key={liveClusters.Bonus.tolerance.key}
                  label={liveClusters.Bonus.tolerance.label}
                  value={liveClusters.Bonus.tolerance.value}
                  onChange={liveClusters.Bonus.tolerance.onChange}
                  adorn={liveClusters.Bonus.tolerance.adorn}
                  readonly={liveClusters.Bonus.tolerance.readonly}
                  backgroundColor={liveClusters.Bonus.tolerance.backgroundColor}
                  show={liveClusters.Bonus.tolerance.show}
                  setShow={liveClusters.Bonus.tolerance.setShow}
                  showVisilibilityButton={false}
                  error={liveClusters.Bonus.tolerance.error}
                />
              ) : (
                <Box sx={{ minWidth: 110 }} />
              )}
              {/* penalty */}
              {liveClusters.Bonus.penalty ? (
                <NodeComponent
                  key={liveClusters.Bonus.penalty.key}
                  label={liveClusters.Bonus.penalty.label}
                  value={liveClusters.Bonus.penalty.value}
                  onChange={liveClusters.Bonus.penalty.onChange}
                  adorn={liveClusters.Bonus.penalty.adorn}
                  readonly={liveClusters.Bonus.penalty.readonly}
                  backgroundColor={liveClusters.Bonus.penalty.backgroundColor}
                  show={liveClusters.Bonus.penalty.show}
                  setShow={liveClusters.Bonus.penalty.setShow}
                  showVisilibilityButton={false}
                  error={liveClusters.Bonus.penalty.error}
                />
              ) : (
                <Box sx={{ minWidth: 110 }} />
              )}
            </Stack>
          </Stack>
        </Box>
      )}
      
      {/* SECADO debajo de Bonificación, solo percent, los demás espacios vacíos */}
      {(!data?.template || data.template.availableDry) && (
        <Box mb={0.2} mt={1}>
          <Stack spacing={2} direction="row">
            {/* Primer box vacío para alinear con las filas superiores */}
            <Box sx={boxStyle}>
              <TextField
                size="small"
                label={""}
                type={"text"}
                value={""}
                inputProps={{ "data-skip-focus": true }}
                sx={{
                  padding: 0,
                  minWidth: 110,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                    '& .MuiInputBase-input': { padding: '0px' },
                  },
                }}
              />
            </Box>
            {/* Segundo box con la palabra Secado */}
            <Box sx={boxStyle}>
              <TextField
                size="small"
                label={""}
                type={"text"}
                value={liveClusters.Dry.name}
                inputProps={{ "data-skip-focus": true }}
                sx={{
                  padding: 0,
                  textAlign: "left",
                  minWidth: 110,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                    '& .MuiInputBase-input': { padding: '0px' },
                  },
                }}
              />
            </Box>
            {/* Tercer box: input de porcentaje - uso directo de NodeComponent para mantener consistencia con otros campos */}
            {liveClusters.Dry.percent ? (
              <NodeComponent
                key={liveClusters.Dry.percent.key}
                label={liveClusters.Dry.percent.label}
                value={liveClusters.Dry.percent.value}
                onChange={liveClusters.Dry.percent.onChange}
                adorn={liveClusters.Dry.percent.adorn}
                readonly={liveClusters.Dry.percent.readonly}
                backgroundColor={liveClusters.Dry.percent.backgroundColor}
                show={liveClusters.Dry.percent.show}
                setShow={liveClusters.Dry.percent.setShow}
                showVisilibilityButton={false}
                error={liveClusters.Dry.percent.error}
              />
            ) : (
              <Box sx={{ minWidth: 110 }} />
            )}
            {/* Cuarto y quinto box vacíos para mantener alineación */}
            <Box sx={{ minWidth: 110 }} />
            <Box sx={{ minWidth: 110 }} />
          </Stack>
        </Box>
      )}

      {/* Leyenda de colores para grupo de tolerancia */}
      {hasGroupToleranceParams && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box 
            sx={{ 
              width: 16, 
              height: 16, 
              backgroundColor: '#ede7f6', 
              borderRadius: '4px',
              border: '1px solid #d1c4e9'
            }} 
          />
          <Typography variant="caption" color="text.secondary">
            Parámetros que pertenecen al grupo de tolerancia
          </Typography>
        </Box>
      )}
    </Box>
  );
}
