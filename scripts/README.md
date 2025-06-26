# Scripts de Plantillas - Paddy Frontend

Este directorio contiene scripts para generar plantillas de ejemplo para el sistema de análisis de granos.

## 📋 Archivos Disponibles

### `create-templates-simple.js`
Script principal para crear 10 plantillas de ejemplo con diferentes combinaciones de parámetros.

### `create-sample-templates.ts`
Versión TypeScript avanzada con documentación detallada y funciones auxiliares.

### `run-create-templates.js`
Wrapper ejecutable para el script de TypeScript.

## 🚀 Cómo Ejecutar

### Opción 1: Usando npm script (Recomendado)
```bash
npm run create-templates
```

### Opción 2: Ejecución directa
```bash
node scripts/create-templates-simple.js
```

### Opción 3: Desde el directorio scripts
```bash
cd scripts
node create-templates-simple.js
```

## 📊 Plantillas que se Crearán

El script creará 10 plantillas con las siguientes características:

1. **Plantilla Básica** - Solo Humedad
2. **Plantilla Completa** - Todos los parámetros
3. **Plantilla Grupo Tolerancia** - Parámetros principales
4. **Plantilla Calidad Premium** - Tolerancias estrictas
5. **Plantilla Estándar** - Parámetros básicos
6. **Plantilla Flexible** - Con bonificación
7. **Plantilla Mixta** - Grupo + Individual
8. **Plantilla Especializada** - Defectos visuales
9. **Plantilla Económica** - Tolerancias amplias
10. **Plantilla Experimental** - Configuración avanzada

## ⚙️ Requisitos

- ✅ Backend ejecutándose en `http://localhost:3001`
- ✅ Endpoint `/template` disponible
- ✅ Node.js instalado
- ✅ Conexión a internet (para fetch API)

## 🔧 Configuración

El script utiliza la variable de entorno `NEXT_PUBLIC_BACKEND_URL` o por defecto `http://localhost:3001`.

Para cambiar la URL del backend:
```bash
NEXT_PUBLIC_BACKEND_URL=http://tu-backend:puerto npm run create-templates
```

## 📝 Salida del Script

```
🚀 Iniciando creación de 10 plantillas de ejemplo...
📋 Las plantillas incluyen diferentes combinaciones de parámetros

📝 Creando plantilla 1: Plantilla Básica - Solo Humedad...
✅ Creada exitosamente con ID: 1

📝 Creando plantilla 2: Plantilla Completa - Todos los Parámetros...
✅ Creada exitosamente con ID: 2

...

=== RESUMEN FINAL ===
✅ Plantillas creadas exitosamente: 10
❌ Errores: 0
📊 Total procesadas: 10

🎉 ¡Plantillas creadas! Ahora puedes usarlas en el sistema de recepciones.
```

## 🐛 Solución de Problemas

### Error de conexión
```
❌ Error inesperado: fetch failed
```
**Solución**: Verificar que el backend esté ejecutándose y accesible.

### Error 404
```
❌ Error: Cannot POST /template
```
**Solución**: Verificar que el endpoint del backend esté implementado correctamente.

### Error de validación
```
❌ Error: Validation failed
```
**Solución**: Verificar que el schema del backend coincida con las propiedades enviadas.

## 📚 Documentación Adicional

- Ver `docs/templates/sample-templates-documentation.md` para descripción detallada de cada plantilla
- Ver `types/discount-template.ts` para las definiciones de tipos

## ⚡ Desarrollo

Para modificar las plantillas, editar el array `sampleTemplates` en `create-templates-simple.js`.

Ejemplo de plantilla:
```javascript
{
  name: "Mi Plantilla Custom",
  useToleranceGroup: false,
  groupToleranceValue: 0,
  availableHumedad: true,
  percentHumedad: 14,
  toleranceHumedad: 1.5,
  showToleranceHumedad: true,
  groupToleranceHumedad: false,
  // ... otros parámetros
}
```

---

*Última actualización: 26 de junio de 2025*
