"use client";

import { useReceptionContext } from "@/context/ReceptionDataContext";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Paper,
  CircularProgress,
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
import { KeyCluster } from "@/hooks/paramCells";

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

// Componente de carga con logo
const LoadingIndicator: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
      gap: 2,
      py: 3
    }}
  >
    <CircularProgress size={40} />
    <Typography 
      variant="body2" 
      color="text.secondary"
      sx={{ textAlign: 'center' }}
    >
      Cargando parámetros de análisis...
    </Typography>
  </Box>
);

// Helper function to create a text display node that accepts string values
const createTextDisplayNode = (key: string, textValue: string): Node => {
  const node = createBlankNode(key, "");
  node.value = 0;
  node.label = textValue;
  node.readonly = true;
  return node;
};

const boxStyle = {
  display: "flex",
  alignItems: "center",
  minWidth: 110,
};

// Componente de botón de visibilidad separado
const VisibilityButton: React.FC<{
  isVisible: boolean;
  onToggle: () => void;
}> = ({ isVisible, onToggle }) => (
  <IconButton
    size="small"
    onClick={onToggle}
    aria-hidden="true"
    sx={{
      ml: 0,
      mr: 0,
      p: 0.3,
      height: "28px",
      width: "28px"
    }}
  >
    {isVisible ? (
      <VisibilityOff fontSize="small" />
    ) : (
      <Visibility fontSize="small" />
    )}
  </IconButton>
);

// Componente para células vacías que mantienen el espacio
const EmptyCell = () => (
  <Box sx={{ 
    ...boxStyle,
    visibility: 'hidden',
  }}>
    <TextField
      size="small"
      type="number"
      value={0}
      inputProps={{ "data-skip-focus": true }}
      sx={{ 
        minWidth: 110,
        height: "32px",
        "& .MuiInputBase-root": {
          height: "32px"
        },
        "& .MuiInputBase-input": {
          padding: "6px 8px",
          fontSize: "0.875rem",
          lineHeight: "1.2"
        }
      }}
    />
  </Box>
);

const NodeComponent: React.FC<NodeProps> = (node: NodeProps) => {
  const displayValue = typeof node.value === 'number' ? node.value : node.value;
  
  return (
    <Box sx={boxStyle}>
      <TextField
        size="small"
        label={node.label}
        type={typeof node.value === 'number' ? "number" : "text"}
        value={displayValue}
        onChange={(e) => {
          if (typeof node.value === 'number') {
            node.onChange(parseFloat(e.target.value) || 0);
          }
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
          visibility: node.show ? 'visible' : 'hidden',
          height: "32px",
          "& .MuiInputBase-root": {
            height: "32px"
          },
          "& .MuiInputBase-input": {
            padding: "6px 8px",
            fontSize: "0.875rem",
            lineHeight: "1.2"
          }
        }}
      />
    </Box>
  );
};

// Componente de fila con 6 columnas para el análisis de granos
const GrainRow: React.FC<{
  paramName: string;
  range?: RangeNode | Node;
  percent?: Node;
  tolerance?: Node;
  showVisibilityButton?: boolean;
  onToggleVisibility?: () => void;
  isVisible?: boolean;
  penalty?: Node;
  backgroundColor?: string;
}> = ({
  paramName,
  range,
  percent,
  tolerance,
  showVisibilityButton = false,
  onToggleVisibility,
  isVisible = true,
  penalty,
  backgroundColor,
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'row', 
        mt: 1,
        alignItems: 'center',
        minHeight: '32px'
      }}
    >
      {/* Columna 1: Nombre del parámetro */}
      <Box sx={{ width: 156, mr: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 500,
            fontSize: "0.875rem"
          }}
        >
          {paramName}
        </Typography>
      </Box>

      {/* Columna 2: Rango */}
      <Box sx={{ width: 110, mr: 1 }}>
        {range ? (
          range.readonly && range.label && range.value === 0 ? (
            <Typography
              variant="body2"
              sx={{
                minWidth: 110,
                visibility: range.show ? 'visible' : 'hidden',
                textAlign: "left",
                padding: "6px 0px",
                fontWeight: 500,
                fontSize: "0.875rem",
                lineHeight: "1.2"
              }}
            >
              {range.label}
            </Typography>
          ) : (
            <NodeComponent
              key={range.key}
              value={typeof range.value === 'string' ? range.value : (range.label && range.readonly) ? range.label : range.value}
              onChange={range.onChange}
              adorn={range.adorn}
              readonly={range.readonly}
              backgroundColor={range.backgroundColor}
              show={range.show}
              setShow={range.setShow}
              label={range.label && !range.readonly ? range.label : undefined}
              error={range.error}
              showVisilibilityButton={false}
            />
          )
        ) : (
          <EmptyCell />
        )}
      </Box>

      {/* Columna 3: Porcentaje */}
      <Box sx={{ width: 110, mr: 1 }}>
        {percent ? (
          <NodeComponent
            key={percent.key}
            value={percent.value}
            onChange={percent.onChange}
            adorn={percent.adorn}
            readonly={percent.readonly}
            backgroundColor={percent.backgroundColor}
            show={percent.show}
            setShow={percent.setShow}
            label={percent.label}
            error={percent.error}
            showVisilibilityButton={false}
          />
        ) : (
          <EmptyCell />
        )}
      </Box>

      {/* Columna 4: Tolerancia */}
      <Box sx={{ width: 110, mr: 1 }}>
        {tolerance ? (
          <NodeComponent
            key={tolerance.key}
            value={tolerance.value}
            onChange={tolerance.onChange}
            adorn={tolerance.adorn}
            readonly={tolerance.readonly}
            backgroundColor={tolerance.backgroundColor}
            show={tolerance.show}
            setShow={tolerance.setShow}
            label={tolerance.label}
            error={tolerance.error}
            showVisilibilityButton={false}
          />
        ) : (
          <EmptyCell />
        )}
      </Box>

      {/* Columna 5: Botón de visibilidad */}
      <Box sx={{ 
        width: 40, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        {showVisibilityButton && onToggleVisibility ? (
          <VisibilityButton isVisible={isVisible} onToggle={onToggleVisibility} />
        ) : (
          <Box sx={{ width: 40 }} />
        )}
      </Box>

      {/* Columna 6: Penalización */}
      <Box sx={{ width: 110 }}>
        {penalty ? (
          <NodeComponent
            key={penalty.key}
            value={penalty.value}
            onChange={penalty.onChange}
            adorn={penalty.adorn}
            readonly={penalty.readonly}
            backgroundColor={penalty.backgroundColor}
            show={penalty.show}
            setShow={penalty.setShow}
            label={penalty.label}
            error={penalty.error}
            showVisilibilityButton={false}
          />
        ) : (
          <EmptyCell />
        )}
      </Box>
    </Box>
  );
};

export default function GrainAnalysisForm() {
  const { liveClusters, data } = useReceptionContext();
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchAllRanges = async () => {
      setIsLoading(true);
      
      try {
        // Crear todas las promesas de manera paralela para mejor rendimiento
        const fetchPromises = [
          getDiscountPercentsByCode(liveClusters.Humedad.range.code)
            .then(ranges => liveClusters.Humedad.range.setRanges(ranges)),
          getDiscountPercentsByCode(liveClusters.GranosVerdes.range.code)
            .then(ranges => liveClusters.GranosVerdes.range.setRanges(ranges)),
          getDiscountPercentsByCode(liveClusters.Impurezas.range.code)
            .then(ranges => liveClusters.Impurezas.range.setRanges(ranges)),
          getDiscountPercentsByCode(liveClusters.Vano.range.code)
            .then(ranges => liveClusters.Vano.range.setRanges(ranges)),
          getDiscountPercentsByCode(liveClusters.Hualcacho.range.code)
            .then(ranges => liveClusters.Hualcacho.range.setRanges(ranges)),
          getDiscountPercentsByCode(liveClusters.GranosManchados.range.code)
            .then(ranges => liveClusters.GranosManchados.range.setRanges(ranges)),
          getDiscountPercentsByCode(liveClusters.GranosPelados.range.code)
            .then(ranges => liveClusters.GranosPelados.range.setRanges(ranges)),
          getDiscountPercentsByCode(liveClusters.GranosYesosos.range.code)
            .then(ranges => liveClusters.GranosYesosos.range.setRanges(ranges))
        ];

        // Esperar a que todas las promesas se resuelvan
        await Promise.all(fetchPromises);
        
      } catch (error) {
        console.error('Error cargando rangos de descuento:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllRanges();
  }, [liveClusters]);

  // Efecto: Si el grupo de tolerancia está activo, ocultar los campos de tolerancia individuales
  useEffect(() => {
    if (data?.template?.useToleranceGroup) {
      const groupToleranceKeys = [
        "Humedad",
        "GranosVerdes",
        "Impurezas",
        "Vano",
        "Hualcacho",
        "GranosManchados",
        "GranosPelados",
        "GranosYesosos",
      ] as const;
      const groupToleranceMap = {
        Humedad: data.template.groupToleranceHumedad,
        GranosVerdes: data.template.groupToleranceGranosVerdes,
        Impurezas: data.template.groupToleranceImpurezas,
        Vano: data.template.groupToleranceVano,
        Hualcacho: data.template.groupToleranceHualcacho,
        GranosManchados: data.template.groupToleranceGranosManchados,
        GranosPelados: data.template.groupToleranceGranosPelados,
        GranosYesosos: data.template.groupToleranceGranosYesosos,
      };
      groupToleranceKeys.forEach((key) => {
        const isGroup = groupToleranceMap[key];
        const cluster = liveClusters[key];
        if (isGroup && cluster && 'tolerance' in cluster && cluster.tolerance) {
          cluster.tolerance.show = false;
        }
      });
    }
  }, [data?.template?.useToleranceGroup, data?.template?.groupToleranceHumedad, data?.template?.groupToleranceGranosVerdes, data?.template?.groupToleranceImpurezas, data?.template?.groupToleranceVano, data?.template?.groupToleranceHualcacho, data?.template?.groupToleranceGranosManchados, data?.template?.groupToleranceGranosPelados, data?.template?.groupToleranceGranosYesosos, liveClusters]);

  const paramClusters = Object.values(liveClusters).filter(
    (c): c is ParamCluster => c.type === "param"
  ).filter((cluster) => {
    if (!data?.template) {
      return true;
    }
    
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
    return isAvailable;
  });

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

  const nonGroupToleranceParams = paramClusters.filter(cluster => 
    !data?.template?.useToleranceGroup || !groupToleranceMap[cluster.key]
  );
  
  const groupToleranceParams = paramClusters.filter(cluster => 
    data?.template?.useToleranceGroup && groupToleranceMap[cluster.key]
  );

  if (isLoading) {
    return (
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Análisis de Granos
        </Typography>
        <LoadingIndicator />
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Análisis de Granos
      </Typography>
      
      {/* Encabezados de columnas */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          mb: 1, 
          borderBottom: '1px solid #e0e0e0',
          pb: 1
        }}
      >
        <Box sx={{ width: 156, mr: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight="bold">
            Parámetro
          </Typography>
        </Box>
        <Box sx={{ width: 110, mr: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight="bold">
            Rango
          </Typography>
        </Box>
        <Box sx={{ width: 110, mr: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight="bold">
            Porcentaje
          </Typography>
        </Box>
        <Box sx={{ width: 110, mr: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight="bold">
            Tolerancia
          </Typography>
        </Box>
        <Box sx={{ width: 40 }} />
        <Box sx={{ width: 110 }}>
          <Typography variant="caption" color="text.secondary" fontWeight="bold">
            Descuento
          </Typography>
        </Box>
      </Box>

      {/* Renderizar primero los parámetros que NO pertenecen al grupo de tolerancia */}
      {nonGroupToleranceParams.map((cluster) => (
        <GrainRow
          key={cluster.key}
          paramName={cluster.name}
          range={cluster.range}
          percent={cluster.percent}
          tolerance={cluster.tolerance}
          showVisibilityButton={data.template ? 
            (cluster.key === 'Humedad' && data.template.showToleranceHumedad) ||
            (cluster.key === 'GranosVerdes' && data.template.showToleranceGranosVerdes) ||
            (cluster.key === 'Impurezas' && data.template.showToleranceImpurezas) ||
            (cluster.key === 'Vano' && data.template.showToleranceVano) ||
            (cluster.key === 'Hualcacho' && data.template.showToleranceHualcacho) ||
            (cluster.key === 'GranosManchados' && data.template.showToleranceGranosManchados) ||
            (cluster.key === 'GranosPelados' && data.template.showToleranceGranosPelados) ||
            (cluster.key === 'GranosYesosos' && data.template.showToleranceGranosYesosos) 
            : false
          }
          onToggleVisibility={cluster.tolerance.setShow}
          isVisible={cluster.tolerance.show}
          penalty={cluster.penalty}
        />
      ))}
      
      {/* Renderizar después los parámetros del grupo de tolerancia */}
      {groupToleranceParams.map((cluster) => (
        <GrainRow
          key={cluster.key}
          paramName={cluster.name}
          range={cluster.range}
          percent={cluster.percent}
          tolerance={cluster.tolerance}
          showVisibilityButton={data.template ? 
            (cluster.key === 'Humedad' && data.template.showToleranceHumedad) ||
            (cluster.key === 'GranosVerdes' && data.template.showToleranceGranosVerdes) ||
            (cluster.key === 'Impurezas' && data.template.showToleranceImpurezas) ||
            (cluster.key === 'Vano' && data.template.showToleranceVano) ||
            (cluster.key === 'Hualcacho' && data.template.showToleranceHualcacho) ||
            (cluster.key === 'GranosManchados' && data.template.showToleranceGranosManchados) ||
            (cluster.key === 'GranosPelados' && data.template.showToleranceGranosPelados) ||
            (cluster.key === 'GranosYesosos' && data.template.showToleranceGranosYesosos) 
            : false
          }
          onToggleVisibility={cluster.tolerance.setShow}
          isVisible={cluster.tolerance.show}
          penalty={cluster.penalty}
        />
      ))}
      
      {/* GroupSummary: Se muestra después de los parámetros del grupo de tolerancia */}
      {hasGroupToleranceParams && (
        <GrainRow
          paramName="Total Grupo Tolerancia"
          percent={liveClusters.groupSummary.percent}
          tolerance={liveClusters.groupSummary.tolerance}
          penalty={liveClusters.groupSummary.penalty}
        />
      )}

      {/* Summary: Total del análisis */}
      <GrainRow
        paramName="Total Análisis"
        percent={liveClusters.Summary.percent}
        tolerance={liveClusters.Summary.tolerance}
        penalty={liveClusters.Summary.penalty}
      />
      
      {/* Bonificación */}
      {(!data?.template || data.template.availableBonus) && (
        <GrainRow
          paramName="Bonificación"
          tolerance={liveClusters.Bonus.tolerance}
          penalty={liveClusters.Bonus.penalty}
        />
      )}
      
      {/* Secado */}
      {(!data?.template || data.template.availableDry) && (
        <GrainRow
          paramName="Secado"
          percent={liveClusters.Dry.percent}
        />
      )}
    </Paper>
  );
}
