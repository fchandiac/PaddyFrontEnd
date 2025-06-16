"use client";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Divider,
  Dialog,
  Stack,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArticleIcon from "@mui/icons-material/Article";
import { useAlertContext } from "@/context/AlertContext";
import { createReception } from "@/app/actions/reception";
import ReceptionGeneralData from "./ui/ReceptionGeneralData";
import GrainAnalysis from "./ui/GrainAnalysis";
import { useReceptionContext } from "@/context/ReceptionDataContext";
import { CreateReceptionPayload } from "@/types/reception";
import { useUserContext } from "@/context/UserContext";
import { getDefaultTemplate } from "@/app/actions/discount-template";
import { TemplateType } from "@/types/discount-template";
import SelectTemplate from "./ui/template/SelectTemplate";
import TemplateComponent from "./ui/template/Template";

export default function NewReceptionPage() {
  const { showAlert } = useAlertContext();
  const { data, liveClusters, setTemplate } = useReceptionContext();
  const { user } = useUserContext();

  const [loadingTemplate, setLoadingTemplate] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  // dialog state
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [openSaveTemplateDialog, setOpenSaveTemplateDialog] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoadingTemplate(true);
      const template = await getDefaultTemplate();
      if (template) {
        setTemplate(template);
      } else {
        showAlert("No se encontró la plantilla por defecto", "error");
      }
      setLoadingTemplate(false);
    };
    fetchTemplate();
  }, [setTemplate]);

  const handleSave = async () => {
    console.log("data", data);
    // guardar recepción...
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { key, code } = e;
    if (key === "Enter") {
      e.preventDefault();
      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          "input:not([readonly]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])"
        )
      ).filter(
        (el) =>
          el.offsetParent !== null &&
          getComputedStyle(el).visibility !== "hidden" && 
         el.getAttribute("aria-hidden") !== "true" &&
          !el.hasAttribute("data-skip-focus")
      

      );
      const idx = focusable.indexOf(e.target as HTMLElement);
      const next = focusable[idx + 1];
      if (next) next.focus();
      return;
    }
    if (code === "NumpadAdd") {
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON") {
        (target as HTMLButtonElement).click();
        return;
      }
      const form = target.closest("form");
      const defaultBtn =
        form?.querySelector('button[type="submit"]') ||
        document.querySelector("button[data-default-action]");
      if (defaultBtn instanceof HTMLButtonElement) defaultBtn.click();
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }} onKeyDown={handleKeyDown}>
        <Grid container spacing={2} >
          {/* General Data */}
          <Grid item xs={12} md={2.5}>
            <Typography gutterBottom>Datos de la recepción</Typography>
            <ReceptionGeneralData />
          </Grid>

          {/* Grain Analysis */}
          <Grid item xs={12} md={6.5}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography gutterBottom>Análisis de granos</Typography>
              <Typography gutterBottom>{data.template.name}</Typography>
            </Box>

            <GrainAnalysis
            // template={data.template}
            // loadingTemplate={loadingTemplate}
            />
          </Grid>

          {/* Summary & Actions */}
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>Totales</Typography>

            {/* Box resumen con borde redondeado y valores */}
            <Box sx={{
              border: '1px solid #1976d2',
              borderRadius: 2,
              p: 2,
              mb: 2,
              background: '#f7fafd',
            }}>
              <Box component="dl" sx={{ m: 0 }}>
                <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box component="dt">Peso Bruto</Box>
                  <Box component="dd">{liveClusters.grossWeight.node.value}</Box>
                </Box>
                <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box component="dt">Tara</Box>
                  <Box component="dd">{liveClusters.tare.node.value}</Box>
                </Box>
                <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box component="dt">Peso Neto</Box>
                  <Box component="dd">{liveClusters.netWeight.node.value}</Box>
                </Box>
                <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box component="dt">Total Descuentos</Box>
                  <Box component="dd">{liveClusters.DiscountTotal.node.value}</Box>
                </Box>
                <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box component="dt">Bonificación</Box>
                  <Box component="dd">{liveClusters.Bonus.tolerance ? liveClusters.Bonus.tolerance.value : '-'}</Box>
                </Box>
                <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box component="dt">Paddy Neto</Box>
                  <Box component="dd">{liveClusters.totalPaddy.node.value}</Box>
                </Box>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              // onClick={handleSave}
              // disabled={loadingSave}
            >
              {loadingSave ? (
                <CircularProgress size={24} />
              ) : (
                "Guardar recepción"
              )}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                onClick={() => {
                  setOpenSaveTemplateDialog(true);
                }}
              >
                <SaveIcon color="primary" />
              </IconButton>
              <Button
                variant="outlined"
                onClick={() => setOpenTemplateDialog(true)}
                startIcon={<ArticleIcon />}
              >
                Plantillas
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Dialog para seleccionar plantilla */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={openTemplateDialog}
        onClose={() => setOpenTemplateDialog(false)}
      >
        <Box sx={{ p: 2 }}>
          <SelectTemplate closeDialog={() => setOpenTemplateDialog(false)} />
        </Box>
      </Dialog>

      {/* Dialog para guardar plantilla */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={openSaveTemplateDialog}
        onClose={() => setOpenSaveTemplateDialog(false)}
      >
        <Box sx={{ p: 2 }}>
          <TemplateComponent
            closeDialog={() => setOpenSaveTemplateDialog(false)}
          />
        </Box>
      </Dialog>
    </>
  );
}
