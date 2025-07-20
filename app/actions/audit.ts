"use server";

import { AuditFilterDto, AuditResponse, AuditStats } from "@/types/audit";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function getAuditLogs(filters: AuditFilterDto = {}): Promise<AuditResponse> {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const url = `${backendUrl}/audit?${params.toString()}`;
    console.log('[AUDIT] URL solicitada:', url);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const responseText = await res.text();
    console.log('[AUDIT] Respuesta cruda del backend:', responseText);
    if (!res.ok) {
      let error;
      try {
        error = JSON.parse(responseText);
      } catch {
        error = { message: responseText };
      }
      throw new Error(error.message || "Error al obtener los logs de auditoría");
    }
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('[AUDIT] Error al parsear la respuesta:', e);
      throw new Error('Respuesta inválida del backend');
    }
    return data;
  } catch (error: any) {
    console.error('[AUDIT] Error en getAuditLogs:', error);
    throw new Error(error.message || "Error inesperado al obtener los logs de auditoría");
  }
}

export async function getAuditStats(days: number = 30): Promise<AuditStats> {
  try {
    const res = await fetch(`${backendUrl}/audit/stats?days=${days}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al obtener las estadísticas de auditoría");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message || "Error inesperado al obtener las estadísticas de auditoría");
  }
}

// Función para crear logs de auditoría desde el frontend
export async function createAuditLog(logData: {
  userId?: number;
  action: string;
  entityType: string;
  entityId?: number;
  description: string;
  metadata?: any;
  oldValues?: any;
  newValues?: any;
  success?: boolean;
  errorMessage?: string;
}): Promise<void> {
  try {
    const res = await fetch(`${backendUrl}/audit/manual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al crear el log de auditoría");
    }
  } catch (error: any) {
    throw new Error(error.message || "Error inesperado al crear el log de auditoría");
  }
}

export async function getUserAuditLogs(userId: number, limit: number = 100) {
  try {
    const res = await fetch(`${backendUrl}/audit/user/${userId}?limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al obtener los logs del usuario");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message || "Error inesperado al obtener los logs del usuario");
  }
}

export async function getEntityAuditLogs(entityType: string, entityId: number) {
  try {
    const res = await fetch(`${backendUrl}/audit/entity/${entityType}/${entityId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al obtener los logs de la entidad");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message || "Error inesperado al obtener los logs de la entidad");
  }
}

export const cleanupInvalidAuditValues = async (): Promise<{ cleaned: number; message: string }> => {
  try {
    const response = await fetch(`${backendUrl}/audit/cleanup-invalid-values`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al limpiar valores inválidos: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al limpiar valores inválidos:', error);
    throw error;
  }
};
