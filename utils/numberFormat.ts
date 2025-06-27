"use strict";

/**
 * Redondea un número a dos decimales
 * @param value Número a redondear
 * @returns Número redondeado a dos decimales
 */
export const roundToTwoDecimals = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

/**
 * Formatea un número para mostrarlo con 2 decimales
 * @param value Número a formatear
 * @param includeLocale Si es true, usa toLocaleString para agregar separadores de miles
 * @returns String formateado con 2 decimales
 */
export const formatToTwoDecimals = (value: number, includeLocale = true): string => {
  const roundedValue = roundToTwoDecimals(value);
  
  if (includeLocale) {
    return roundedValue.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  
  // Formato con 2 decimales fijos sin separadores de miles
  return roundedValue.toFixed(2);
};

/**
 * Formatea un número para mostrarlo como porcentaje con 2 decimales
 * @param value Valor decimal (ej: 0.15 para 15%)
 * @returns String formateado como porcentaje con 2 decimales
 */
export const formatAsPercent = (value: number): string => {
  const percentage = value * 100;
  return formatToTwoDecimals(percentage) + ' %';
};
