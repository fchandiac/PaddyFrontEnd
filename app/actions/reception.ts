"use server";

import {
  CreateReceptionPayload,
  UpdateReceptionPayload,
  Reception,
  FindReceptionByIdType,
  ReceptionListItem,
  ReceptionStatus,
  ReceptionHistory
} from "@/types/reception";
import { createRecord } from "./record"; // importa desde donde esté
import { auth } from "../../auth";
import { cookies } from 'next/headers';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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
    console.warn('No se encontró token JWT en la sesión para recepciones');
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

// Función utilitaria para transformar datos del backend al formato del frontend
function transformReceptionData(item: any): ReceptionListItem {
  // Función auxiliar para convertir valores a números seguros
  const safeNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(num) ? 0 : num;
  };

  return {
    id: safeNumber(item.id),
    producer: item.producer?.name || 'Sin productor',
    riceType: item.riceType?.name || 'Sin tipo',
    price: safeNumber(item.price),
    grossWeight: safeNumber(item.grossWeight),
    tare: safeNumber(item.tare),
    netWeight: safeNumber(item.netWeight),
    guide: item.guide || '',
    licensePlate: item.licensePlate || '',
    createdAt: item.createdAt || new Date().toISOString(),
    totalConDescuentos: safeNumber(item.totalDiscount), // Backend: totalDiscount
    paddyNeto: safeNumber(item.paddyNet), // Backend: paddyNet
    status: item.status || 'pending',
  };
}

export async function getAllReceptions(): Promise<ReceptionListItem[]> {
  try {
    const url = `${backendUrl}/receptions`;
    const headers = await getAuthHeaders();
    
    const res = await fetch(url, { 
      cache: "no-store",
      headers,
    });
    
    if (!res.ok) {
      throw new Error(`Error al obtener recepciones: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    
    if (!Array.isArray(data)) {
      return [];
    }
    
    console.log("Datos crudos del backend:", data[0]); // Log datos originales
    
    // Mapear datos del backend a formato esperado por el frontend
    const transformedData: ReceptionListItem[] = data.map(transformReceptionData);
    
    console.log("Datos transformados:", transformedData[0]); // Log datos transformados
    
    return transformedData;
  } catch (error) {
    console.error('Error en getAllReceptions:', error);
    return [];
  }
}

export async function getReceptionById(id: number): Promise<Reception> {
  const res = await fetch(`${backendUrl}/receptions/${id}`);
  if (!res.ok) throw new Error("Error al obtener la recepción");
  return res.json();
}

export async function getReceptionByIdToLoad(id: number): Promise<FindReceptionByIdType> {
  const res = await fetch(`${backendUrl}/receptions/${id}`);
  if (!res.ok) throw new Error("Error al obtener la recepción");
  return res.json();
}

export async function createReception(data: CreateReceptionPayload): Promise<Reception> {
  try {
    // Obtener la sesión del usuario autenticado
    const session = await auth();
    const cookieStore = cookies();
    
    // Validar que la URL del backend esté definida
    if (!backendUrl) {
      throw new Error('URL del backend no configurada. Verifique sus variables de entorno.');
    }
    
    console.log('🔐 DEBUG - Intentando crear recepción con payload:', data);
    console.log('🔐 DEBUG - Sesión de usuario:', session?.user);
    
    // Obtener todas las cookies de NextAuth
    const nextAuthCookies = Array.from(cookieStore.getAll())
      .filter(cookie => cookie.name.includes('next-auth') || cookie.name.includes('authjs'))
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
    
    console.log('🍪 DEBUG - Cookies de autenticación:', nextAuthCookies);
    
    // Crear headers con cookies de autenticación
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Agregar cookies si las hay
    if (nextAuthCookies) {
      headers['Cookie'] = nextAuthCookies;
    }
    
    // Agregar headers personalizados explícitos para el backend
    if (session?.user) {
      headers['X-User-Email'] = session.user.email || '';
      headers['X-User-ID'] = String((session.user as any)?.id || '');
      headers['X-Created-By'] = (session.user as any)?.name || session.user.email || 'Usuario autenticado';
      
      console.log('📧 DEBUG - Headers de usuario agregados:', {
        'X-User-Email': headers['X-User-Email'],
        'X-User-ID': headers['X-User-ID'],
        'X-Created-By': headers['X-Created-By']
      });
    }
    
    // Crear query parameters para información del usuario (por si el backend los necesita)
    const queryParams = new URLSearchParams();
    
    if (session?.user) {
      // Usar el nombre del usuario o email como identificador
      const userIdentifier = (session.user as any)?.name || session.user.email || 'Usuario autenticado';
      queryParams.append('createdBy', userIdentifier);
      
      // También agregar el userId si está disponible
      if ((session.user as any)?.id) {
        queryParams.append('userId', String((session.user as any).id));
      }
      
      console.log('🔐 DEBUG - Usuario identificado como:', userIdentifier);
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    // Realizar la petición al backend
    const res = await fetch(`${backendUrl}/receptions${queryString}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    // Si la respuesta no es exitosa, intentar obtener un mensaje de error detallado
    if (!res.ok) {
      let errorMessage = 'Error al crear recepción';
      
      // Intentar obtener el mensaje de error del cuerpo de la respuesta
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
      } catch (e) {
        // Si no podemos parsear la respuesta como JSON, usar el status text
        errorMessage = `${errorMessage}: ${res.statusText} (${res.status})`;
      }
      
      throw new Error(errorMessage);
    }
    
    // Parsear y retornar la respuesta exitosa
    return res.json();
  } catch (error) {
    console.error('Error en createReception:', error);
    throw error; // Re-lanzar el error para que pueda ser manejado por el componente
  }
}


export async function updateReception(
  id: number,
  data: UpdateReceptionPayload,
  reason?: string,
  changedBy?: string
): Promise<Reception> {
  try {
    // Obtener la sesión del usuario autenticado
    const session = await auth();
    
    console.log('🔐 DEBUG - Actualizando recepción:', id, 'con datos:', data);
    console.log('🔐 DEBUG - Sesión de usuario:', session?.user);

    // Usar el usuario autenticado si no se proporciona changedBy
    let finalChangedBy = changedBy;
    
    if (!finalChangedBy && session?.user) {
      finalChangedBy = (session.user as any)?.name || session.user.email || 'Usuario autenticado';
      console.log('🔐 DEBUG - Usando usuario autenticado como changedBy:', finalChangedBy);
    }

    // Crear parámetros de consulta para razón de cambio
    const queryParams = new URLSearchParams();
    if (reason) queryParams.append('reason', reason);
    if (finalChangedBy) queryParams.append('changedBy', finalChangedBy);
    
    // También agregar userId si está disponible
    if (session?.user && (session.user as any)?.id) {
      queryParams.append('userId', String((session.user as any).id));
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const res = await fetch(`${backendUrl}/receptions/${id}${queryString}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al actualizar recepción");
    }
    
    return res.json();
  } catch (error) {
    console.error('Error en updateReception:', error);
    throw error;
  }
}

export async function deleteReception(
  id: number
): Promise<{ message: string }> {
  const res = await fetch(`${backendUrl}/receptions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar recepción");
  return res.json();
}

// Extras útiles
export async function getReceptionsByProducer(
  producerId: number
): Promise<Reception[]> {
  const res = await fetch(`${backendUrl}/receptions/producer/${producerId}`);
  if (!res.ok) throw new Error("Error al obtener recepciones por productor");
  return res.json();
}

export async function getPendingReceptionsByProducer(
  producerId: number
): Promise<Reception[]> {
  const res = await fetch(
    `${backendUrl}/receptions/producer/${producerId}/pending`
  );
  if (!res.ok) throw new Error("Error al obtener recepciones pendientes");
  return res.json();
}

export const getReceptionResumen = async (): Promise<ReceptionListItem[]> => {
  try {
    // Usar el endpoint correcto que existe en el backend
    console.log("Obteniendo resumen de recepciones desde:", `${backendUrl}/receptions`);
    
    const res = await fetch(`${backendUrl}/receptions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Error en la respuesta de la API:", res.status, res.statusText);
      throw new Error(`Error al obtener el resumen de recepciones: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log("Datos recibidos correctamente:", Array.isArray(data) ? `Array con ${data.length} elementos` : typeof data);
    
    if (!Array.isArray(data)) {
      console.error("La respuesta de la API no es un array:", data);
      return [];
    }
    
    if (data.length === 0) {
      console.warn("La API devolvió un array vacío");
      return [];
    }

    // Usar la misma transformación que getAllReceptions para consistencia
    const transformedData: ReceptionListItem[] = data.map(transformReceptionData);
    
    return transformedData;
  } catch (error) {
    console.error("❌ Error en getReceptionResumen:", error);
    return [];
  }
};

export async function getReceptionHistory(id: number): Promise<{
  id: number;
  currentData: Partial<Reception>;
  history: ReceptionHistory;
}> {
  try {
    const url = `${backendUrl}/receptions/${id}/history`;
    
    const res = await fetch(url, { 
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!res.ok) {
      throw new Error(`Error al obtener historial de recepción: ${res.status} ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error en getReceptionHistory:', error);
    throw error;
  }
}
