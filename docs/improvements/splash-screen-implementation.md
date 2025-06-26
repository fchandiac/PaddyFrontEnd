# Splash Screen - Sistema Paddy AyG

## 🎯 Funcionalidad Implementada

Se ha implementado una pantalla de splash animada que se muestra durante 8 segundos al acceder a la aplicación por primera vez en cada sesión.

## 📁 Archivos Creados

### `components/SplashScreen/SplashScreen.tsx`
Componente principal del splash screen con:
- ✅ Animación del logo (flotación y escala)
- ✅ Aparición secuencial de elementos
- ✅ Fondo blanco limpio y profesional
- ✅ Efectos de sombra en el logo
- ✅ Puntos de carga animados
- ✅ Información de la empresa

### `hooks/useSplashScreen.tsx`
Hook personalizado que maneja:
- ✅ Estado del splash screen
- ✅ Control de primera carga por sesión
- ✅ Persistencia en sessionStorage
- ✅ Duración configurable (8 segundos)

### `components/SplashScreen/index.tsx`
Archivo de índice para exportación limpia.

## 🔧 Integración

### Modificaciones realizadas:

**`app/RootWrapper.tsx`**
- ✅ Integración del hook useSplashScreen
- ✅ Renderizado condicional del splash
- ✅ Duración configurada en 8 segundos

**`app/page.tsx`**
- ✅ Animación Fade-in para el login
- ✅ Transición suave después del splash
- ✅ Corrección de sintaxis (cierre de componente Fade)

## 🎨 Características Visuales

### **Animaciones:**
1. **Logo**: Flotación suave con cambio de escala
2. **Texto**: Efecto glow pulsante en nombre empresa
3. **Aparición**: Fade-in secuencial de elementos
4. **Loading**: Puntos animados al final
5. **Login**: Fade-in tras completar splash

### **Secuencia temporal:**
- **0-300ms**: Preparación
- **300ms**: Aparece el logo
- **1200ms**: Aparece nombre empresa
- **2000ms**: Aparece tagline y loading
- **8000ms**: Transición al login con animación

### **Colores y branding:**
- ✅ Fondo blanco limpio (#ffffff)
- ✅ Logo con sombra profesional
- ✅ Colores corporativos (azul #1976d2)
- ✅ Tipografía elegante
- ✅ Información de ubicación

## 💡 Comportamiento

### **Primera carga:**
- ✅ Muestra splash por 8 segundos
- ✅ Marca en sessionStorage
- ✅ Transición suave al login con animación

### **Cargas posteriores:**
- ✅ No muestra splash en la misma sesión
- ✅ Acceso directo al contenido
- ✅ Reset al cerrar navegador

## 🚀 Uso

El splash screen se activa automáticamente:
- Solo en la primera carga de cada sesión
- Duración: 8 segundos
- Transición automática al login con fade-in
- No requiere intervención del usuario

## 🎯 Experiencia de Usuario

### **Beneficios:**
- ✅ Experiencia premium de acceso
- ✅ Tiempo de carga percibido reducido
- ✅ Branding corporativo reforzado
- ✅ Transición elegante con animación
- ✅ No repetitivo en la misma sesión
- ✅ Diseño limpio sin distracciones

### **Performance:**
- ✅ Carga solo una vez por sesión
- ✅ Componentes optimizados
- ✅ CSS animations (GPU acelerado)
- ✅ Limpieza automática de timers

---

*Implementado el 26 de junio de 2025*
*Última actualización: 26 de junio de 2025 - Extendida duración a 8 segundos y añadida animación de login*
