"use client";

import { useEffect, useState } from "react";
import { Box, Dialog, Typography } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Print, Delete, Edit } from "@mui/icons-material";
import AppDataGrid from "@/components/appDataGrid/AppDataGrid";
import { getReceptionResumen, deleteReception } from "@/app/actions/reception";
import PrintDialog from "@/components/PrintDialog/PrintDialog";
import moment from "moment-timezone";
import { useAlertContext } from "@/context/AlertContext";
import { DeleteDialog } from "@/components/deleteDialog/DeleteDialog";
import ReceptionPrintWrapper from "./ReceptionPrintWrapper";

export default function ReceptionListPage() {
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [rowData, setRowData] = useState<any>(null);
  const [receptions, setReceptions] = useState<any[]>([]);
  const { showAlert } = useAlertContext();
  const isPrintClosed = openPrintDialog === false;
  const isUpdateClosed = openEditDialog === false;

  useEffect(() => {
    // Refresh data when dialogs close
    if (!openPrintDialog && !openEditDialog) {
      fetchData();
    }
  }, [isPrintClosed, isUpdateClosed]);

  const fetchData = async () => {
    try {
      const data = await getReceptionResumen();
      setReceptions(data);
    } catch (error) {
      showAlert("Error al cargar las recepciones", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { field: "id", headerName: "Nº", width: 80 },
    { 
      field: "riceType", 
      headerName: "Tipo de arroz", 
      flex: 1,
      valueGetter: (params: any) => {
        // Handle both object and string formats
        if (typeof params.value === 'object' && params.value !== null) {
          return params.value.name;
        }
        return params.value;
      }
    },
    { 
      field: "producer", 
      headerName: "Productor", 
      flex: 1.5,
      valueGetter: (params: any) => {
        // Handle both object and string formats
        if (typeof params.value === 'object' && params.value !== null) {
          return params.value.name;
        }
        return params.value;
      }
    },
    { field: "guide", headerName: "Guía", flex: 1 },
    { field: "licensePlate", headerName: "Patente", flex: 1 },
    {
      field: "price",
      headerName: "Precio",
      type: "number",
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params || params.value === undefined || params.value === null) return '';
        const numValue = typeof params.value === 'string' ? parseFloat(params.value) : params.value;
        return numValue.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
      },
    },
    {
      field: "grossWeight",
      headerName: "Bruto (kg)",
      type: "number",
      width: 120,
      valueFormatter: (params: any) => {
        if (!params || params.value === undefined || params.value === null) return '';
        const numValue = typeof params.value === 'string' ? parseFloat(params.value) : params.value;
        return numValue.toLocaleString("es-CL", { minimumFractionDigits: 2 });
      },
    },
    {
      field: "netWeight",
      headerName: "Neto (kg)",
      type: "number",
      width: 120,
      valueFormatter: (params: any) => {
        if (!params || params.value === undefined || params.value === null) return '';
        const numValue = typeof params.value === 'string' ? parseFloat(params.value) : params.value;
        return numValue.toLocaleString("es-CL", { minimumFractionDigits: 2 });
      },
    },
    {
      field: "totalConDescuentos",
      headerName: "Total c/ desc.",
      type: "number",
      width: 140,
      valueFormatter: (params: any) => {
        if (!params || params.value === undefined || params.value === null) return '';
        const numValue = typeof params.value === 'string' ? parseFloat(params.value) : params.value;
        return numValue.toLocaleString("es-CL", { minimumFractionDigits: 2 });
      },
    },
    {
      field: "paddyNeto",
      headerName: "Paddy Neto",
      type: "number",
      width: 130,
      valueFormatter: (params: any) => {
        if (!params || params.value === undefined || params.value === null) return '';
        const numValue = typeof params.value === 'string' ? parseFloat(params.value) : params.value;
        return numValue.toLocaleString("es-CL", { minimumFractionDigits: 2 });
      },
    },
    {
      field: "createdAt",
      headerName: "Fecha",
      type: "dateTime",
      width: 180,
      valueFormatter: (params: any) => {
        if (!params || !params.value) return '';
        return moment(params.value).tz("America/Santiago").format("DD-MM-YYYY HH:mm");
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 100,
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
