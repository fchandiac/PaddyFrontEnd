// Tipos para el sistema de auditoría en frontend

export type AuditAction = 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'VIEW' 
  | 'EXPORT' 
  | 'IMPORT';

export type AuditEntityType = 
  | 'USER' 
  | 'PRODUCER' 
  | 'RECEPTION' 
  | 'RICE_TYPE' 
  | 'TEMPLATE' 
  | 'TRANSACTION' 
  | 'DISCOUNT_PERCENT'
  | 'SYSTEM';

export interface AuditLog {
  id: number;
  userId?: number;
  ipAddress?: string;
  userAgent?: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: number;
  description: string;
  metadata?: any;
  oldValues?: any;
  newValues?: any;
  success: boolean;
  errorMessage?: string;
  createdAt: string;
  
  // Relaciones
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AuditFilterDto {
  userId?: number;
  action?: AuditAction;
  entityType?: AuditEntityType;
  entityId?: number;
  startDate?: string;
  endDate?: string;
  success?: boolean;
  page?: number;
  limit?: number;
}

export interface AuditResponse {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

export interface AuditStats {
  totalActions: number;
  actionsByType: Record<AuditAction, number>;
  actionsByEntity: Record<AuditEntityType, number>;
  topUsers: Array<{ userId: number; userName: string; actionCount: number }>;
  recentActivity: AuditLog[];
}

// Labels en español para la UI
export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  LOGIN: 'Inicio de sesión',
  LOGOUT: 'Cierre de sesión',
  CREATE: 'Crear',
  UPDATE: 'Actualizar',
  DELETE: 'Eliminar',
  VIEW: 'Ver',
  EXPORT: 'Exportar',
  IMPORT: 'Importar',
};

export const AUDIT_ENTITY_LABELS: Record<AuditEntityType, string> = {
  USER: 'Usuario',
  PRODUCER: 'Productor',
  RECEPTION: 'Recepción',
  RICE_TYPE: 'Tipo de Arroz',
  TEMPLATE: 'Plantilla',
  TRANSACTION: 'Transacción',
  DISCOUNT_PERCENT: 'Rango de Descuento',
  SYSTEM: 'Sistema',
};

// Colores para las acciones
export const AUDIT_ACTION_COLORS: Record<AuditAction, string> = {
  LOGIN: '#4caf50',      // Verde
  LOGOUT: '#ff9800',     // Naranja
  CREATE: '#2196f3',     // Azul
  UPDATE: '#ff5722',     // Naranja oscuro
  DELETE: '#f44336',     // Rojo
  VIEW: '#9c27b0',       // Púrpura
  EXPORT: '#607d8b',     // Gris azul
  IMPORT: '#795548',     // Marrón
};
