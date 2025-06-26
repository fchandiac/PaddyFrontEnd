# Splash Screen - Sistema Paddy AyG

## 🎯 Funcionalidad Implementada

Se ha implementado una pantalla de splash animada que se muestra durante 8 segundos con fade-out suave al acceder a la aplicación por primera vez en cada sesión.

## 📁 Archivos Creados

### `components/SplashScreen/SplashScreen.tsx`
Componente principal del splash screen con:
- ✅ Animación del logo (flotación y escala)
- ✅ Aparición secuencial de elementos
- ✅ Fondo blanco limpio y profesional
- ✅ Efectos de sombra en el logo
- ✅ Puntos de carga animados
- ✅ Información de la empresa
- ✅ **Versión del sistema (v2.1.0)**
- ✅ **Fade-out suave de 1 segundo**

### `hooks/useSplashScreen.tsx`
Hook personalizado que maneja:
- ✅ Estado del splash screen
- ✅ Control de primera carga por sesión
- ✅ Persistencia en sessionStorage
- ✅ Duración configurable (8.5 segundos incluyendo fade-out)

### `components/SplashScreen/index.tsx`
Archivo de índice para exportación limpia.

## 🔧 Integración

### Modificaciones realizadas:

**`app/RootWrapper.tsx`**
- ✅ Integración del hook useSplashScreen
- ✅ Renderizado condicional del splash
- ✅ Duración configurada en 8.5 segundos (incluyendo fade-out)

**`app/page.tsx`**
- ✅ Animación Fade-in para el login (300ms delay)
- ✅ Transición suave después del splash
- ✅ Corrección de sintaxis (cierre de componente Fade)

## 🎨 Características Visuales

### **Animaciones:**
1. **Logo**: Flotación suave con cambio de escala
2. **Texto**: Efecto glow pulsante en nombre empresa
3. **Aparición**: Fade-in secuencial de elementos
4. **Loading**: Puntos animados al final
5. **Fade-out**: Transición suave de 1 segundo a blanco
6. **Login**: Fade-in tras completar splash (300ms delay)

### **Secuencia temporal:**
- **0-300ms**: Preparación
- **300ms**: Aparece el logo
- **1200ms**: Aparece nombre empresa
- **2000ms**: Aparece tagline, versión y loading
- **7000ms**: Inicia fade-out (1 segundo)
- **8500ms**: Transición al login con animación

### **Colores y branding:**
- ✅ Fondo blanco limpio (#ffffff)
- ✅ Logo con sombra profesional
- ✅ Colores corporativos (azul #1976d2)
- ✅ Tipografía elegante
- ✅ Información de ubicación
- ✅ **Versión del sistema visible**

### **Nuevas características:**
- ✅ **Versión 2.1.0 mostrada discretamente**
- ✅ **Fade-out completo a blanco antes del login**
- ✅ **Pantalla completamente blanca intermedia**
- ✅ **Transición más suave y profesional**

## 💡 Comportamiento

### **Primera carga:**
- ✅ Muestra splash por 8 segundos
- ✅ Fade-out suave de 1 segundo
- ✅ Pantalla blanca intermedia (500ms)
- ✅ Marca en sessionStorage
- ✅ Transición al login con fade-in elegante

### **Cargas posteriores:**
- ✅ No muestra splash en la misma sesión
- ✅ Acceso directo al contenido
- ✅ Reset al cerrar navegador

## 🚀 Uso

El splash screen se activa automáticamente:
- Solo en la primera carga de cada sesión
- Duración: 8 segundos + 1.5 segundos de transición
- Fade-out suave con pantalla blanca intermedia
- Fade-in elegante del login
- No requiere intervención del usuario

## 🎯 Experiencia de Usuario

### **Beneficios:**
- ✅ Experiencia premium de acceso
- ✅ Tiempo de carga percibido reducido
- ✅ Branding corporativo reforzado
- ✅ **Transición ultra suave con fade-out/in**
- ✅ **Información de versión visible**
- ✅ No repetitivo en la misma sesión
- ✅ Diseño limpio sin distracciones
- ✅ **Pantalla intermedia blanca para transición perfecta**

### **Performance:**
- ✅ Carga solo una vez por sesión
- ✅ Componentes optimizados
- ✅ CSS animations (GPU acelerado)
- ✅ Limpieza automática de timers
- ✅ **Transiciones suaves sin parpadeo**

---

*Implementado el 26 de junio de 2025*
*Última actualización: 26 de junio de 2025 - Agregada versión del sistema y fade-out mejorado*
