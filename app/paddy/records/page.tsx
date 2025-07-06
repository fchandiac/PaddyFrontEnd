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
  Info as InfoIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import AppDataGrid from "@/components/appDataGrid";
import { getAuditLogs } from "@/app/actions/audit";
import { 
  AuditLog, 
  AuditFilterDto, 
  AUDIT_ACTION_LABELS, 
  AUDIT_ENTITY_LABELS, 
  AUDIT_ACTION_COLORS,
  AuditAction,
  AuditEntityType,
  isValidDisplayValue
} from "@/types/audit";
import moment from "moment-timezone";

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Array<{id: number, name: string, email: string}>>([]);
  
  // Modal de detalles
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  
  // Filtros
  const [filters, setFilters] = useState<AuditFilterDto>({
    limit: 1000, // Obtener más registros para paginación local
  });

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const result = await getAuditLogs(filters);
      setAuditLogs(result.data || []);
      console.log("Logs de auditoría obtenidos:", result);
    } catch (error) {
      console.error("Error al obtener los logs de auditoría:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Obtener usuarios únicos de los logs de auditoría
      const result = await getAuditLogs({ limit: 10000 });
      const uniqueUsers = new Map();
      
      result.data?.forEach((log: AuditLog) => {
        if (log.user && log.userId) {
          uniqueUsers.set(log.userId, {
            id: log.userId,
            name: log.user.name,
            email: log.user.email
          });
        }
      });
      
      setUsers(Array.from(uniqueUsers.values()));
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFilterChange = (field: keyof AuditFilterDto, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      limit: 1000,
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
                  {isValidDisplayValue(selectedLog.ipAddress) && (
                    <ListItem>
                      <ListItemText
                        primary="IP Address"
                        secondary={selectedLog.ipAddress}
                      />
                    </ListItem>
                  )}
                  {isValidDisplayValue(selectedLog.userAgent) && (
                    <ListItem>
                      <ListItemText
                        primary="User Agent"
                        secondary={selectedLog.userAgent}
                      />
                    </ListItem>
                  )}
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Registros de Auditoría
      </Typography>
      
      <Grid container spacing={2} sx={{ 
        height: { xs: 'auto', sm: '80vh' },
        minHeight: { xs: '80vh', sm: '80vh' }
      }}>
        {/* Panel de filtros - Columna izquierda */}
        <Grid item xs={12} sm={3} md={2}>
          <Paper variant="outlined" elevation={0} sx={{ 
            p: 2, 
            height: { xs: 'auto', sm: '100%' }, 
            overflow: 'auto',
            minHeight: { xs: '200px', sm: '100%' }
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 1,
              mb: 2
            }}>
              Filtros
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Filtro por acción */}
              <FormControl fullWidth size="small">
                <InputLabel>Acción</InputLabel>
                <Select
                  value={filters.action || ''}
                  label="Acción"
                  onChange={(e) => handleFilterChange('action', e.target.value || undefined)}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {Object.entries(AUDIT_ACTION_LABELS).map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Filtro por entidad */}
              <FormControl fullWidth size="small">
                <InputLabel>Entidad</InputLabel>
                <Select
                  value={filters.entityType || ''}
                  label="Entidad"
                  onChange={(e) => handleFilterChange('entityType', e.target.value || undefined)}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {Object.entries(AUDIT_ENTITY_LABELS).map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Filtro por usuario */}
              <FormControl fullWidth size="small">
                <InputLabel>Usuario</InputLabel>
                <Select
                  value={filters.userId || ''}
                  label="Usuario"
                  onChange={(e) => handleFilterChange('userId', e.target.value || undefined)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Filtros de fecha */}
              <Typography variant="subtitle2" color="textSecondary">
                Rango de Fechas
              </Typography>
              
              <TextField
                fullWidth
                size="small"
                label="Fecha Inicial"
                type="date"
                value={filters.startDate ? new Date(filters.startDate).toISOString().slice(0, 10) : ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                size="small"
                label="Fecha Final"
                type="date"
                value={filters.endDate ? new Date(filters.endDate).toISOString().slice(0, 10) : ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
                InputLabelProps={{ shrink: true }}
              />

              {/* Botones de acción */}
              <Box display="flex" flexDirection="column" gap={1} sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={fetchAuditLogs}
                  startIcon={<FilterIcon />}
                  fullWidth
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Aplicando...' : 'Aplicar Filtros'}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearFilters}
                  startIcon={<RefreshIcon />}
                  fullWidth
                  color="secondary"
                >
                  Limpiar Filtros
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Grid de datos - Columna principal */}
        <Grid item xs={12} sm={9} md={10}>
          <Paper variant="outlined" elevation={0} sx={{ 
            height: { xs: '60vh', sm: '100%' },
            minHeight: '400px',
            borderColor: 'rgba(0, 0, 0, 0.23)', // Color de borde igual a TextField
          }}>
            <AppDataGrid
              rows={auditLogs}
              title=""
              height="100%"
              columns={[
                { 
                  field: "id", 
                  headerName: "ID", 
                  width: 80,
                  valueFormatter: (params: any) => params
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
                  valueFormatter: (params: any) => params || '-'
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
                  headerName: "",
                  width: 100,
                  renderCell: (params: any) => renderDetailsButton(params.row),
                  sortable: false,
                  filterable: false,
                },
              ]}
              refresh={fetchAuditLogs}
            />
          </Paper>
        </Grid>
      </Grid>
      
      {/* Modal de detalles */}
      {renderDetailsModal()}
    </Box>
  );
}
