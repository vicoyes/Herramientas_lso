# Landing Page - Ley Segunda Oportunidad & Deudas

Landing page interactiva para calificar clientes potenciales según su perfil de deuda y capacidad de acogerse a la Ley de Segunda Oportunidad.

## 🚀 Características

- **Cuestionario interactivo** de 3 preguntas con lógica de decisión
- **Matriz de resultados** automatizada según perfil del usuario
- **Captura de email** desde parámetros URL
- **Integración con webhook** para envío de datos
- **Formulario de leads** para casos cualificados
- **Diseño responsive** con Tailwind CSS
- **Animaciones suaves** y UX optimizada

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
```
Edita `.env` con tus credenciales:
- `WEBHOOK_URL`: URL de tu endpoint para recibir datos
- `HUBSPOT_API_KEY`: Clave API de HubSpot (opcional)
- `WHATSAPP_NUMBER`: Número de WhatsApp comercial

3. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
├── config/                 # Archivos de configuración
├── public/                 # Archivos estáticos
│   └── assets/            # Imágenes, iconos, etc.
├── src/
│   ├── components/        # Componentes reutilizables (futuro)
│   ├── css/
│   │   └── styles.css    # Estilos con Tailwind
│   └── js/
│       └── main.js       # Lógica principal del cuestionario
├── index.html             # Página principal
├── package.json
├── tailwind.config.js     # Configuración de Tailwind
├── postcss.config.js
├── vite.config.js
└── agent.md              # Especificaciones del proyecto
```

## 🎯 Flujo de Usuario

1. **Hero Section**: Presentación y CTA para comenzar
2. **Cuestionario**: 3 preguntas secuenciales con barra de progreso
3. **Loading**: Simulación de análisis (2-3 segundos)
4. **Resultados**: Pantalla personalizada según perfil:
   - ✅ **Ley Segunda Oportunidad**: Formulario de análisis gratuito
   - ⚠️ **Negociar con Acreedores**: Consejos y recomendaciones
   - ❌ **No Apto**: Mensaje informativo

## 🧮 Matriz de Lógica

| Resultado | P1 (>10k€) | P2 (Capacidad pago) | P3 (Intento fallido) |
|-----------|------------|---------------------|----------------------|
| **Ley 2ª Oportunidad** | SÍ | NO | SÍ |
| **Ley 2ª Oportunidad** | NO | NO | SÍ |
| **Negociar** | - | - | NO |
| **No Apto** | SÍ | SÍ | SÍ |

**Regla crítica**: Si P3 = NO → Siempre es "Negociar"

## 🎨 Design System

### Colores
- **Primary**: `#0a2461` - Botones principales
- **Secondary**: `#3b82f6` - Enlaces y acentos
- **Accent Green**: `#22c55e` - Éxito
- **Accent Red**: `#ef4444` - Error
- **Accent Yellow**: `#eab308` - Advertencia

### Tipografía
- **Display**: Inter (400, 500, 600, 700)
- **Mono**: IBM Plex Mono (para datos numéricos)

## 🔌 Integraciones

### Webhook
El sistema envía automáticamente los datos cuando el resultado es "Ley Segunda Oportunidad":

```javascript
{
  "email": "usuario@ejemplo.com",
  "answers": {
    "question1": "SÍ",
    "question2": "NO",
    "question3": "SÍ"
  },
  "result": "LEY_SEGUNDA_OPORTUNIDAD",
  "timestamp": "2026-01-05T10:30:00Z"
}
```

### HubSpot (Opcional)
Configurar la integración en `src/js/main.js` función `handleLeadSubmit()`.

## 📦 Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 🧪 Testing

Para probar diferentes escenarios, usa la URL con parámetro email:

```
http://localhost:3000/?email=test@ejemplo.com
```

## 📝 Personalización

### Modificar preguntas
Edita el array `QUESTIONS` en [src/js/main.js](src/js/main.js)

### Cambiar textos de resultados
Modifica la función `calculateResult()` en [src/js/main.js](src/js/main.js)

### Ajustar estilos
Personaliza en [tailwind.config.js](tailwind.config.js) o [src/css/styles.css](src/css/styles.css)

## 📄 Licencia

MIT

## 👥 Soporte

Para más información, consulta [agent.md](agent.md) con todas las especificaciones técnicas.
