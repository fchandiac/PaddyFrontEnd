"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Dialog } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Print, Delete, Edit } from "@mui/icons-material";
import AppDataGrid from "@/components/appDataGrid/AppDataGrid";
import { getAllReceptions, deleteReception } from "@/app/actions/reception";
import PrintDialog from "@/components/PrintDialog/PrintDialog";
import moment from "moment-timezone";
import { useAlertContext } from "@/context/AlertContext";
import { DeleteDialog } from "@/components/deleteDialog/DeleteDialog";
import ReceptionPrintWrapper from "./ReceptionPrintWrapper";
import styles from "./receptions-grid.module.css";

export default function ReceptionListPage() {
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [rowData, setRowData] = useState<any>(null);
  const [receptions, setReceptions] = useState<any[]>([]);
  const { showAlert } = useAlertContext();

  const fetchData = useCallback(async () => {
    try {
      const data = await getAllReceptions();
      setReceptions(data);
    } catch (error) {
      console.error("Error al cargar recepciones:", error);
      showAlert("Error al cargar las recepciones", "error");
    }
  }, [showAlert]);

  useEffect(() => {
    // Refresh data when dialogs close
    if (!openPrintDialog && !openEditDialog) {
      fetchData();
    }
  }, [openPrintDialog, openEditDialog, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    { 
      field: "id", 
      headerName: "Nº", 
      flex: 0.3, // Números cortos: 1-999
      type: "number"
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
      flex: 0.8, // Botones de acción (aumentado)
      getActions: (params: any) => [
        <GridActionsCellItem
          key="print"
          icon={<Print />}
          label="Imprimir"
          onClick={() => {
            setRowData(params.row);
            setOpenPrintDialog(true);
          }}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Editar"
          onClick={() => {
            setRowData(params.row);
            setOpenEditDialog(true);
          }}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Delete />}
          label="Eliminar"
          onClick={() => {
            setRowData(params.row);
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
        title={`Recepción Nº${rowData?.id}`}
        dialogWidth="md"
      >
        <ReceptionPrintWrapper receptionId={rowData?.id?.toString() || "0"} />
      </PrintDialog>

      <DeleteDialog
        open={openDeleteDialog}
        message={`¿Estás seguro de eliminar la recepción Nº ${rowData?.id}?`}
        onClose={() => setOpenDeleteDialog(false)}
        submit={async () => {
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
        maxWidth="xl"
      >
        <Box sx={{ p: 2 }}>
          {/* Aquí se implementará el componente de edición en el futuro */}
          <Typography variant="h6">Editar Recepción Nº{rowData?.id}</Typography>
        </Box>
      </Dialog>
    </>
  );
}
