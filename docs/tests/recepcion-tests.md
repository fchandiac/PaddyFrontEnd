# Pruebas E2E para Funcionalidad de Nueva Recepción

Este documento contiene una lista de pruebas end-to-end (E2E) para validar la funcionalidad de creación de nuevas recepciones, con énfasis en el sistema de redondeo y distribución de tolerancia.

## Ideas para Pruebas E2E de newReception

1. **Prueba de creación básica de recepción**:
   - Iniciar sesión
   - Navegar a la página de nueva recepción
   - Llenar los campos básicos (productor, peso, etc.)
   - Verificar que se puede enviar el formulario
   - [PENDIENTE] Comprobar que la recepción aparece en la lista de recepciones (esta parte quedará pendiente hasta que la funcionalidad de lista de recepciones esté implementada)

2. **Prueba de redondeo automático**:
   - Ingresar valores con más de dos decimales en los campos
   - Verificar que después de salir del campo, el valor se redondea a dos decimales
   - Comprobar que el redondeo es correcto (ej: 1.005 → 1.01, 1.004 → 1.00)

3. **Prueba de distribución de tolerancia de grupo**:
   - Configurar varios parámetros con diferentes porcentajes en el grupo de tolerancia
   - Asignar un valor de tolerancia al grupo
   - Verificar que la tolerancia se distribuye proporcionalmente según los porcentajes
   - Comprobar que la suma de las tolerancias individuales coincide con la tolerancia del grupo

4. **Prueba de validación de tolerancias**:
   - Intentar establecer una tolerancia mayor que el porcentaje para un parámetro
   - Verificar que aparece un mensaje de error
   - Comprobar que no se permite guardar la recepción

5. **Prueba de cálculo de penalizaciones**:
   - Establecer valores para porcentajes y tolerancias
   - Verificar que las penalizaciones se calculan correctamente (neto × (porcentaje - tolerancia) / 100)
   - Comprobar que la suma de penalizaciones individuales coincide con la penalización total

6. **Prueba de aplicación de plantilla de descuentos**:
   - Seleccionar una plantilla predefinida
   - Verificar que se aplican correctamente los valores predeterminados
   - Modificar algunos valores y comprobar que los cálculos se actualizan

7. **Prueba de selección de productor**:
   - Buscar y seleccionar un productor
   - Verificar que los datos del productor se cargan correctamente
   - Comprobar que se puede completar el flujo de creación de recepción

8. **Prueba de interfaz de usuario adaptativa**:
   - Verificar que los parámetros del grupo de tolerancia tienen el color de fondo adecuado
   - Comprobar que los errores se muestran con el estilo correcto
   - Verificar que los botones de visibilidad funcionan correctamente

9. **Prueba de edición de recepción existente**:
   - Crear una recepción
   - Editarla
   - Modificar valores de tolerancia y porcentajes
   - Verificar que todos los cálculos se actualizan correctamente

10. **Prueba de rendimiento bajo carga**:
    - Crear múltiples recepciones rápidamente
    - Verificar que el sistema sigue respondiendo de manera adecuada
    - Comprobar que los cálculos siguen siendo precisos

## Estructura Propuesta para el Archivo de Prueba

```typescript
/// <reference types="@wdio/globals/types" />
/// <reference types="@wdio/mocha-framework" />

import { authenticateForTests } from '../../helpers/auth';

describe('Nueva Recepción - Sistema de Tolerancia y Redondeo', () => {
  before(async () => {
    // Autenticarse antes de las pruebas
    await authenticateForTests(browser);
    
    // Navegar a la página de nueva recepción
    await browser.url('/paddy/receptions/new');
    await browser.pause(2000);
  });

  it('debe cargar correctamente la página de nueva recepción', async () => {
    // Verificar que los elementos principales existen
    // ...
  });

  it('debe redondear automáticamente los valores a dos decimales', async () => {
    // Probar entrada de valores con más de dos decimales
    // ...
  });

  it('debe distribuir proporcionalmente la tolerancia del grupo', async () => {
    // Probar distribución de tolerancia
    // ...
  });

  // Más pruebas...
});
```

## Implementación Priorizada

Se recomienda implementar las pruebas en el siguiente orden de prioridad:

1. Prueba de creación básica de recepción (validar flujo hasta guardar, sin verificar lista de recepciones)
2. Prueba de redondeo automático (validar precisión decimal)
3. Prueba de distribución de tolerancia de grupo (validar algoritmo principal)
4. Prueba de validación de tolerancias (validar restricciones)
5. Prueba de cálculo de penalizaciones (validar cálculos)

Las demás pruebas pueden implementarse posteriormente según las necesidades del proyecto.

## Consideraciones Adicionales

- Asegurarse de que la base de datos de prueba tenga datos suficientes para las pruebas
- Considerar la limpieza de datos después de las pruebas
- Utilizar selectores robustos que no cambien con actualizaciones de la interfaz
- Implementar ayudantes (helpers) para tareas comunes como la selección de productor

## Funcionalidades Pendientes

Algunas partes de las pruebas no pueden implementarse hasta que las siguientes funcionalidades estén disponibles:

1. **Lista de recepciones**: La verificación de que una recepción recién creada aparece en la lista quedará pendiente hasta que esta funcionalidad esté implementada.
2. **Edición de recepciones**: Las pruebas de edición de recepciones existentes quedarán pendientes hasta que esta funcionalidad esté disponible.
