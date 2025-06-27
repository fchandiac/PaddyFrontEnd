# Documentación: Sistema de Redondeo y Distribución de Tolerancia en la Aplicación Paddy

## 1. Sistema de Redondeo

### Funciones Principales

#### 1.1 `roundToTwoDecimals`

Esta función aplica redondeo a dos decimales a todos los valores numéricos en la aplicación, usando el método de redondeo bancario para evitar sesgos.

```typescript
export const roundToTwoDecimals = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};
```

#### 1.2 `compensateRounding`

Esta función se utiliza para distribuir diferencias de redondeo entre varios valores, asegurando que la suma de los valores redondeados sea igual a la suma objetivo.

```typescript
export const compensateRounding = (values: number[], targetSum: number): number[] => {
  // Implementación que distribuye las diferencias de redondeo
  // entre valores priorizando aquellos con mayor parte decimal
}
```

### Aplicación del Redondeo

Todos los métodos `setValue` de los nodos aplican automáticamente redondeo a dos decimales:

```typescript
setValue: (v: number) => {
  node.value = roundToTwoDecimals(v);
  
  node.nodeConsumers.forEach((consumer) => {
    if (consumer.effect) {
      consumer.effect();
    }
  });
}
```

## 2. Sistema de Distribución de Tolerancia

### Algoritmo de Distribución

Cuando se asigna un valor de tolerancia al grupo (`groupSummary.tolerance`), este valor se distribuye proporcionalmente entre los parámetros individuales que pertenecen al grupo de tolerancia. La distribución se realiza según el porcentaje relativo de cada parámetro respecto al total del grupo.

#### Implementación en `groupSummary.tolerance.onChange`

```typescript
groupSummary.tolerance.onChange = (value: number) => {
  /**
   * Esta función distribuye la tolerancia del grupo entre los parámetros individuales
   * basándose en la proporción del porcentaje de cada parámetro respecto al total.
   * 
   * Proceso:
   * 1. Actualiza el valor de tolerancia del grupo
   * 2. Identifica los parámetros que pertenecen al grupo de tolerancia
   * 3. Calcula la suma total de porcentajes de estos parámetros
   * 4. Distribuye la tolerancia proporcionalmente según el peso de cada parámetro
   * 5. Actualiza las tolerancias individuales usando setValue para aplicar redondeo
   * 6. Recalcula las penalizaciones individuales
   * 7. Actualiza la penalización del grupo
   * 8. Recalcula la tolerancia total para el Summary
   */
  
  // 1. Actualizar el valor de tolerancia del grupo
  groupSummary.tolerance.setValue(value);
  
  // 2. Identificar parámetros del grupo de tolerancia
  const toleranceGroupParams = [
    { cluster: humedad, percent: humedad.percent.value },
    { cluster: granosVerdes, percent: granosVerdes.percent.value },
    { cluster: impurezas, percent: impurezas.percent.value },
    { cluster: vano, percent: vano.percent.value },
    { cluster: hualcacho, percent: hualcacho.percent.value },
    { cluster: granosManchados, percent: granosManchados.percent.value },
    { cluster: granosPelados, percent: granosPelados.percent.value },
    { cluster: granosYesosos, percent: granosYesosos.percent.value }
  ].filter(param => param.cluster.toleranceGroup && param.cluster.available);
  
  // 3. Calcular suma total de porcentajes
  const totalPercent = toleranceGroupParams.reduce((sum, param) => 
    sum + (isNaN(param.percent) ? 0 : param.percent), 0);
  
  // Si no hay porcentajes, no podemos distribuir
  if (totalPercent <= 0) {
    return;
  }
  
  // 4. Preparar array para recolectar tolerancias distribuidas
  const distributedTolerances: { cluster: ParamCluster, tolerance: number }[] = [];
  
  // 5. Primera pasada: calcular tolerancias distribuidas
  toleranceGroupParams.forEach(param => {
    const paramPercent = isNaN(param.percent) ? 0 : param.percent;
    // Calcular peso relativo del parámetro
    const weight = paramPercent / totalPercent;
    // Distribuir tolerancia según peso y redondear
    const distributedTolerance = roundToTwoDecimals(value * weight);
    
    distributedTolerances.push({
      cluster: param.cluster,
      tolerance: distributedTolerance
    });
  });
  
  // 6. Segunda pasada: aplicar tolerancias y recalcular penalizaciones
  distributedTolerances.forEach(item => {
    item.cluster.tolerance.setValue(item.tolerance);
  });
  
  // 7. Actualizar penalización del grupo
  if (groupSummary.penalty.effect) {
    groupSummary.penalty.effect();
  }
  
  // 8. Recalcular el valor de summary.tolerance
  const newSummaryToleranceValue = roundToTwoDecimals(
    (isNaN(humedad.tolerance.value) ? 0 : humedad.tolerance.value) +
    (isNaN(granosVerdes.tolerance.value) ? 0 : granosVerdes.tolerance.value) +
    (isNaN(impurezas.tolerance.value) ? 0 : impurezas.tolerance.value) +
    (isNaN(vano.tolerance.value) ? 0 : vano.tolerance.value) +
    (isNaN(hualcacho.tolerance.value) ? 0 : hualcacho.tolerance.value) +
    (isNaN(granosManchados.tolerance.value) ? 0 : granosManchados.tolerance.value) +
    (isNaN(granosPelados.tolerance.value) ? 0 : granosPelados.tolerance.value) +
    (isNaN(granosYesosos.tolerance.value) ? 0 : granosYesosos.tolerance.value)
  );
  
  summary.tolerance.setValue(newSummaryToleranceValue);
};
```

### Explicación del Algoritmo

1. **Actualización del valor del grupo**: Primero se establece el nuevo valor de tolerancia para el grupo usando `setValue`, lo que aplica redondeo automático.

2. **Identificación de parámetros**: Se identifican los parámetros que pertenecen al grupo de tolerancia y están disponibles.

3. **Cálculo del total de porcentajes**: Se calcula la suma total de los porcentajes de los parámetros identificados.

4. **Distribución proporcional**: Para cada parámetro, se calcula:
   - Su peso relativo: `paramPercent / totalPercent`
   - La tolerancia distribuida: `value * weight` (redondeada a dos decimales)

5. **Aplicación de las tolerancias**: Se aplican las tolerancias calculadas a cada parámetro usando `setValue`, lo que automáticamente:
   - Aplica redondeo a dos decimales
   - Dispara los efectos asociados a cada nodo, recalculando las penalizaciones

6. **Actualización de penalizaciones**: Se recalcula la penalización del grupo basada en las nuevas tolerancias.

7. **Actualización del resumen**: Se recalcula el valor total de tolerancias para el nodo `summary.tolerance`.

### Ejemplo de Cálculo

Supongamos tres parámetros en el grupo de tolerancia con estos porcentajes:
- Humedad: 5%
- Granos Verdes: 3%
- Impurezas: 2%

El total es 10%. Si asignamos una tolerancia de grupo de 4%, la distribución sería:
- Humedad: 4 × (5/10) = 2%
- Granos Verdes: 4 × (3/10) = 1.2%
- Impurezas: 4 × (2/10) = 0.8%

Cada tolerancia se redondea a dos decimales y se aplica al parámetro correspondiente.

## 3. Flujo de Cálculo de Penalizaciones

Después de distribuir las tolerancias, las penalizaciones se calculan automáticamente:

1. Para cada parámetro: `penalty = netWeight × max(0, percent - tolerance) / 100`
2. Para el grupo: `penalty = netWeight × max(0, groupPercent - groupTolerance) / 100`

Las penalizaciones se redondean automáticamente a dos decimales, evitando discrepancias en los totales.

## 4. Validaciones Implementadas

- La tolerancia no puede exceder el porcentaje correspondiente.
- La tolerancia del grupo no puede exceder el porcentaje del grupo.
- El total de porcentajes y tolerancias no puede exceder el 100%.
- Las penalizaciones totales no pueden exceder el peso neto.

## 5. Beneficios del Sistema

1. **Precisión**: Todos los valores se muestran y calculan con exactamente dos decimales.
2. **Consistencia**: La suma de las tolerancias individuales coincide con la tolerancia del grupo.
3. **Proporcionalidad**: La distribución de tolerancia respeta el peso relativo de cada parámetro.
4. **Transparencia**: El algoritmo está documentado y es comprensible para futuras modificaciones.

Este sistema garantiza que todos los cálculos sean consistentes y que los valores mostrados en la interfaz de usuario reflejen con precisión las operaciones matemáticas subyacentes, evitando discrepancias por redondeo.
