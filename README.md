# 🚀 Interactive Developer Portfolio & Custom CMS

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)

Bienvenidos al código fuente de mi portafolio interactivo. Este proyecto no es solo una página web estática, sino una **aplicación web dinámica de extremo a extremo (Full-Stack)** diseñada para demostrar habilidades avanzadas en frontend, optimización de rendimiento, diseño de interfaces (UI/UX) y gestión de bases de datos serverless.

## ✨ Características Principales (Highlights)

- **🖥️ Interfaz Glassmorphism & Animaciones Avanzadas:** UI moderna construida con CSS puro y `framer-motion`. Incluye tarjetas con efectos 3D interactivos, transiciones fluidas de página y una línea de tiempo dinámica.
- **🎮 Rendimiento Optimizado (GPU-Aware):** Fondos de video cinematográficos optimizados mediante *Cloudinary* (ajuste de bitrate y resolución on-the-fly). Implementación de un sistema de *Garbage Collection/Pause* en React para suspender videos en segundo plano y mantener los FPS estables.
- **🎵 Reproductor Musical Espacial:** Un widget de música flotante alimentado por la API de **Jamendo**, que es completamente arrastrable (Draggable). Incluye "conciencia espacial": se expande inteligentemente hacia la izquierda o la derecha dependiendo de en qué mitad de la pantalla se suelte.
- **🌦️ Datos en Tiempo Real:** Integración con la API de **OpenWeather** para mostrar condiciones climáticas dinámicas según la ubicación en la tarjeta de presentación.
- **🕵️ Easter Egg y Seguridad:** Un panel de administración oculto (Dashboard) accesible únicamente mediante un doble clic en el logotipo principal, protegido por autenticación segura con contraseñas encriptadas usando `bcryptjs`.
- **📊 Sistema CMS (CRUD) Propio:** Todo el contenido del portafolio (Proyectos, Experiencia, Habilidades, Perfil) no está "hardcodeado". Proviene de una base de datos PostgreSQL Serverless. A través del Dashboard, el contenido se puede Crear, Leer, Actualizar y Eliminar (CRUD) en tiempo real con formularios generados dinámicamente según el esquema de datos.

## 🛠️ Stack Tecnológico

### Frontend
- **React.js + Vite:** Arquitectura de componentes rápidos y compilación ultrarrápida.
- **Framer Motion:** Para físicas de arrastre (drag), gestos, y animaciones de resorte (spring animations).
- **CSS Vanilla (Glassmorphism):** Diseño responsivo, efectos de desenfoque de fondo y variables CSS para tematización.
- **Lucide React:** Iconografía moderna y escalable.

### Backend & Base de Datos
- **Neon DB (PostgreSQL Serverless):** Base de datos escalable en la nube para almacenar el contenido del portafolio.
- **Drizzle ORM:** Object-Relational Mapper ligero y type-safe para ejecutar sentencias SQL desde el cliente/servidor con validación estricta de esquemas.

### APIs Externas
- **Jamendo API:** Consumo de pistas musicales *chill/electronic* sin copyright para el reproductor interactivo.
- **OpenWeather API:** Geolocalización y clima en tiempo real.
- **Cloudinary:** Content Delivery Network (CDN) para servir recursos de video transformados (`w_1280,q_auto`).

## ⚙️ Arquitectura del Dashboard (El CMS)

El proyecto incluye un motor CRUD personalizado construido desde cero. 
1. **Modelado de Datos:** `schema.js` define la estructura (Perfil, Proyectos, Experiencia).
2. **Formularios Dinámicos Inteligentes:** El Dashboard renderiza inputs text, textareas, selects o inputs procesadores de Arrays (JSONB) basándose puramente en la configuración del esquema.
3. **Persistencia:** Al guardar, Drizzle ORM inyecta los cambios directamente en Neon DB y actualiza el estado global al instante.

## 🚀 Instalación Local

Si deseas correr este proyecto en tu máquina local:

1. Clona el repositorio:
   ```bash
   git clone <repo-url>
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura tus variables de entorno en un archivo `.env`:
   ```env
   VITE_DATABASE_URL="postgres://tu-url-de-neon"
   VITE_OPENWEATHER_API="tu-api-key-de-openweather"
   ```
4. Empuja el esquema a la base de datos (Opcional, si usas Drizzle Kit):
   ```bash
   npm run db:push
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---
*Diseñado y desarrollado con pasión por crear experiencias web memorables.*
