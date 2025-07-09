"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Dialog } from "@mui/material";
import { Print, Delete, Edit } from "@mui/icons-material";
import { getAllReceptions, deleteReception } from "@/app/actions/reception";
import moment from "moment-timezone";
import { useAlertContext } from "@/context/AlertContext";
import styles from "./receptions-grid.module.css";
import dynamic from "next/dynamic";
import { Reception, ReceptionListItem } from "@/types/reception";

// Función utilitaria para convertir Reception a ReceptionListItem
function toListItem(reception: Reception): ReceptionListItem {
  return {
    id: reception.id,
    producer: reception.producer?.name || 'Sin productor',
    riceType: reception.riceType?.name || 'Sin tipo',
    guide: reception.guide || '',
    licensePlate: reception.licensePlate || '',
    price: reception.price || 0,
    grossWeight: reception.grossWeight || 0,
    tare: reception.tare || 0,
    netWeight: reception.netWeight || 0,
    createdAt: reception.createdAt || '',
    status: reception.status || 'pending',
    paddyNeto: reception.paddyNet || 0,
    totalConDescuentos: reception.totalDiscount || 0
  };
}

// Definir interfaces para los props
interface GridActionsProps {
  row: ReceptionListItem;
  onPrint: (row: ReceptionListItem) => void;
  onEdit: (row: ReceptionListItem) => void;
  onDelete: (row: ReceptionListItem) => void;
}

// Dynamic imports para componentes con dependencias del navegador
const AppDataGrid = dynamic(() => import("@/components/appDataGrid/AppDataGrid"), { 
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <Typography>Cargando tabla...</Typography>
    </Box>
  )
});

const PrintDialog = dynamic(() => import("@/components/PrintDialog/PrintDialog"), { ssr: false });
const DeleteDialog = dynamic(() => import("@/components/deleteDialog/DeleteDialog").then(mod => mod.DeleteDialog), { ssr: false });
const ReceptionPrintWrapper = dynamic(() => import("./ReceptionPrintWrapper"), { ssr: false });
const EditReception = dynamic(() => import("./ui/EditReception"), { ssr: false });

// Componente wrapper para las acciones de la grid
const GridActions = dynamic(() => 
  import("@mui/x-data-grid").then(mod => {
    const { GridActionsCellItem } = mod;
    return function GridActions({ row, onPrint, onEdit, onDelete }: GridActionsProps) {
      return [
        <GridActionsCellItem
          key="print"
          icon={<Print />}
          label="Imprimir"
          onClick={() => onPrint(row)}
          showInMenu
        />,
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Editar"
          onClick={() => onEdit(row)}
          showInMenu
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Delete />}
          label="Eliminar"
          onClick={() => onDelete(row)}
          showInMenu
        />
      ];
    };
  }),
  { ssr: false }
);

export default function ReceptionListPage() {
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [rowData, setRowData] = useState<ReceptionListItem | null>(null);
  const [receptions, setReceptions] = useState<ReceptionListItem[]>([]);
  const { showAlert } = useAlertContext();

  const fetchData = useCallback(async () => {
    try {
      const data = await getAllReceptions();
      console.log("Datos recibidos en el grid:", data);
      // Los datos ya vienen como ReceptionListItem[] desde getAllReceptions
      setReceptions(data);
    } catch (error) {
      console.error("Error al cargar recepciones:", error);
      showAlert("Error al cargar las recepciones", "error");
    }
  }, [showAlert]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    { 
      field: "id", 
      headerName: "Nº", 
      flex: 0.3, // Números cortos: 1-999
      type: "number",
      valueFormatter: (params: any) => {
        const value = params?.value ?? params;
        if (value === undefined || value === null) return '';
        return String(value);
      }
    },
    { 
      field: "riceType", 
      headerName: "Tipo de arroz", 
      flex: 0.9 // Nombres medianos: "Arroz Grado 1"
    },
    { 
      field: "producer", 
      headerName: "Productor", 
      flex: 1.8 // Nombres largos: "Juan Pérez González"
    },
    { 
      field: "guide", 
      headerName: "Guía", 
      flex: 0.8 // Códigos: "G-12345-2025"
    },
    { 
      field: "licensePlate", 
      headerName: "Patente", 
      flex: 0.7 // Patentes: "AB-1234"
    },
    {
      field: "price",
      headerName: "Precio",
      type: "number",
      flex: 0.68, // Precios: "$25.000" (reducido en 15%)
      valueFormatter: (params: any) => {
        const value = params?.value ?? params;
        if (value === undefined || value === null || value === '') return '$0';
        const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
        if (isNaN(numValue)) return '$0';
        return numValue.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
      },
    },
    {
      field: "grossWeight",
      headerName: "Bruto (kg)",
      type: "number",
      flex: 0.75, // Pesos: "1.234,56"
      valueFormatter: (params: any) => {
        const value = params?.value ?? params;
        if (value === undefined || value === null || value === '') return '0.00';
        const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
        if (isNaN(numValue)) return '0.00';
        return numValue.toLocaleString("es-CL", { minimumFractionDigits: 2 });
      },
    },
    {
      field: "tare",
      headerName: "Tara (kg)",
      type: "number",
      flex: 0.72, // Tara más pequeña: "50,00" (reducido en 10%)
      valueFormatter: (params: any) => {
        const value = params?.value ?? params;
        if (value === undefined || value === null || value === '') return '0.00';
        const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
        if (isNaN(numValue)) return '0.00';
        return numValue.toLocaleString("es-CL", { minimumFractionDigits: 2 });
      },
    },
    {
      field: "netWeight",
      headerName: "Neto (kg)",
      type: "number",
      flex: 0.81, // Peso neto: "1.184,56" (reducido en 10%)
      valueFormatter: (params: any) => {
        const value = params?.value ?? params;
        if (value === undefined || value === null || value === '') return '0.00';
        const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
        if (isNaN(numValue)) return '0.00';
        return numValue.toLocaleString("es-CL", { minimumFractionDigits: 2 });
      },
    },
    {
      field: "totalConDescuentos",
      headerName: "Descuentos (kg)",
      type: "number",
      flex: 1.0, // Descuentos: "123,45"
      valueFormatter: (params: any) => {
        const value = params?.value ?? params;
        if (value === undefined || value === null || value === '') return '0.00';
        const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
        if (isNaN(numValue)) return '0.00';
        return numValue.toLocaleString("es-CL", { minimumFractionDigits: 2 });
      },
    },
    {
      field: "paddyNeto",
      headerName: "Paddy Neto (kg)",
      type: "number",
      flex: 0.94, // Paddy neto: "1.061,11" (reducido en 15%)
      valueFormatter: (params: any) => {
        const value = params?.value ?? params;
        if (value === undefined || value === null || value === '') return '0.00';
        const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
        if (isNaN(numValue)) return '0.00';
        return numValue.toLocaleString("es-CL", { minimumFractionDigits: 2 });
      },
    },
    {
      field: "createdAt",
      headerName: "Fecha",
      type: "dateTime",
      flex: 1.1, // Fechas: "02-07-2025 14:30" (reducido en 15%)
      valueFormatter: (params: any) => {
        const value = params?.value ?? params;
        if (!value) return 'Sin fecha';
        try {
          return moment(value).tz("America/Santiago").format("DD-MM-YYYY HH:mm");
        } catch (error) {
          return 'Fecha inválida';
        }
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      flex: 0.8,
      getActions: (params: { row: ReceptionListItem }) => [
        <GridActions
          key="actions"
          row={params.row}
          onPrint={(row: ReceptionListItem) => {
            setRowData(row);
            setOpenPrintDialog(true);
          }}
          onEdit={(row: ReceptionListItem) => {
            setRowData(row);
            console.log("Datos de la fila seleccionada:", row);
            setOpenEditDialog(true);
          }}
          onDelete={(row: ReceptionListItem) => {
            setRowData(row);
            setOpenDeleteDialog(true);
          }}
        />,
      ],
    },
  ];

  return (
    <>
      <Box p={2}>
        <AppDataGrid
          title="Recepciones"
          rows={receptions}
          columns={columns}
          height={"80vh"}
          refresh={fetchData}
          className={styles.receptionsGrid}
        />
      </Box>

      <PrintDialog
        open={openPrintDialog}
        setOpen={setOpenPrintDialog}
        title={`Recepción Nº${rowData?.id || ''}`}
        dialogWidth="md"
      >
        <ReceptionPrintWrapper receptionId={(rowData?.id || 0).toString()} />
      </PrintDialog>

      <DeleteDialog
        open={openDeleteDialog}
        message={`¿Estás seguro de eliminar la recepción Nº ${rowData?.id || ''}`}
        onClose={() => {
          setOpenDeleteDialog(false);
          setRowData(null);
        }}
        submit={async () => {
          if (!rowData?.id) {
            showAlert("Error: ID de recepción no válido", "error");
            return;
          }
          try {
            await deleteReception(rowData.id);
            showAlert("Recepción eliminada correctamente", "success");
            fetchData();
          } catch (error) {
            showAlert("Error al eliminar la recepción", "error");
          } finally {
            setOpenDeleteDialog(false);
            setRowData(null);
          }
        }}
      />

      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setRowData(null);
        }}
        fullWidth
        maxWidth="lg"
      >
        <Box sx={{ p: 2 }}>
          {rowData?.id && (
            <EditReception
              receptionId={rowData.id}
              onClose={() => {
                setOpenEditDialog(false);
                setRowData(null);
              }}
              afterUpdate={fetchData}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
}
