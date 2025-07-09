"use client";

import { useReceptionContext } from "@/context/ReceptionDataContext";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
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
      minHeight: 300,
      gap: 3,
      py: 4
    }}
  >
    {/* Logo animado con efecto pulsante y rotación */}
    <Box
      sx={{
        width: 100,
        height: 100,
        position: 'relative',
        animation: 'logoAnimation 3s ease-in-out infinite',
        '@keyframes logoAnimation': {
          '0%': { 
            transform: 'rotate(0deg) scale(1)',
            opacity: 0.8
          },
          '25%': { 
            transform: 'rotate(90deg) scale(1.05)',
            opacity: 1
          },
          '50%': { 
            transform: 'rotate(180deg) scale(1)',
            opacity: 0.9
          },
          '75%': { 
            transform: 'rotate(270deg) scale(1.05)',
            opacity: 1
          },
          '100%': { 
            transform: 'rotate(360deg) scale(1)',
            opacity: 0.8
          }
        }
      }}
    >
      <img 
        src="/logo.svg" 
        alt="Cargando análisis de grano"
        style={{ 
          width: '100%', 
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 4px 8px rgba(25, 118, 210, 0.3))'
        }}
      />
    </Box>
    
    {/* Puntos de carga animados */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 1
      }}
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#1976d2',
            animation: 'dotPulse 1.4s ease-in-out infinite',
            animationDelay: `${index * 0.16}s`,
            '@keyframes dotPulse': {
              '0%': {
                transform: 'scale(0)',
                opacity: 1
              },
              '50%': {
                transform: 'scale(1)',
                opacity: 0.7
              },
              '100%': {
                transform: 'scale(0)',
                opacity: 1
              }
            }
          }}
        />
      ))}
    </Box>
    
    {/* Texto de carga con animación de escritura */}
    <Typography 
      variant="body1" 
      color="text.secondary"
      sx={{ 
        fontSize: '16px',
        fontWeight: 500,
        textAlign: 'center',
        animation: 'textFade 2s ease-in-out infinite alternate',
        '@keyframes textFade': {
          '0%': { opacity: 0.6 },
          '100%': { opacity: 1 }
        }
      }}
    >
      Cargando análisis de grano...
    </Typography>
    
    {/* Subtexto informativo */}
    <Typography 
      variant="caption" 
      color="text.disabled"
      sx={{ 
        fontSize: '12px',
        textAlign: 'center',
        maxWidth: 250,
        lineHeight: 1.4
      }}
    >
      Configurando parámetros y rangos de descuento según el template seleccionado
    </Typography>
  </Box>
);

// Helper function to create a text display node that accepts string values
const createTextDisplayNode = (key: string, textValue: string): Node => {
  const node = createBlankNode(key, "");
  // Convert the string to a number (0) for internal use, but display the string in the UI
  node.value = 0;
  // We'll use label to store the actual string value and handle it in the NodeComponent
  node.label = textValue;
  node.readonly = true;
  return node;
};

const boxStyle = {
  display: "flex",
  alignItems: "center",
  minWidth: 110, // Ancho fijo para mantener consistencia
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
      p: 0.3, // Reducido de 0.5 a 0.3
      height: "28px", // Altura fija más pequeña
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
      type={"number"}
      value={0}
      inputProps={{ "data-skip-focus": true }}
      sx={{ 
        minWidth: 110,
        height: "32px", // Altura fija reducida
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
  // Determine if we're displaying a numeric value or text-based value (from label)
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
            node.onChange(parseFloat(e.target.value));
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
          height: "32px", // Altura fija reducida
          "& .MuiInputBase-root": {
            height: "32px" // Asegurar que el input tenga la altura reducida
          },
          "& .MuiInputBase-input": {
            padding: "6px 8px", // Padding vertical reducido
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
        mt: 1, // MarginTop de 1 para todos los GrainRow
        alignItems: 'center',
        minHeight: '32px' // Altura mínima reducida para controlar la altura total
      }}
    >
      {/* Columna 1: Nombre del parámetro */}
      <Box sx={{ ...boxStyle, width: 156, mr: 1 }}>
        {paramName ? (
          <TextField
            size="small"
            type="text"
            value={paramName}
            inputProps={{ "data-skip-focus": true }}
            sx={{
              textAlign: "left",
              minWidth: 132,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" },
                "&:hover fieldset": { border: "none" },
                "&.Mui-focused fieldset": { border: "none" },
                "& .MuiInputBase-input": { 
                  padding: "6px 0px", // Reducido de padding original
                  fontSize: "0.875rem",
                  lineHeight: "1.2"
                },
              },
              height: "32px" // Altura fija reducida para el TextField
            }}
          />
        ) : (
          <Box sx={{ minWidth: 132 }} />
        )}
      </Box>

      {/* Columna 2: Rango o nombre secundario */}
      <Box sx={{ ...boxStyle, width: 130, mr: 1 }}>
        {range ? (
          // Si es un nodo de texto (readonly con label), renderizar como texto simple
          range.readonly && range.label && range.value === 0 ? (
            <Typography
              variant="body2"
              sx={{
                minWidth: 110,
                visibility: range.show ? 'visible' : 'hidden',
                textAlign: "left",
                padding: "6px 0px", // Reducido de 8px a 6px
                fontWeight: 500,
                fontSize: "0.875rem",
                lineHeight: "1.2" // Altura de línea más compacta
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
      <Box sx={{ ...boxStyle, width: 130, mr: 1 }}>
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
      <Box sx={{ ...boxStyle, width: 130, mr: 0 }}>
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
        alignItems: 'center',
        mr: 0 
      }}>
        {showVisibilityButton && onToggleVisibility ? (
          <VisibilityButton isVisible={isVisible} onToggle={onToggleVisibility} />
        ) : (
          <Box sx={{ width: 40 }} /> // Espacio vacío para mantener alineación
        )}
      </Box>

      {/* Columna 6: Penalización */}
      <Box sx={{ ...boxStyle, width: 130, mr: 0 }}>
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

export default function GrainAnalysis() {
  const { liveClusters, data } = useReceptionContext();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

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
      setShowContent(false);
      
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
        
        // Pequeña pausa adicional para asegurar que todos los parámetros se han procesado
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        console.error('Error cargando rangos de descuento:', error);
      } finally {
        setIsLoading(false);
        // Activar la animación después de un pequeño delay
        setTimeout(() => setShowContent(true), 100);
      }
    };

    fetchAllRanges();
  }, [liveClusters.Humedad.range.code]);

  // Efecto: Si el grupo de tolerancia está activo, ocultar los campos de tolerancia individuales
  useEffect(() => {
    if (data?.template?.useToleranceGroup) {
      // Solo incluir los parámetros relevantes para grupo de tolerancia
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
        // liveClusters always has these keys, and they are ParamCluster
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
    // Si no hay template, mostrar todos los clusters
    if (!data?.template) {
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
      {/* Mostrar indicador de carga mientras se cargan los datos */}
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <Box
          sx={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            '& > *': {
              opacity: showContent ? 1 : 0,
              transform: showContent ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: showContent ? 'var(--delay, 0ms)' : '0ms',
            },
            '& > *:nth-of-type(1)': { '--delay': '100ms' },
            '& > *:nth-of-type(2)': { '--delay': '150ms' },
            '& > *:nth-of-type(3)': { '--delay': '200ms' },
            '& > *:nth-of-type(4)': { '--delay': '250ms' },
            '& > *:nth-of-type(5)': { '--delay': '300ms' },
            '& > *:nth-of-type(6)': { '--delay': '350ms' },
            '& > *:nth-of-type(7)': { '--delay': '400ms' },
            '& > *:nth-of-type(8)': { '--delay': '450ms' },
            '& > *:nth-of-type(9)': { '--delay': '500ms' },
            '& > *:nth-of-type(10)': { '--delay': '550ms' },
          }}
        >
          {/* Renderizar primero los parámetros que NO pertenecen al grupo de tolerancia */}
          {nonGroupToleranceParams.map((cluster, index) => (
            <GrainRow
              key={cluster.key}
              paramName={cluster.name}
              range={cluster.range}
              percent={cluster.percent}
              tolerance={cluster.tolerance}
              showVisibilityButton={true}
              onToggleVisibility={cluster.tolerance.setShow}
              isVisible={cluster.tolerance.show}
              penalty={cluster.penalty}
            />
          ))}
          
          {/* Renderizar después los parámetros del grupo de tolerancia */}
          {groupToleranceParams.map((cluster, index) => (
            <GrainRow
              key={cluster.key}
              paramName={cluster.name}
              range={cluster.range}
              percent={cluster.percent}
              tolerance={cluster.tolerance}
              showVisibilityButton={true}
              onToggleVisibility={cluster.tolerance.setShow}
              isVisible={cluster.tolerance.show}
              penalty={cluster.penalty}
            />
          ))}
          
          {/* GroupSummary: Se muestra después de los parámetros del grupo de tolerancia */}
          {hasGroupToleranceParams && (
            <GrainRow
              paramName=""
              range={createTextDisplayNode("groupSummary-name", liveClusters.groupSummary.name)}
              percent={liveClusters.groupSummary.percent}
              tolerance={liveClusters.groupSummary.tolerance}
              penalty={liveClusters.groupSummary.penalty}
            />
          )}

          {/* Summary: Total del análisis */}
          <GrainRow
            paramName=""
            range={createTextDisplayNode("summary-name", liveClusters.Summary.name)}
            percent={liveClusters.Summary.percent}
            tolerance={liveClusters.Summary.tolerance}
            penalty={liveClusters.Summary.penalty}
          />
          
          {/* Bonificación */}
          {(!data?.template || data.template.availableBonus) && (
            <GrainRow
              paramName=""
              range={createTextDisplayNode("bonus-name", liveClusters.Bonus.name)}
              tolerance={liveClusters.Bonus.tolerance}
              penalty={liveClusters.Bonus.penalty}
            />
          )}
          
          {/* Secado */}
          {(!data?.template || data.template.availableDry) && (
            <GrainRow
              paramName=""
              range={createTextDisplayNode("dry-name", liveClusters.Dry.name)}
              percent={liveClusters.Dry.percent}
            />
          )}

          {/* Leyenda de colores para grupo de tolerancia */}
          {hasGroupToleranceParams && (
            <>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 16, 
                    height: 16, 
                    backgroundColor: '#eceff1', 
                    borderRadius: '4px',
                    border: '1px solid #d1c4e9'
                  }} 
                />
                <Typography variant="caption" color="text.secondary">
                  Parámetros que pertenecen al grupo de tolerancia
                </Typography>
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
