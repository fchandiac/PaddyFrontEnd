/**
 * Utilitarios para ayudar con los tests de rangos de secado
 */

// Constante que define el código de descuento para rangos de secado
export const DRYING_DISCOUNT_CODE = 8; // El código estándar para los rangos de secado

/**
 * Verifica si un rango propuesto se solapa con algún rango existente
 * @param proposed El rango propuesto para verificar
 * @param existingRanges Array de rangos existentes para comparar
 * @returns true si hay solapamiento, false si no hay solapamiento
 */
export function rangeOverlaps(
  proposed: { start: number; end: number; },
  existingRanges: Array<{ start: number; end: number; }>
): boolean {
  return existingRanges.some(existing => 
    (proposed.start <= existing.end && proposed.end >= existing.start)
  );
}

/**
 * Encuentra un rango disponible que no se solape con los rangos existentes
 * @param existingRanges Array de rangos existentes
 * @param step Tamaño del rango a encontrar
 * @returns Un rango disponible que no se solapa
 */
export function findAvailableRange(
  existingRanges: Array<{ start: number; end: number; }>,
  step: number = 5
): { start: number; end: number; percent: number; } {
  // Ordenar los rangos existentes por el valor de inicio
  const sortedRanges = [...existingRanges].sort((a, b) => a.start - b.start);
  
  // Comenzar con un rango desde 0
  let candidate = { start: 0, end: step };
  
  // Incrementar hasta encontrar un rango disponible
  while (rangeOverlaps(candidate, sortedRanges)) {
    candidate.start += step;
    candidate.end += step;
    
    // Prevenir bucle infinito estableciendo un límite
    if (candidate.start > 100) {
      // Si llegamos a 100, intentar con valores más pequeños
      step = Math.max(1, step / 2);
      candidate = { start: 0, end: step };
    }
  }
  
  // Asignar un porcentaje aleatorio entre 1 y 20
  const percent = Math.floor(Math.random() * 20) + 1;
  
  return {
    ...candidate,
    percent
  };
}

/**
 * Genera un array de rangos de prueba que no se solapan
 * @param count Número de rangos a generar
 * @param existingRanges Rangos existentes para evitar solapamientos
 * @returns Array de rangos de prueba
 */
export function generateTestRanges(
  count: number,
  existingRanges: Array<{ start: number; end: number; }> = []
): Array<{ start: number; end: number; percent: number; }> {
  const result = [];
  
  for (let i = 0; i < count; i++) {
    const newRange = findAvailableRange([...existingRanges, ...result]);
    result.push(newRange);
  }
  
  return result;
}
