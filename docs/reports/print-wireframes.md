# Wireframes de Impresión - Sistema de Recepciones

## 📄 Documentación de los wireframes de impresión del sistema

### **Ubicación de archivos:**
- **Principal**: `app/paddy/receptions/new/page.tsx` (líneas 348-430)
- **Liquidación**: `app/paddy/receptions/new/ui/SettlementToPrintMock.tsx`
- **Componente**: `components/PrintDialog/PrintDialog.tsx`

---

## 🧾 **1. Wireframe: Recepción de Paddy**

### **Estructura del documento:**
```
RECEPCIÓN DE PADDY
═══════════════════

┌─ Datos del Productor ─────────┬─ Datos de la Recepción ────┐
│ • Nombre                      │ • Fecha                    │
│ • RUT                         │ • Guía                     │
│ • Razón Social               │ • Placa Patente            │
│ • Dirección                  │                            │
└───────────────────────────────┴────────────────────────────┘

┌─ Resumen de Pesos ─────────────────────────────────────────┐
│ Peso Bruto │ Tara │ Peso Neto │ Paddy Neto                │
│    XXX kg  │ XXkg │   XXX kg  │   XXX kg                  │
└────────────────────────────────────────────────────────────┘
```

### **Datos que se imprimen:**
- **Productor**: `data.producerName`, `data.producerRut`, `data.producerBusinessName`, `data.producerAddress`
- **Recepción**: `data.guide`, `data.licensePlate`, fecha actual
- **Pesos**: `liveClusters.grossWeight`, `liveClusters.tare`, `liveClusters.netWeight`, `liveClusters.totalPaddy`

---

## 💰 **2. Wireframe: Liquidación a Proveedores**

### **Estructura del documento:**
```
COOPERATIVA AGRÍCOLA DEL SUR          LIQUIDACIÓN A PROVEEDORES
Ruta L-30 KM 12                               Folio: 2140
Linares                                       Fecha: 14/04/2025
════════════════════════════════════════════════════════════════

RUT: 15.789.654-2
Nombre: María Eugenia Rivas Torres
Giro: Producción de arroz
────────────────────────────────────────────────────────────────

Detalle de Recepciones
┌──────────────┬──────────┬─────────────┬────────────┬────────┬─────────────┐
│ Guía Recep.  │ Fecha    │ Guía Desp.  │ Paddy Neto │ Precio │ Valor Neto  │
├──────────────┼──────────┼─────────────┼────────────┼────────┼─────────────┤
│ 7001         │02-04-24  │ 601         │ 30,500     │ 480    │ 14,640,000  │
│ 7002         │08-04-24  │ 602         │ 31,200     │ 480    │ 14,976,000  │
│ ...          │ ...      │ ...         │ ...        │ ...    │ ...         │
├──────────────┼──────────┼─────────────┼────────────┼────────┼─────────────┤
│ TOTALES      │          │             │ 150,600    │        │ 72,288,000  │
└──────────────┴──────────┴─────────────┴────────────┴────────┴─────────────┘

                                          Sub-Total: 72,288,000
                                          IVA (19%): 13,734,720
                                          Total:     86,022,720
────────────────────────────────────────────────────────────────

Detalle de Anticipos / Cheques
┌──────────────┬────────┬──────────┬────────────┬──────┬─────────┐
│ Banco        │ N°     │ Fecha    │ Monto      │ Días │ Interés │
├──────────────┼────────┼──────────┼────────────┼──────┼─────────┤
│ Banco Estado │225566  │2024-03-05│ 8,500,000  │ 244  │ 1,037,000│
│ Banco Chile  │336699  │2024-04-01│ 7,200,000  │ 217  │ 782,400 │
│ ...          │ ...    │ ...      │ ...        │ ...  │ ...     │
├──────────────┼────────┼──────────┼────────────┼──────┼─────────┤
│ TOTALES      │        │          │51,000,000  │      │2,891,150│
└──────────────┴────────┴──────────┴────────────┴──────┴─────────┘
```

### **Funcionalidades implementadas:**
- **Cálculo de intereses**: Tasa diaria 0.0005 (0.05%)
- **Cálculo de días**: Entre fecha de anticipo y liquidación
- **Totales automáticos**: Sumas de montos e intereses
- **Formato de números**: Separadores de miles en español chileno

---

## 🛠️ **3. Componente PrintDialog**

### **Características:**
- **Librería**: `react-to-print`
- **Vista previa**: Muestra el contenido antes de imprimir
- **Responsive**: Tamaños configurables (xs, sm, md, lg, xl)
- **Título personalizable**: Para diferentes tipos de documentos

### **Props disponibles:**
```typescript
interface PrintDialogProps {
  open: boolean;              // Estado del diálogo
  setOpen: (open: boolean) => void; // Función para cerrar
  title: string;              // Título del documento
  children: React.ReactNode;  // Contenido a imprimir
  dialogWidth?: "xs" | "sm" | "md" | "lg" | "xl"; // Tamaño
  pageStyle?: string;         // Estilos de página (futuro)
}
```

---

## 🎯 **Estado actual:**

### ✅ **Implementado:**
- Wireframe básico de recepción con datos principales
- Wireframe completo de liquidación con cálculos
- Sistema de impresión funcional
- Vista previa antes de imprimir

### 🔄 **Pendiente/Mejoras:**
- Conectar datos reales del formulario a la liquidación
- Agregar logo de la cooperativa
- Implementar diferentes formatos según tipo de documento
- Optimizar estilos para impresión
- Agregar código de barras/QR para trazabilidad

---

## 📋 **Uso del sistema:**

1. **Usuario completa** formulario de recepción
2. **Hace clic** en botón de imprimir (📄)
3. **Se abre** PrintDialog con vista previa
4. **Puede revisar** antes de imprimir
5. **Hace clic** en "Imprimir" para enviar a impresora

---

*Documentación generada el: 26 de junio de 2025*
*Ubicación: docs/reports/print-wireframes.md*
