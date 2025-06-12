"use client";
import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarQuickFilter,
  useGridApiContext,
} from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  CssVarsProvider,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import esESGrid from "./translate";
import { formatNumericColumns } from "./gridFormatters";

//       valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 2  })
import * as XLSX from "xlsx";
import { getVisibleRows } from "@mui/x-data-grid/internals";
import { useTheme, useMediaQuery } from "@mui/material";

interface FormComponentProps {
  afterSubmit: () => void;
}

interface CustomToolbarProps {
  title?: string;
  onOpenDialog?: () => void; // Nueva función para abrir el diálogo
  FormComponent?: React.FC<FormComponentProps>; // Componente opcional para el formulario
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({
  title = "",
  onOpenDialog,
  FormComponent,
}) => {
  const isSmall = useMediaQuery("(max-width:500px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isSmall ? "column" : "row",
        alignItems: isSmall ? "flex-start" : "center",
        justifyContent: "space-between",
        padding: 2,
        gap: isSmall ? 1 : 2,
      }}
    >
      {/* Primera línea: Título y botón (+) */}
      <Box
        sx={{
          display: "flex",
          width: "100%",

          alignItems: "center",
        }}
      >
        {FormComponent && (
          <IconButton
            aria-label="Nuevo"
            onClick={onOpenDialog}
            size="large"
            sx={{
              marginRight: 1,
            }}
          >
            <AddCircleIcon />
          </IconButton>
        )}
        <Typography fontSize={isSmall ? "1.3rem" : "1.50rem"}>
          {title}
        </Typography>
      </Box>

      {/* Segunda línea: buscador */}
      <GridToolbarQuickFilter
        variant="outlined"
        size="small"
        sx={{
          width: "100%",
          maxWidth: isSmall ? "80vw" : 300,
          fontSize: isSmall ? "0.8rem" : "inherit",
          alignSelf: isSmall ? "stretch" : "center",
          mt: isSmall ? 1 : 0, // espacio arriba en pantallas pequeñas
        }}
      />
    </Box>
  );
};

interface CustomFooterProps {
  setGridApiRef: (apiRef: any) => void;
  title?: string;
}

const CustomFooter: React.FC<CustomFooterProps> = ({
  setGridApiRef,
  title,
}) => {
  const apiRef = useGridApiContext();

  useEffect(() => {
    setGridApiRef(apiRef);
  }, []);

  const handleExport = () => {
    if (!apiRef.current) return;
    // Obtener filas visibles (paginadas y filtradas)
    const visibleData = getVisibleRows(apiRef);
    const rows = visibleData.rows.map((row) => row.model);

    if (!rows.length) return;

    // Obtener columnas visibles y excluir __check__ y otras técnicas
    const visibleColumns = apiRef.current
      .getVisibleColumns()
      .filter((col) => col.field !== "__check__" && col.field !== "actions");

    // Construir encabezado personalizado con headerName como título
    const headers = visibleColumns.map((col) => col.headerName || col.field);
    const fields = visibleColumns.map((col) => col.field);

    // Construir data como array de arrays, primera fila es headers
    const data = [
      headers,
      ...rows.map((row) => fields.map((field) => row[field] ?? "")),
    ];

    // Crear hoja de cálculo
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);

    // filename
    const formatTitle = title || "excel";
    const now = new Date();
    const date = now.toISOString().slice(0, 10); // yyyy-mm-dd
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    const filename = `${formatTitle}_${date}_${hours}:${minutes}.xlsx`;

    // Descargar
    XLSX.writeFile(workbook, filename);
  };

  return (
    <Box
      sx={{
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        pl: 2,
        pr: 2,
        pt: 1,
        pb: 1,
        width: "100%",
        gap: 2,
      }}
    >
      <IconButton
        aria-label="Descargar"
        onClick={() => {
          handleExport();
        }}
      >
        <svg width="24" height="24" viewBox="0 0 26 26">
          <path
            fill="#757575"
            d="M25.162,3H16v2.984h3.031v2.031H16V10h3v2h-3v2h3v2h-3v2h3v2h-3v3h9.162
              C25.623,23,26,22.609,26,22.13V3.87C26,3.391,25.623,3,25.162,3z M24,20h-4v-2h4V20z M24,16h-4v-2h4V16z M24,12h-4v-2h4V12z M24,8
              h-4V6h4V8z"
          />
          <path
            fill="#424242"
            d="M0,2.889v20.223L15,26V0L0,2.889z M9.488,18.08l-1.745-3.299c-0.066-0.123-0.134-0.349-0.205-0.678
              H7.511C7.478,14.258,7.4,14.494,7.277,14.81l-1.751,3.27H2.807l3.228-5.064L3.082,7.951h2.776l1.448,3.037
              c0.113,0.24,0.214,0.525,0.304,0.854h0.028c0.057-0.198,0.163-0.492,0.318-0.883l1.61-3.009h2.542l-3.037,5.022l3.122,5.107
              L9.488,18.08L9.488,18.08z"
          />
        </svg>
      </IconButton>
    </Box>
  );
};

interface AppDataGridProps {
  rows?: any[];
  columns?: any[];
  title?: string;
  FormComponent?: React.FC<FormComponentProps>; // Componente opcional para el formulario
  refresh?: () => void;
  setGridApiRef?: (apiRef: any) => void;
  height?: string;
}

export default function AppDataGrid({
  rows = [],
  columns = [],
  title = "",
  FormComponent, // Recibe el componente como prop opcional
  refresh,
  setGridApiRef = () => {},
  height = "auto",
}: AppDataGridProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const isSmall = useMediaQuery("(max-width:500px)");

  const handleRefresh = () => {
    if (typeof refresh === "function") {
      refresh();
    }
  };

  const formatColumns = (columns: any[]) => {
    return columns.map((col) => {
      if (col.type === "number" && !col.valueFormatter) {
        return {
          ...col,
          valueFormatter: (params: any) =>
            typeof params.value === "number"
              ? params.value.toString()
              : params.value,
        };
      }
      return col;
    });
  };

  const formattedColumns = formatColumns(columns);
  return (
    <>
      <DataGrid
        sx={{
          height: height,
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: 1,
          fontSize: isSmall ? "0.7rem" : "inherit",
          "& .MuiDataGrid-columnHeaders": {
            //borderBottom: "1px solid #ccc", // Borde inferior del header
          },
          overflowX: "auto",
          "& .MuiDataGrid-virtualScroller": {
            overflowX: "auto",
          },

          "& .MuiDataGrid-main": {
            minWidth: "1000px", // 👉 fuerza columnas anchas para que aparezca scroll
          },
        }}
        initialState={{
          scroll: { top: 0, left: 0 },
          columns: {
            // columnVisibilityModel: {
            //   id: false,
            // },
          },
        }}
        rows={rows}
        columns={formattedColumns}
        localeText={esESGrid}
        density="compact"
        getRowHeight={() => "auto"}
        slots={{
          toolbar: () => (
            <CustomToolbar
              title={title}
              onOpenDialog={handleOpenDialog}
              FormComponent={FormComponent}
            />
          ),
          footer: () => <CustomFooter setGridApiRef={setGridApiRef}  title={title}/>,
        }}
      />

      {/* Diálogo de formulario */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box
          sx={{
            padding: 1,
          }}
        >
          {FormComponent ? (
            <FormComponent
              afterSubmit={() => {
                handleCloseDialog();
                handleRefresh();
              }}
            />
          ) : (
            <Typography>No hay formulario disponible</Typography>
          )}
        </Box>
      </Dialog>
    </>
  );
}
