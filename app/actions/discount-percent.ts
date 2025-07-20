"use server";

import { CreateDiscountPercentDto, UpdateDiscountPercentDto } from "@/types/discount-percent";
import { auth } from "../../auth";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

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
    console.warn('No se encontró token JWT en la sesión para discount-percent');
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

// 🟢 Obtener todos
export async function getAllDiscountPercents(): Promise<any[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${backendUrl}/discounts-percent`, { headers });
    if (!res.ok) throw new Error('Error al obtener porcentajes de descuento');
    return res.json();
  } catch (error) {
    console.error('Error al obtener porcentajes de descuento:', error);
    return [];
  }
}

// 🔍 Obtener por código
export async function getDiscountPercentsByCode(code: number): Promise<any[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${backendUrl}/discounts-percent/code/${code}`, {
      cache: 'no-store', // Deshabilitar el caché para asegurar datos frescos
      headers
    });
    
    if (!res.ok) {
      throw new Error(`Error al obtener porcentajes de descuento para el código ${code}`);
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error al obtener porcentajes de descuento para el código ${code}:`, error);
    return [];
  }
}

// 🔍 Obtener por ID
export async function getDiscountPercentById(id: number): Promise<any> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${backendUrl}/discounts-percent/${id}`, { headers });
  return res.json();
}

// ➕ Crear
export async function createDiscountPercent(data: CreateDiscountPercentDto, userId?: number): Promise<any> {
  try {
    const headers = await getAuthHeaders();
    
    // Filtrar userId del payload ya que va en los headers JWT
    const { userId: _, ...payload } = { ...data, userId };

    const res = await fetch(`${backendUrl}/discounts-percent`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        error: true,
        message: result.message || "Error al crear rango",
      };
    }

    return result;
  } catch (err) {
    return { error: true, message: "Error de red o del servidor" };
  }
}

// ✏️ Actualizar
export async function updateDiscountPercent(id: number, data: UpdateDiscountPercentDto, userId?: number): Promise<any> {
  try {
    const headers = await getAuthHeaders();
    
    // Filtrar userId del payload ya que va en los headers JWT
    const { userId: _, ...payload } = { ...data, userId };

    const res = await fetch(`${backendUrl}/discounts-percent/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        error: true,
        message: result.message || "Error al actualizar rango",
      };
    }

    return result;
  } catch (err) {
    return { error: true, message: "Error de red o del servidor" };
  }
}


// 🗑️ Eliminar
export async function deleteDiscountPercent(id: number, userId?: number): Promise<void> {
  const headers = await getAuthHeaders();
  
  await fetch(`${backendUrl}/discounts-percent/${id}`, {
    method: "DELETE",
    headers,
  });
}
