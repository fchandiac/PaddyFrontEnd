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
    
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al obtener los logs de auditoría");
    }

    return await res.json();
  } catch (error: any) {
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
    throw new Error(error.message || "Error inesperado al obtener las estadísticas");
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
