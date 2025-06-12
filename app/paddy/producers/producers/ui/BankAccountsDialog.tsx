"use client";

import {
  Box,
  Dialog,
  DialogTitle,
  Typography,
  Autocomplete,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { useState } from "react";
import { bankOptions, accountBankTypes } from "@/types/producer";
import { useAlertContext } from "@/context/AlertContext";
import { addBankAccountToProducer } from "@/app/actions/producer";
import { after } from "node:test";

interface Producer {
  id: string;
  name: string;
  bankAccounts: {
    bank: string;
    accountType: string;
    accountNumber: string;
    holderName: string;
  }[];
}

interface Props {
  producer: Producer | null;
  afterSubmit: () => void;
  open: boolean;
  onClose: () => void;
}

export default function BankAccountsDialog({ producer, open, onClose, afterSubmit }: Props) {
  const { showAlert } = useAlertContext();
  const [bank, setBank] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [holderName, setHolderName] = useState("");


  const handleAddAccount = async () => {
    if (!bank || !accountType || !accountNumber || !holderName) {
      showAlert(
        "Completa todos los campos para agregar una cuenta.",
        "warning"
      );
      return;
    }

    if (!producer) {
      showAlert("No se puede agregar la cuenta porque el productor no está definido.", "error");
      return;
    }

    const result = await addBankAccountToProducer(Number(producer.id), {
      bank,
      accountNumber,
      accountType,
      holderName,
    });

    if (result?.error) {
      showAlert(result.message || "Error al agregar cuenta", "error");
      return;
    }

    showAlert("Cuenta bancaria agregada correctamente", "success");
    afterSubmit();
    onClose();
    setBank("");
    setAccountType("");
    setAccountNumber("");
    setHolderName("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box sx={{ p: 2 }}>
        <DialogTitle>
          Cuentas bancarias - {producer ? producer.name : "Desconocido"}
        </DialogTitle>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Autocomplete
              options={bankOptions.map((b) => b.name)}
              value={bank}
              onChange={(_, newValue) => setBank(newValue || "")}
              renderInput={(params) => (
                <TextField {...params} label="Banco" size="small" fullWidth />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Autocomplete
              options={accountBankTypes.map((a) => a.type)}
              value={accountType}
              onChange={(_, newValue) => setAccountType(newValue || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tipo de cuenta"
                  size="small"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Número de cuenta"
              size="small"
              fullWidth
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Titular"
              size="small"
              fullWidth
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} textAlign="right">
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleAddAccount}
            >
              Agregar cuenta
            </Button>
          </Grid>
        </Grid>

        <Stack spacing={2}>
          {producer?.bankAccounts?.map((acc, index) => (
            <Card key={index} variant="outlined">
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle2">{acc.bank}</Typography>
                  <Typography variant="body2">
                    <strong>{acc.accountType}</strong>: {acc.accountNumber} -{" "}
                    <strong>Titular: </strong>
                    {acc.holderName}
                  </Typography>
                </Box>
                <IconButton>
                  <Delete />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Dialog>
  );
}
