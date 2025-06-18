"use client";

import { useEffect, useState } from "react";
import { getAllProducers, deleteProducer } from "@/app/actions/producer";
import { Producer as BaseProducer } from "@/types/producer";

interface Producer extends BaseProducer {
  bankAccounts: {
    bank: string;
    accountType: string;
    accountNumber: string;
    holderName: string;
  }[];
}

import AppDataGrid from "@/components/appDataGrid";
import { Box, Dialog, Badge } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { AccountBalance, Delete, Edit } from "@mui/icons-material";
import { useAlertContext } from "@/context/AlertContext";
import { DeleteDialog } from "@/components/deleteDialog/DeleteDialog";
import { CreateProducerForm } from "./ui/CreateProducerForm";
import { UpdateProducerForm } from "./ui/UpdateProducerForm";
import BankAccountsDialog from "./ui/BankAccountsDialog";
import { createRecord } from "@/app/actions/record";
import { useUserContext } from "@/context/UserContext";
import moment from "moment";

export default function ProducerPage() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [rowData, setRowData] = useState<Producer | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [OpenBankDialog, setOpenBankDialog] = useState(false);
  const { showAlert } = useAlertContext();
  const { user } = useUserContext();

  const fetchProducers = async () => {
    try {
      const res = await getAllProducers();
      console.log("Productores obtenidos:", res);
      setProducers(res);
    } catch (error) {
      console.error("Error al obtener productores:", error);
    }
  };

  useEffect(() => {
    fetchProducers();
  }, []);

  return (
    <>
      <Box sx={{ p: 2 }}>
        <AppDataGrid
          rows={producers}
          columns={[
            { field: "id", headerName: "ID", flex: 1 },
            { field: "name", headerName: "Nombre", flex: 1 },
            { field: "businessName", headerName: "Razón Social", flex: 1 },
            { field: "rut", headerName: "RUT", flex: 1 },
            { field: "phone", headerName: "Teléfono", flex: 1 },
            {
              field: "createdAt",
              headerName: "Fecha de creación",
              flex: 1,
              valueFormatter: (params: any) => {
                return moment(params)
                  .subtract(4, "hours")
                  .format("DD-MM-YYYY HH:mm");
              },
            },
            {
              field: "actions",
              type: "actions",
              headerName: "",
              flex: 1,
              getActions: (params: any) => [
                <GridActionsCellItem
                  icon={
                    <Badge
                      badgeContent={params.row.bankAccounts?.length || 0}
                      color={
                        (params.row.bankAccounts?.length || 0) === 0
                          ? "error"
                          : "success"
                      }
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}

                      sx={{ mb: 0.5 }}
                    >
                      <AccountBalance />
                    </Badge>
                  }
                  label="Cuentas bancarias"
                  onClick={() => {
                    setRowData(params.row);
                    setOpenBankDialog(true);
                  }}
                />,
                <GridActionsCellItem
                  icon={<Edit />}
                  label="Editar"
                  onClick={() => {
                    setRowData(params.row);
                    setOpenEditDialog(true);
                  }}
                />,
                <GridActionsCellItem
                  icon={<Delete />}
                  label="Eliminar"
                  onClick={() => {
                    setRowData(params.row);
                    setOpenDeleteDialog(true);
                  }}
                />,
              ],
            },
          ]}
          title="Productores"
          height="80vh"
          FormComponent={({ afterSubmit }) => (
            <CreateProducerForm
              afterSubmit={(newProducer) => {
                afterSubmit();
                setRowData(null);
              }}
            />
          )}
          refresh={fetchProducers}
        />
      </Box>

      <DeleteDialog
        open={openDeleteDialog}
        message={`¿Estás seguro de que deseas eliminar al productor "${rowData?.name}"?`}
        onClose={() => setOpenDeleteDialog(false)}
        submit={async () => {
          if (rowData) {
            try {
              await deleteProducer(rowData.id);
              await createRecord({
                userId: user?.id ?? null,
                entity: "productores",
                description: `Eliminó al productor ${rowData.name} (${rowData.rut})`,
              });
              showAlert("Productor eliminado correctamente", "success");
              fetchProducers();
            } catch (error) {
              showAlert("Error al eliminar productor", "error");
            } finally {
              setOpenDeleteDialog(false);
              setRowData(null);
            }
          }
        }}
      />

      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ p: 2 }}>
          <UpdateProducerForm
            initialData={rowData!}
            afterSubmit={() => {
              fetchProducers();
              setOpenEditDialog(false);
            }}
          />
        </Box>
      </Dialog>

      <BankAccountsDialog
        open={OpenBankDialog}
        onClose={() => {
          setOpenBankDialog(false);
        }}
        afterSubmit={() => {
          fetchProducers();
          setOpenBankDialog(false);
        }}
        producer={rowData ? { ...rowData, id: rowData.id.toString() } : null}
      />
    </>
  );
}
