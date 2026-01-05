# Agent Definition: Landing Page - Ley Segunda Oportunidad & Deudas

Este documento actúa como la fuente de verdad única para el desarrollo, diseño y lógica de negocio de la Landing Page.

---

## 1. Lógica de Negocio (Core Engine)

### Cuestionario de Calificación
El sistema consta de 3 preguntas secuenciales con respuesta binaria (SÍ / NO).

1.  **P1:** ¿Debes más de 10.000€?
2.  **P2:** ¿Tengo capacidad para pagar mi deuda y vivir dignamente?
3.  **P3:** ¿Has intentado llegar a un acuerdo con acreedores y ha sido fallido?

### Matriz de Resultados
El resultado se determina por la combinación de respuestas (P1 / P2 / P3).

| Resultado Final | Combinación (P1 / P2 / P3) | Acción Requerida |
| :--- | :--- | :--- |
| **LEY SEGUNDA OPORTUNIDAD** | **SÍ / NO / SÍ**<br>**NO / NO / SÍ** | Mostrar CTA Análisis Gratuito (Formulario HubSpot) |
| **NEGOCIA CON ACREEDORES** | **NO / NO / NO**<br>**SÍ / NO / NO**<br>**SÍ / SÍ / NO** | Mostrar Información de Negociación |
| **PERFIL NO APTO ("Lotería")** | **SÍ / SÍ / SÍ** | Mensaje de Cierre / No cualificado |

> **Regla Crítica:** Si la respuesta a **P3** (Intento de acuerdo) es **NO**, el resultado siempre es **NEGOCIA CON ACREEDORES**, independientemente de las anteriores.

---

## 2. Especificaciones Técnicas e Integraciones

### 2.1. Captura de Datos (Input)
* **URL Parameter:** La landing debe leer y capturar el parámetro `email` de la URL de entrada (ej: `landing.com/?email=usuario@test.com`).
* Este email debe persistir durante todo el cuestionario para ser enviado al final.

### 2.2. Envío de Datos (Webhook)
Cuando el usuario completa el cuestionario y el resultado es **Ley Segunda Oportunidad**, se debe disparar un Webhook (POST) con:
* Email (capturado de la URL).
* Las respuestas a las 3 preguntas.
* El resultado calculado.

### 2.3. Conversión (Output)
* **Escenario Principal (Ley 2ª Oportunidad):**
    * Mostrar mensaje: *"Te ofrecemos un análisis COMPLETO GRATUITO para estudiar tu caso"*.
    * **Elemento UI:** Formulario simple (Nombre, Teléfono, Email - prellenado si es posible).
    * **Destino:** Los datos deben enviarse a **HubSpot**.
* **Fallback (Opcional):** Botón a WhatsApp Comercial (solo si falla la integración o como opción secundaria), asumiendo pérdida de trazabilidad.

---

## 3. Sistema de Diseño (Design System)

La UI debe implementarse utilizando **Tailwind CSS** con la siguiente configuración estricta.

### Paleta de Colores

| Variable Semántica | Hex | Clase Tailwind | Uso |
| :--- | :--- | :--- | :--- |
| **Primary** | `#0a2461` | `bg-primary`, `text-primary` | Botones principales, Nav activos |
| **Secondary** | `#3b82f6` | `bg-secondary` | Acentos, enlaces secundarios |
| **Accent Red** | `#ef4444` | `bg-accent-red` | Errores, Rechazados |
| **Accent Green** | `#22c55e` | `bg-accent-green` | Éxito, Aprobados |
| **Accent Yellow** | `#eab308` | `bg-accent-yellow` | Advertencias |
| **Background Light** | `#f3f4f6` | `bg-background-light` | Fondo general (Modo claro) |
| **Background Dark** | `#111621` | `bg-background-dark` | Fondo alternativo |
| **Text Main** | `#111318` | `text-[#111318]` | Texto principal |
| **Text Secondary** | `#636e88` | `text-[#636e88]` | Subtítulos |

### Tipografía

* **Principal (UI):** `Inter` (Google Fonts).
    * Weights: 400, 500, 600, 700.
    * Clase: `font-display`.
* **Monospace (Datos):** `IBM Plex Mono` (Google Fonts).
    * Weights: 400, 500, 600.
    * Clase: `font-mono`.
    * Uso: Números, montos de dinero, IDs.

### UI Kits (Bordes y Sombras)

* **Border Radius:**
    * Default: `rounded` (8px).
    * Cards: `rounded-xl` (16px).
    * Badges/Avatars: `rounded-full`.
* **Sombras:**
    * Cards/Contenedores: `shadow-soft` -> `0 2px 10px rgba(0, 0, 0, 0.03)`.
    * Elementos elevados: `shadow-md` o `shadow-lg`.

---

## 4. Estructura del Proyecto (Frontend Suggestion)

### Configuración Tailwind (`tailwind.config.js`)
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#0a2461',
        secondary: '#3b82f6',
        'accent-red': '#ef4444',
        'accent-green': '#22c55e',
        'accent-yellow': '#eab308',
        'background-light': '#f3f4f6',
        'background-dark': '#111621',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(0, 0, 0, 0.03)',
      }
    }
  }
}
Flujo de Usuario (UX)
1. Landing: Hero section simple.
2. Quiz: Transiciones suaves entre preguntas. No mostrar todas a la vez.
3. Loading: Spinner de "Analizando respuestas" (simulado 2-3 seg).
4. Resultado: Pantalla final correspondiente a la matriz lógica.
5. Instrucciones para Desarrollo
1. Implementar la lógica de redirección basada estrictamente en la matriz del punto 1.
2. Asegurar que el parámetro ?email se captura en el onload.
3. Priorizar la conexión API/Webhook antes de mostrar el resultado final para asegurar que el lead se guarda aunque el usuario cierre la pestaña.
