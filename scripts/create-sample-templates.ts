/**
 * Script para crear 10 plantillas de ejemplo con diferentes combinaciones
 * de parámetros disponibles.
 * 
 * Ejecutar desde la carpeta raíz del proyecto:
 * npx ts-node --esm scripts/create-sample-templates.ts
 */

import { CreateTemplateType } from '../types/discount-template';

// Configuraciones base de plantillas con diferentes combinaciones
export const sampleTemplates: CreateTemplateType[] = [
  {
    name: "Plantilla Básica - Solo Humedad",
    useToleranceGroup: false,
    groupToleranceValue: 0,
    
    // Solo Humedad habilitado
    availableHumedad: true,
    percentHumedad: 14,
    toleranceHumedad: 1.5,
    showToleranceHumedad: true,
    groupToleranceHumedad: false,
    
    // Resto deshabilitado
    availableGranosVerdes: false,
    availableImpurezas: false,
    availableVano: false,
    availableHualcacho: false,
    availableGranosPelados: false,
    availableGranosYesosos: false,
    availableGranosManchados: false,
    availableBonificacion: false,
    availableSecado: false,
  },

  {
    name: "Plantilla Completa - Todos los Parámetros",
    useToleranceGroup: false,
    groupToleranceValue: 0,
    
    // Todos los parámetros habilitados con valores típicos
    availableHumedad: true,
    percentHumedad: 14,
    toleranceHumedad: 1.5,
    showToleranceHumedad: true,
    groupToleranceHumedad: false,
    
    availableGranosVerdes: true,
    percentGranosVerdes: 5,
    toleranceGranosVerdes: 1,
    showToleranceGranosVerdes: true,
    groupToleranceGranosVerdes: false,
    
    availableImpurezas: true,
    percentImpurezas: 3,
    toleranceImpurezas: 0.5,
    showToleranceImpurezas: true,
    groupToleranceImpurezas: false,
    
    availableVano: true,
    percentVano: 2,
    toleranceVano: 0.5,
    showToleranceVano: true,
    groupToleranceVano: false,
    
    availableHualcacho: true,
    percentHualcacho: 1.5,
    toleranceHualcacho: 0.3,
    showToleranceHualcacho: true,
    groupToleranceHualcacho: false,
    
    availableGranosPelados: true,
    percentGranosPelados: 2.5,
    toleranceGranosPelados: 0.5,
    showToleranceGranosPelados: true,
    groupToleranceGranosPelados: false,
    
    availableGranosYesosos: true,
    percentGranosYesosos: 3,
    toleranceGranosYesosos: 0.5,
    showToleranceGranosYesosos: true,
    groupToleranceGranosYesosos: false,
    
    availableGranosManchados: true,
    percentGranosManchados: 2,
    toleranceGranosManchados: 0.3,
    showToleranceGranosManchados: true,
    groupToleranceGranosManchados: false,
    
    availableBonificacion: true,
    toleranceBonificacion: 2,
    
    availableSecado: true,
    percentSecado: 15,
  },

  {
    name: "Plantilla Grupo Tolerancia - Parámetros Principales",
    useToleranceGroup: true,
    groupToleranceValue: 8,
    
    // Parámetros principales con grupo de tolerancia
    availableHumedad: true,
    percentHumedad: 14,
    toleranceHumedad: 1.5,
    showToleranceHumedad: false, // Oculto porque usa grupo
    groupToleranceHumedad: true,
    
    availableGranosVerdes: true,
    percentGranosVerdes: 5,
    toleranceGranosVerdes: 1,
    showToleranceGranosVerdes: false,
    groupToleranceGranosVerdes: true,
    
    availableImpurezas: true,
    percentImpurezas: 3,
    toleranceImpurezas: 0.5,
    showToleranceImpurezas: false,
    groupToleranceImpurezas: true,
    
    availableVano: true,
    percentVano: 2,
    toleranceVano: 0.5,
    showToleranceVano: true, // Tolerancia individual visible
    groupToleranceVano: false,
    
    // Resto deshabilitado
    availableHualcacho: false,
    availableGranosPelados: false,
    availableGranosYesosos: false,
    availableGranosManchados: false,
    availableBonificacion: true,
    toleranceBonificacion: 1.5,
    availableSecado: false,
  },

  {
    name: "Plantilla Calidad Premium - Tolerancias Estrictas",
    useToleranceGroup: false,
    groupToleranceValue: 0,
    
    // Parámetros de calidad con tolerancias muy estrictas
    availableHumedad: true,
    percentHumedad: 13.5,
    toleranceHumedad: 0.5, // Muy estricto
    showToleranceHumedad: true,
    groupToleranceHumedad: false,
    
    availableGranosVerdes: true,
    percentGranosVerdes: 3,
    toleranceGranosVerdes: 0.5,
    showToleranceGranosVerdes: true,
    groupToleranceGranosVerdes: false,
    
    availableImpurezas: true,
    percentImpurezas: 1.5,
    toleranceImpurezas: 0.2,
    showToleranceImpurezas: true,
    groupToleranceImpurezas: false,
    
    availableGranosManchados: true,
    percentGranosManchados: 1,
    toleranceGranosManchados: 0.1,
    showToleranceGranosManchados: true,
    groupToleranceGranosManchados: false,
    
    // Parámetros adicionales deshabilitados para simplicidad
    availableVano: false,
    availableHualcacho: false,
    availableGranosPelados: false,
    availableGranosYesosos: false,
    
    availableBonificacion: true,
    toleranceBonificacion: 3, // Bonificación generosa para calidad premium
    availableSecado: true,
    percentSecado: 12, // Secado más bajo para premium
  },

  {
    name: "Plantilla Estándar - Parámetros Básicos",
    useToleranceGroup: false,
    groupToleranceValue: 0,
    
    // Solo los parámetros más comunes
    availableHumedad: true,
    percentHumedad: 14.5,
    toleranceHumedad: 2,
    showToleranceHumedad: true,
    groupToleranceHumedad: false,
    
    availableGranosVerdes: true,
    percentGranosVerdes: 6,
    toleranceGranosVerdes: 1.5,
    showToleranceGranosVerdes: true,
    groupToleranceGranosVerdes: false,
    
    availableImpurezas: true,
    percentImpurezas: 4,
    toleranceImpurezas: 1,
    showToleranceImpurezas: true,
    groupToleranceImpurezas: false,
    
    // Solo secado habilitado
    availableVano: false,
    availableHualcacho: false,
    availableGranosPelados: false,
    availableGranosYesosos: false,
    availableGranosManchados: false,
    availableBonificacion: false,
    availableSecado: true,
    percentSecado: 16,
  },

  {
    name: "Plantilla Flexible - Con Bonificación",
    useToleranceGroup: false,
    groupToleranceValue: 0,
    
    // Parámetros principales con bonificación
    availableHumedad: true,
    percentHumedad: 15,
    toleranceHumedad: 2.5,
    showToleranceHumedad: true,
    groupToleranceHumedad: false,
    
    availableGranosVerdes: true,
    percentGranosVerdes: 7,
    toleranceGranosVerdes: 2,
    showToleranceGranosVerdes: true,
    groupToleranceGranosVerdes: false,
    
    availableImpurezas: true,
    percentImpurezas: 5,
    toleranceImpurezas: 1.5,
    showToleranceImpurezas: true,
    groupToleranceImpurezas: false,
    
    availableVano: true,
    percentVano: 3,
    toleranceVano: 1,
    showToleranceVano: true,
    groupToleranceVano: false,
    
    // Granos específicos habilitados
    availableHualcacho: false,
    availableGranosPelados: true,
    percentGranosPelados: 3,
    toleranceGranosPelados: 1,
    showToleranceGranosPelados: true,
    groupToleranceGranosPelados: false,
    
    availableGranosYesosos: false,
    availableGranosManchados: false,
    
    availableBonificacion: true,
    toleranceBonificacion: 2.5,
    availableSecado: true,
    percentSecado: 18,
  },

  {
    name: "Plantilla Mixta - Grupo + Individual",
    useToleranceGroup: true,
    groupToleranceValue: 6,
    
    // Algunos en grupo, otros individuales
    availableHumedad: true,
    percentHumedad: 14,
    toleranceHumedad: 1.5,
    showToleranceHumedad: false,
    groupToleranceHumedad: true, // En grupo
    
    availableGranosVerdes: true,
    percentGranosVerdes: 5,
    toleranceGranosVerdes: 1,
    showToleranceGranosVerdes: false,
    groupToleranceGranosVerdes: true, // En grupo
    
    availableImpurezas: true,
    percentImpurezas: 3,
    toleranceImpurezas: 0.8,
    showToleranceImpurezas: true, // Individual
    groupToleranceImpurezas: false,
    
    availableVano: true,
    percentVano: 2,
    toleranceVano: 0.5,
    showToleranceVano: true, // Individual
    groupToleranceVano: false,
    
    availableHualcacho: true,
    percentHualcacho: 1.5,
    toleranceHualcacho: 0.3,
    showToleranceHualcacho: false,
    groupToleranceHualcacho: true, // En grupo
    
    availableGranosPelados: false,
    availableGranosYesosos: false,
    availableGranosManchados: false,
    availableBonificacion: true,
    toleranceBonificacion: 1.8,
    availableSecado: true,
    percentSecado: 15,
  },

  {
    name: "Plantilla Especializada - Defectos Visuales",
    useToleranceGroup: false,
    groupToleranceValue: 0,
    
    // Enfocada en defectos visuales del grano
    availableHumedad: true,
    percentHumedad: 14,
    toleranceHumedad: 1.5,
    showToleranceHumedad: true,
    groupToleranceHumedad: false,
    
    // Defectos básicos deshabilitados
    availableGranosVerdes: false,
    availableImpurezas: false,
    availableVano: false,
    availableHualcacho: false,
    
    // Solo defectos visuales
    availableGranosPelados: true,
    percentGranosPelados: 4,
    toleranceGranosPelados: 1,
    showToleranceGranosPelados: true,
    groupToleranceGranosPelados: false,
    
    availableGranosYesosos: true,
    percentGranosYesosos: 5,
    toleranceGranosYesosos: 1.5,
    showToleranceGranosYesosos: true,
    groupToleranceGranosYesosos: false,
    
    availableGranosManchados: true,
    percentGranosManchados: 3,
    toleranceGranosManchados: 0.8,
    showToleranceGranosManchados: true,
    groupToleranceGranosManchados: false,
    
    availableBonificacion: false,
    availableSecado: true,
    percentSecado: 16,
  },

  {
    name: "Plantilla Económica - Tolerancias Amplias",
    useToleranceGroup: false,
    groupToleranceValue: 0,
    
    // Tolerancias muy amplias para arroz económico
    availableHumedad: true,
    percentHumedad: 16,
    toleranceHumedad: 3, // Muy amplio
    showToleranceHumedad: true,
    groupToleranceHumedad: false,
    
    availableGranosVerdes: true,
    percentGranosVerdes: 8,
    toleranceGranosVerdes: 2.5,
    showToleranceGranosVerdes: true,
    groupToleranceGranosVerdes: false,
    
    availableImpurezas: true,
    percentImpurezas: 6,
    toleranceImpurezas: 2,
    showToleranceImpurezas: true,
    groupToleranceImpurezas: false,
    
    availableVano: true,
    percentVano: 4,
    toleranceVano: 1.5,
    showToleranceVano: true,
    groupToleranceVano: false,
    
    availableHualcacho: true,
    percentHualcacho: 3,
    toleranceHualcacho: 1,
    showToleranceHualcacho: true,
    groupToleranceHualcacho: false,
    
    // Defectos visuales con tolerancias amplias
    availableGranosPelados: true,
    percentGranosPelados: 5,
    toleranceGranosPelados: 2,
    showToleranceGranosPelados: true,
    groupToleranceGranosPelados: false,
    
    availableGranosYesosos: true,
    percentGranosYesosos: 6,
    toleranceGranosYesosos: 2,
    showToleranceGranosYesosos: true,
    groupToleranceGranosYesosos: false,
    
    availableGranosManchados: true,
    percentGranosManchados: 4,
    toleranceGranosManchados: 1.5,
    showToleranceGranosManchados: true,
    groupToleranceGranosManchados: false,
    
    availableBonificacion: false, // Sin bonificación
    availableSecado: true,
    percentSecado: 20, // Secado alto
  },

  {
    name: "Plantilla Experimental - Configuración Avanzada",
    useToleranceGroup: true,
    groupToleranceValue: 10,
    
    // Configuración experimental con mezcla de tolerancias
    availableHumedad: true,
    percentHumedad: 13.8,
    toleranceHumedad: 1.2,
    showToleranceHumedad: false,
    groupToleranceHumedad: true,
    
    availableGranosVerdes: true,
    percentGranosVerdes: 4.5,
    toleranceGranosVerdes: 0.8,
    showToleranceGranosVerdes: true, // Individual visible
    groupToleranceGranosVerdes: false,
    
    availableImpurezas: true,
    percentImpurezas: 2.5,
    toleranceImpurezas: 0.4,
    showToleranceImpurezas: false,
    groupToleranceImpurezas: true,
    
    availableVano: true,
    percentVano: 1.8,
    toleranceVano: 0.3,
    showToleranceVano: false,
    groupToleranceVano: true,
    
    availableHualcacho: true,
    percentHualcacho: 1.2,
    toleranceHualcacho: 0.2,
    showToleranceHualcacho: true, // Individual
    groupToleranceHualcacho: false,
    
    availableGranosPelados: true,
    percentGranosPelados: 2.8,
    toleranceGranosPelados: 0.6,
    showToleranceGranosPelados: false,
    groupToleranceGranosPelados: true,
    
    availableGranosYesosos: true,
    percentGranosYesosos: 3.2,
    toleranceGranosYesosos: 0.7,
    showToleranceGranosYesosos: true, // Individual
    groupToleranceGranosYesosos: false,
    
    availableGranosManchados: true,
    percentGranosManchados: 1.8,
    toleranceGranosManchados: 0.3,
    showToleranceGranosManchados: false,
    groupToleranceGranosManchados: true,
    
    availableBonificacion: true,
    toleranceBonificacion: 2.2,
    availableSecado: true,
    percentSecado: 14.5,
  },
];

// Función para imprimir las plantillas generadas
export function printTemplatesSummary() {
  console.log('\n=== RESUMEN DE PLANTILLAS A CREAR ===\n');
  
  sampleTemplates.forEach((template, index) => {
    console.log(`${index + 1}. ${template.name}`);
    console.log(`   - Grupo de tolerancia: ${template.useToleranceGroup ? 'Sí (' + template.groupToleranceValue + '%)' : 'No'}`);
    
    const enabledParams = [];
    if (template.availableHumedad) enabledParams.push('Humedad');
    if (template.availableGranosVerdes) enabledParams.push('Granos Verdes');
    if (template.availableImpurezas) enabledParams.push('Impurezas');
    if (template.availableVano) enabledParams.push('Vano');
    if (template.availableHualcacho) enabledParams.push('Hualcacho');
    if (template.availableGranosPelados) enabledParams.push('Granos Pelados');
    if (template.availableGranosYesosos) enabledParams.push('Granos Yesosos');
    if (template.availableGranosManchados) enabledParams.push('Granos Manchados');
    if (template.availableBonificacion) enabledParams.push('Bonificación');
    if (template.availableSecado) enabledParams.push('Secado');
    
    console.log(`   - Parámetros habilitados: ${enabledParams.join(', ')}`);
    console.log('');
  });
  
  console.log(`Total de plantillas: ${sampleTemplates.length}\n`);
}

// Función principal para crear las plantillas
export async function createSampleTemplates() {
  console.log('🚀 Iniciando creación de plantillas de ejemplo...');
  
  // Importar la función createDiscountTemplate dinámicamente
  try {
    const { createDiscountTemplate } = await import('../app/actions/discount-template');
    
    printTemplatesSummary();
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < sampleTemplates.length; i++) {
      const template = sampleTemplates[i];
      console.log(`📝 Creando plantilla ${i + 1}: ${template.name}...`);
      
      try {
        const result = await createDiscountTemplate(template);
        
        if ('error' in result) {
          console.error(`❌ Error: ${result.error}`);
          errorCount++;
        } else {
          console.log(`✅ Creada exitosamente con ID: ${result.id}`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Error inesperado: ${error}`);
        errorCount++;
      }
      
      // Pequeña pausa entre creaciones
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n=== RESUMEN FINAL ===');
    console.log(`✅ Plantillas creadas exitosamente: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📊 Total procesadas: ${successCount + errorCount}`);
    
  } catch (error) {
    console.error('💥 Error al importar módulos:', error);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createSampleTemplates().catch(console.error);
}
