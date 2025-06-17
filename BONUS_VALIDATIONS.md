# Validaciones del Bonus (Bonificación) - Actualización

## Validaciones Agregadas

Se han implementado las siguientes validaciones para el campo **Bonus.tolerance**:

### 1. **Tolerancia No Puede Ser Negativa** ✅ (Ya existía)
- **Condición**: `toleranceV < 0`
- **Mensaje**: `"Tolerance cannot be negative"`
- **Descripción**: Previene valores negativos en el campo de tolerancia

### 2. **Tolerancia No Puede Exceder 100%** 🆕 (Nuevo)
- **Condición**: `toleranceV > 100`
- **Mensaje**: `"Tolerance cannot exceed 100%"`
- **Descripción**: Limita la tolerancia máxima a 100%

### 3. **Paddy Neto No Puede Exceder Peso Neto** 🆕 (Nuevo)
- **Condición**: `(netWeight - totalDiscounts + bonus) > netWeight`
- **Mensaje**: `"Bonus cannot make Paddy Net exceed Net Weight"`
- **Descripción**: Previene que el bonus genere un Paddy Neto mayor al Peso Neto original
- **Fórmula**: `Paddy Neto = Peso Neto - Total Descuentos + Bonus`

### 4. **Bonus No Puede Igualar Total de Descuentos** 🆕 (Nuevo)
- **Condición**: `Math.abs(netBonus - totalDiscounts) < 0.01`
- **Mensaje**: `"Bonus cannot equal total discounts"`
- **Descripción**: Previene que el bonus tenga exactamente el mismo valor que los descuentos totales
- **Tolerancia**: Se usa una pequeña tolerancia (0.01) para comparación de números decimales

## Implementación Técnica

### Funciones Actualizadas
1. **`bonus.tolerance.onChange`** - Validación cuando el usuario cambia el valor manualmente
2. **`bonus.penalty.effect`** - Validación automática cuando se recalcula el bonus

### Conexiones Reactivas Agregadas
```typescript
// Para re-validar cuando cambien los valores que afectan las validaciones
summary.penalty.addConsumer(bonus.tolerance); // Cuando cambien los descuentos totales
netWeight.node.addConsumer(bonus.tolerance);  // Cuando cambie el peso neto
```

### Flujo de Validación
1. Se convierte `NaN` a `0` para campos vacíos
2. Se valida que no sea negativo
3. Se valida que no exceda 100%
4. Se calculan valores necesarios (netWeight, totalDiscounts, netBonus)
5. Se valida que Paddy Neto no exceda Peso Neto
6. Se valida que el bonus no sea igual a los descuentos totales
7. Si todas las validaciones pasan, se limpia el error y se establece el valor

### Prioridad de Validaciones
Las validaciones se ejecutan en orden de importancia:
1. **Crítico**: Valores negativos y > 100%
2. **Lógico**: Restricciones de negocio (Paddy Neto, equivalencia)

## Casos de Uso

### ✅ Casos Válidos
- Tolerancia entre 0% y 100%
- Bonus que no haga que Paddy Neto > Peso Neto
- Bonus diferente al total de descuentos

### ❌ Casos Inválidos
- Tolerancia negativa: `-5%`
- Tolerancia mayor a 100%: `150%`
- Bonus que genere Paddy Neto > Peso Neto
- Bonus exactamente igual al total de descuentos

## Feedback Visual
- **Error**: Fondo rojo claro (`#ffcdd2`) en el campo de tolerancia
- **Normal**: Fondo por defecto (`inherit`)
- **Mensaje**: Se muestra el mensaje de error específico para cada validación

## Beneficios
1. **Integridad de Datos**: Previene configuraciones inválidas
2. **Lógica de Negocio**: Asegura que el bonus tenga sentido económico
3. **Experiencia de Usuario**: Feedback inmediato y claro
4. **Sistema Reactivo**: Re-validación automática cuando cambian valores relacionados
