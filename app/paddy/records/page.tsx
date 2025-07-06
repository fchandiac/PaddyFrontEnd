// TODO: Mejoras futuras para la sección de Registros de Auditoría
// 1. Modal/Drawer de detalles con visualización de oldValues/newValues
// 2. Exportación a CSV/Excel de los logs filtrados
// 3. Dashboard/resumen con estadísticas y gráficos
// 4. Alertas automáticas para acciones críticas
// 5. Filtro por usuario específico
// 6. Vista en tiempo real (WebSocket) para logs recientes
// 7. Búsqueda de texto libre en descripciones
// 8. Agrupación de logs por sesión de usuario
// 9. Marcadores de logs como "revisados" por el admin
// 10. Notificaciones push para eventos críticos

"use client";
import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  TextField,
  Button,
  Chip,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { 
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import AppDataGrid from "@/components/appDataGrid";
import { getAuditLogs } from "@/app/actions/audit";
import { 
  AuditLog, 
  AuditFilterDto, 
  AUDIT_ACTION_LABELS, 
  AUDIT_ENTITY_LABELS, 
  AUDIT_ACTION_COLORS,
  AuditAction,
  AuditEntityType
} from "@/types/audit";
import moment from "moment-timezone";

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  
  // Modal de detalles
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  
  // Filtros
  const [filters, setFilters] = useState<AuditFilterDto>({
    page: 1,
    limit: 50,
  });

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const result = await getAuditLogs(filters);
      setAuditLogs(result.data || []);
      setTotal(result.total || 0);
      console.log("Logs de auditoría obtenidos:", result);
    } catch (error) {
      console.error("Error al obtener los logs de auditoría:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [filters]);

  const handleFilterChange = (field: keyof AuditFilterDto, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1, // Reset page when filter changes
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 50,
    });
  };

  const renderActionChip = (action: AuditAction) => (
    <Chip
      label={AUDIT_ACTION_LABELS[action]}
      size="small"
      sx={{
        backgroundColor: AUDIT_ACTION_COLORS[action],
        color: 'white',
        fontWeight: 'bold',
      }}
    />
  );

  const renderSuccessChip = (success: boolean) => (
    <Chip
      label={success ? 'Éxito' : 'Error'}
      size="small"
      color={success ? 'success' : 'error'}
      variant="outlined"
    />
  );

  const handleDetailDialogOpen = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailsModalOpen(true);
  };

  const handleDetailDialogClose = () => {
    setDetailsModalOpen(false);
    setSelectedLog(null);
  };

  const renderDetailsButton = (row: AuditLog) => (
    <Tooltip title="Ver detalles">
      <IconButton
        size="small"
        onClick={() => {
          setSelectedLog(row);
          setDetailsModalOpen(true);
        }}
      >
        <InfoIcon />
      </IconButton>
    </Tooltip>
  );

  const renderDetailsModal = () => (
    <Dialog
      open={detailsModalOpen}
      onClose={() => setDetailsModalOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Detalles del Log #{selectedLog?.id}
          </Typography>
          <IconButton onClick={() => setDetailsModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {selectedLog && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Información General
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Acción"
                      secondary={renderActionChip(selectedLog.action)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Entidad"
                      secondary={AUDIT_ENTITY_LABELS[selectedLog.entityType]}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="ID Entidad"
                      secondary={selectedLog.entityId ? `#${selectedLog.entityId}` : 'N/A'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Usuario"
                      secondary={selectedLog.user?.name || 'Sistema'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Estado"
                      secondary={renderSuccessChip(selectedLog.success)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Fecha"
                      secondary={moment(selectedLog.createdAt)
                        .subtract(4, "hours")
                        .format("DD-MM-YYYY HH:mm:ss")}
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Información Técnica
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="IP Address"
                      secondary={selectedLog.ipAddress || 'N/A'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="User Agent"
                      secondary={selectedLog.userAgent || 'N/A'}
                    />
                  </ListItem>
                  {selectedLog.errorMessage && (
                    <ListItem>
                      <ListItemText
                        primary="Error"
                        secondary={selectedLog.errorMessage}
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Descripción
            </Typography>
            <Typography variant="body2" paragraph>
              {selectedLog.description}
            </Typography>
            
            {(selectedLog.oldValues || selectedLog.newValues) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  {selectedLog.oldValues && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Valores Anteriores
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fff3e0' }}>
                        <pre style={{ fontSize: '0.875rem', margin: 0, whiteSpace: 'pre-wrap' }}>
                          {JSON.stringify(selectedLog.oldValues, null, 2)}
                        </pre>
                      </Paper>
                    </Grid>
                  )}
                  
                  {selectedLog.newValues && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Valores Nuevos
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: '#e8f5e8' }}>
                        <pre style={{ fontSize: '0.875rem', margin: 0, whiteSpace: 'pre-wrap' }}>
                          {JSON.stringify(selectedLog.newValues, null, 2)}
                        </pre>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </>
            )}
            
            {selectedLog.metadata && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Metadatos
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <pre style={{ fontSize: '0.875rem', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </Paper>
              </>
            )}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={() => setDetailsModalOpen(false)}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Registros de Auditoría
      </Typography>
      
      {/* Filtros */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Filtros
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Acción</InputLabel>
                  <Select
                    value={filters.action || ''}
                    onChange={(e) => handleFilterChange('action', e.target.value || undefined)}
                    label="Acción"
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {Object.entries(AUDIT_ACTION_LABELS).map(([key, label]) => (
                      <MenuItem key={key} value={key}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Entidad</InputLabel>
                  <Select
                    value={filters.entityType || ''}
                    onChange={(e) => handleFilterChange('entityType', e.target.value || undefined)}
                    label="Entidad"
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {Object.entries(AUDIT_ENTITY_LABELS).map(([key, label]) => (
                      <MenuItem key={key} value={key}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha desde"
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha hasta"
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={clearFilters}
                  >
                    Limpiar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={fetchAuditLogs}
                    startIcon={<RefreshIcon />}
                  >
                    Actualizar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Grid de datos */}
      <Paper elevation={1} sx={{ height: '70vh' }}>
        <DataGrid
          rows={auditLogs}
          loading={loading}
          columns={[
            { 
              field: "id", 
              headerName: "ID", 
              width: 80,
              valueFormatter: (params: any) => `#${params}`
            },
            { 
              field: "action", 
              headerName: "Acción", 
              width: 120,
              renderCell: (params: any) => renderActionChip(params.value)
            },
            { 
              field: "entityType", 
              headerName: "Entidad", 
              width: 130,
              valueFormatter: (params: any) => AUDIT_ENTITY_LABELS[params as AuditEntityType] || params
            },
            { 
              field: "entityId", 
              headerName: "ID Entidad", 
              width: 100,
              valueFormatter: (params: any) => params ? `#${params}` : '-'
            },
            { 
              field: "user", 
              headerName: "Usuario", 
              width: 150,
              valueGetter: (params: any) => params?.name || 'Sistema'
            },
            { 
              field: "description", 
              headerName: "Descripción", 
              flex: 1,
              minWidth: 200
            },
            { 
              field: "success", 
              headerName: "Estado", 
              width: 100,
              renderCell: (params: any) => renderSuccessChip(params.value)
            },
            { 
              field: "ipAddress", 
              headerName: "IP", 
              width: 120,
              valueFormatter: (params: any) => params || '-'
            },
            {
              field: "createdAt",
              headerName: "Fecha",
              width: 150,
              valueFormatter: (params: any) => {
                return moment(params)
                  .subtract(4, "hours")
                  .format("DD-MM-YYYY HH:mm");
              },
            },
            {
              field: "actions",
              headerName: "Acciones",
              width: 100,
              renderCell: (params: any) => renderDetailsButton(params.row),
              sortable: false,
              filterable: false,
            },
          ]}
          paginationMode="server"
          rowCount={total}
          paginationModel={{
            page: page - 1,
            pageSize: limit,
          }}
          onPaginationModelChange={(model: any) => {
            const newPageNumber = model.page + 1;
            setPage(newPageNumber);
            handleFilterChange('page', newPageNumber);
          }}
          pageSizeOptions={[25, 50, 100]}
          disableRowSelectionOnClick
          localeText={{
            noRowsLabel: 'No hay registros de auditoría',
            toolbarFilters: 'Filtros',
            toolbarDensity: 'Densidad',
            toolbarColumns: 'Columnas',
            toolbarExport: 'Exportar',
          }}
        />
      </Paper>
      
      {/* Modal de detalles */}
      {renderDetailsModal()}
    </Box>
  );
}
