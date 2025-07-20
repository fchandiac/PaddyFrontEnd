"use server";

import { auth } from "../../auth";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

import { CreateRiceTypeDto, UpdateRiceTypeDto } from "@/types/rice-type";

// Helper function para obtener headers autenticados
async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await auth();
  
  // Crear headers básicos
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Agregar token JWT si está disponible
  if (session?.user?.accessToken) {
    headers['Authorization'] = `Bearer ${session.user.accessToken}`;
  } else {
    console.warn('No se encontró token JWT en la sesión para rice-types');
  }
  
  // Agregar headers personalizados si hay sesión
  if (session?.user) {
    headers['X-User-Email'] = session.user.email || '';
    headers['X-User-ID'] = String(session.user.id || '');
  }

  // Marcar como consulta automática de UI para no generar auditoría
  headers['X-Request-Source'] = 'UI_AUTO';
  
  return headers;
}

// 🟢 Obtener todos los tipos de arroz
export async function getAllRiceTypes(): Promise<any[]> {
  try {
    const headers = await getAuthHeaders();
    
    const res = await fetch(`${backendUrl}/rice-types`, {
      cache: "no-store",
      headers,
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error obteniendo tipos de arroz:', errorText);
      throw new Error(`Error al obtener tipos de arroz: ${res.status} - ${errorText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error en getAllRiceTypes:', error);
    throw error;
  }
}

// 🟢 Crear tipo de arroz
export async function createRiceType(data: CreateRiceTypeDto & { userId?: number }): Promise<any> {
  const headers = await getAuthHeaders();
  
  const res = await fetch(`${backendUrl}/rice-types`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) return { error: true, message: result.message };
  return result;
}

// 🟢 Actualizar tipo de arroz
export async function updateRiceType(id: number, data: UpdateRiceTypeDto & { userId?: number }): Promise<any> {
  const headers = await getAuthHeaders();
  
  const res = await fetch(`${backendUrl}/rice-types/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) return { error: true, message: result.message };
  return result;
}

// 🟢 Eliminar tipo de arroz
export async function deleteRiceType(id: number, userId?: number): Promise<void> {
  const headers = await getAuthHeaders();
  const requestBody = userId ? { userId } : {};
  
  const res = await fetch(`${backendUrl}/rice-types/${id}`, {
    method: "DELETE",
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al eliminar tipo de arroz");
  }
}
