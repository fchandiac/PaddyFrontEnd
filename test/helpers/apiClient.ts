import fetch from 'node-fetch';
import { TEST_CREDENTIALS } from '../data/credentials';
import { DRYING_DISCOUNT_CODE } from '../helpers/dryingRangeUtils';

// URL base del backend
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// Interfaces para tipar las respuestas
interface AuthResponse {
  access_token: string;
  [key: string]: any;
}

/**
 * Obtiene un token JWT para hacer llamadas directas al API
 * @returns Token JWT para autenticación
 */
export async function getJwtToken(): Promise<string> {
  try {
    const response = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_CREDENTIALS.email,
        password: TEST_CREDENTIALS.password
      })
    });

    if (!response.ok) {
      throw new Error(`Error de autenticación: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as AuthResponse;
    return data.access_token;
  } catch (error) {
    console.error('Error obteniendo token JWT:', error);
    throw error;
  }
}

/**
 * Obtiene los rangos de descuento por código desde el API
 * @param code Código de descuento
 * @returns Array de rangos de descuento
 */
export async function fetchDiscountPercentsByCode(code: number = DRYING_DISCOUNT_CODE): Promise<any[]> {
  try {
    // Obtener token JWT
    const token = await getJwtToken();

    // Configurar headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Request-Source': 'UI_AUTO'
    };

    // Hacer petición al API
    const response = await fetch(`${backendUrl}/discounts-percent/code/${code}`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`Error obteniendo rangos: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as any[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error obteniendo rangos para código ${code}:`, error);
    return [];
  }
}

// Interfaces para tipar las respuestas
interface ApiResponse {
  message?: string;
  error?: boolean;
  [key: string]: any;
}

/**
 * Crea un nuevo rango de descuento
 * @param data Datos del rango a crear
 * @returns Resultado de la creación
 */
export async function createDiscountPercentDirect(data: any): Promise<ApiResponse> {
  try {
    // Obtener token JWT
    const token = await getJwtToken();

    // Configurar headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Request-Source': 'UI_AUTO'
    };

    // Hacer petición al API
    const response = await fetch(`${backendUrl}/discounts-percent`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    const result = await response.json() as ApiResponse;

    if (!response.ok) {
      console.error('Error creando rango:', result);
      return {
        error: true,
        message: result.message || 'Error al crear rango'
      };
    }

    return result;
  } catch (error) {
    console.error('Error creando rango:', error);
    return { error: true, message: 'Error de conexión' };
  }
}

/**
 * Elimina un rango de descuento por ID
 * @param id ID del rango a eliminar
 * @returns Resultado de la eliminación
 */
export async function deleteDiscountPercentDirect(id: number): Promise<ApiResponse> {
  try {
    // Obtener token JWT
    const token = await getJwtToken();

    // Configurar headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Request-Source': 'UI_AUTO'
    };

    // Hacer petición al API
    const response = await fetch(`${backendUrl}/discounts-percent/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const result = await response.json() as ApiResponse;
      console.error('Error eliminando rango:', result);
      return {
        error: true,
        message: result.message || 'Error al eliminar rango'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error eliminando rango:', error);
    return { error: true, message: 'Error de conexión' };
  }
}
