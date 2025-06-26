# Plantillas de Ejemplo - Sistema de Análisis de Granos

Este documento describe las 10 plantillas de ejemplo creadas para el sistema de recepción de paddy. Cada plantilla está diseñada para demostrar diferentes combinaciones de parámetros y configuraciones posibles.

## 📋 Lista de Plantillas

### 1. **Plantilla Básica - Solo Humedad**
- **Propósito**: Análisis simplificado enfocado únicamente en humedad
- **Características**:
  - Solo parámetro de humedad habilitado
  - Sin grupo de tolerancia
  - Ideal para recepciones rápidas o básicas

### 2. **Plantilla Completa - Todos los Parámetros**
- **Propósito**: Análisis exhaustivo con todos los parámetros disponibles
- **Características**:
  - Todos los parámetros habilitados
  - Tolerancias individuales para cada parámetro
  - Incluye bonificación y secado
  - Configuración más completa disponible

### 3. **Plantilla Grupo Tolerancia - Parámetros Principales**
- **Propósito**: Demostrar el uso del sistema de tolerancia grupal
- **Características**:
  - Grupo de tolerancia: 8%
  - Parámetros principales (Humedad, Granos Verdes, Impurezas) en grupo
  - Vano con tolerancia individual
  - Combina tolerancia grupal e individual

### 4. **Plantilla Calidad Premium - Tolerancias Estrictas**
- **Propósito**: Control de calidad para arroz premium
- **Características**:
  - Tolerancias muy estrictas (0.1% - 0.5%)
  - Enfoque en parámetros de calidad visual
  - Bonificación generosa (3%) para calidad premium
  - Secado bajo (12%) para mantener calidad

### 5. **Plantilla Estándar - Parámetros Básicos**
- **Propósito**: Configuración estándar para uso general
- **Características**:
  - Solo parámetros más comunes (Humedad, Granos Verdes, Impurezas)
  - Tolerancias moderadas
  - Incluye secado estándar
  - Sin bonificación para simplicidad

### 6. **Plantilla Flexible - Con Bonificación**
- **Propósito**: Configuración flexible con incentivos
- **Características**:
  - Tolerancias amplias (1.5% - 2.5%)
  - Bonificación habilitada (2.5%)
  - Algunos parámetros de granos específicos
  - Secado alto (18%)

### 7. **Plantilla Mixta - Grupo + Individual**
- **Propósito**: Demostrar configuración híbrida de tolerancias
- **Características**:
  - Grupo de tolerancia: 6%
  - Algunos parámetros en grupo, otros individuales
  - Configuración balanceada
  - Muestra flexibilidad del sistema

### 8. **Plantilla Especializada - Defectos Visuales**
- **Propósito**: Enfoque específico en defectos visuales del grano
- **Características**:
  - Solo humedad + defectos visuales (Pelados, Yesosos, Manchados)
  - Parámetros básicos deshabilitados
  - Especializada para control de calidad visual
  - Sin bonificación

### 9. **Plantilla Económica - Tolerancias Amplias**
- **Propósito**: Para arroz de grado económico o comercial
- **Características**:
  - Tolerancias muy amplias (1.5% - 3%)
  - Todos los parámetros habilitados
  - Sin bonificación
  - Secado alto (20%)
  - Ideal para recepciones menos exigentes

### 10. **Plantilla Experimental - Configuración Avanzada**
- **Propósito**: Demostrar configuraciones avanzadas y complejas
- **Características**:
  - Grupo de tolerancia: 10%
  - Mezcla compleja de tolerancias grupales e individuales
  - Valores precisos (decimales)
  - Configuración más sofisticada

## 🎯 Casos de Uso

### **Para Productores Pequeños**
- Plantilla Básica: Análisis rápido y simple
- Plantilla Estándar: Configuración equilibrada

### **Para Productores Premium**
- Plantilla Calidad Premium: Control estricto
- Plantilla Especializada: Enfoque en calidad visual

### **Para Uso General**
- Plantilla Completa: Análisis exhaustivo
- Plantilla Flexible: Con incentivos

### **Para Experimentación**
- Plantilla Experimental: Configuraciones complejas
- Plantilla Mixta: Tolerancias híbridas

### **Para Grados Comerciales**
- Plantilla Económica: Tolerancias amplias
- Plantilla Grupo Tolerancia: Simplificación de tolerancias

## 🔧 Características Técnicas

### **Combinaciones de Parámetros**
- **Solo Humedad**: 1 plantilla
- **Parámetros Básicos (3-4)**: 3 plantillas  
- **Parámetros Completos (8+)**: 6 plantillas

### **Configuración de Tolerancias**
- **Solo Individual**: 6 plantillas
- **Solo Grupal**: 1 plantilla
- **Mixta (Grupo + Individual)**: 3 plantillas

### **Niveles de Exigencia**
- **Estricta**: 1 plantilla (Premium)
- **Moderada**: 6 plantillas
- **Amplia**: 3 plantillas (Económica, Flexible, Experimental)

### **Funcionalidades Especiales**
- **Con Bonificación**: 6 plantillas
- **Sin Bonificación**: 4 plantillas
- **Con Secado**: 9 plantillas
- **Sin Secado**: 1 plantilla

## 📊 Estadísticas de Cobertura

| Parámetro | Plantillas que lo incluyen | Porcentaje |
|-----------|---------------------------|------------|
| Humedad | 10 | 100% |
| Granos Verdes | 8 | 80% |
| Impurezas | 8 | 80% |
| Vano | 6 | 60% |
| Hualcacho | 5 | 50% |
| Granos Pelados | 5 | 50% |
| Granos Yesosos | 4 | 40% |
| Granos Manchados | 5 | 50% |
| Bonificación | 6 | 60% |
| Secado | 9 | 90% |

## 🚀 Cómo Ejecutar

Para crear estas plantillas en su sistema:

```bash
# Desde la raíz del proyecto
cd scripts
node create-sample-templates.ts
```

O usando el script ejecutable:

```bash
npm run create-templates
```

## 📝 Notas de Implementación

1. **Valores Realistas**: Todos los porcentajes y tolerancias están basados en estándares reales de la industria
2. **Progresión Lógica**: Las plantillas van de simple a complejo
3. **Cobertura Completa**: Se prueban todas las funcionalidades del sistema
4. **Casos Extremos**: Incluye configuraciones mínimas y máximas
5. **Flexibilidad**: Demuestra la versatilidad del sistema de plantillas

## 🔍 Testing

Estas plantillas permiten probar:
- ✅ Tolerancias individuales vs grupales
- ✅ Combinaciones de parámetros
- ✅ Bonificaciones y secado
- ✅ Configuraciones simples y complejas
- ✅ Casos de uso reales
- ✅ Rendimiento con diferentes configuraciones

---

*Documento generado automáticamente el 26 de junio de 2025*
