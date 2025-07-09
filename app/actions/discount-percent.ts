"use server";

import { CreateDiscountPercentDto, UpdateDiscountPercentDto } from "@/types/discount-percent";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// 🟢 Obtener todos
export async function getAllDiscountPercents(): Promise<any[]> {
  try {
    const res = await fetch(`${backendUrl}/discounts-percent`);
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
    const res = await fetch(`${backendUrl}/discounts-percent/code/${code}`, {
      cache: 'no-store' // Deshabilitar el caché para asegurar datos frescos
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
  const res = await fetch(`${backendUrl}/discounts-percent/${id}`);
  return res.json();
}

// ➕ Crear
export async function createDiscountPercent(data: CreateDiscountPercentDto, userId?: number): Promise<any> {
  try {
    const payload = {
      ...data,
      userId, // Incluir userId en el payload
    };

    const res = await fetch(`${backendUrl}/discounts-percent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    const payload = {
      ...data,
      userId, // Incluir userId en el payload
    };

    const res = await fetch(`${backendUrl}/discounts-percent/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
  await fetch(`${backendUrl}/discounts-percent/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
}
