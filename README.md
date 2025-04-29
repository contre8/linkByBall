# LinkByBall

LinkByBall es una plataforma web que conecta a futbolistas, entrenadores y clubes de fútbol. La aplicación facilita la búsqueda de oportunidades deportivas y el networking en el mundo del fútbol.

## Características Principales

- **Múltiples Tipos de Usuario:**
  - Futbolistas: Pueden buscar clubes y oportunidades deportivas
  - Entrenadores: Pueden encontrar equipos y oportunidades laborales
  - Clubes: Pueden publicar vacantes y buscar talento

- **Funcionalidades:**
  - Sistema de búsqueda avanzada con filtros por tipo de perfil
  - Gestión de vacantes para clubes
  - Sistema de solicitudes para futbolistas y entrenadores
  - Perfiles detallados con información deportiva
  - Sistema de chat integrado para comunicación directa
  - Sistema de favoritos para guardar perfiles de interés

## Requisitos Técnicos

- Node.js (versión recomendada: 18.x o superior)
- Angular CLI versión 18.2.1
- Conexión a Internet para acceder a servicios externos

## Configuración del Entorno de Desarrollo

1. **Instalación de Dependencias:**
   ```bash
   npm install
   ```

2. **Variables de Entorno:**
   - El proyecto utiliza dos entornos:
     - Desarrollo: `environment.dev.ts` (localhost:8000)
     - Producción: `environment.prod.ts` (linkbyball-backend.onrender.com)

## Servidor de Desarrollo

Ejecuta `ng serve` para iniciar el servidor de desarrollo. Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

## Generación de Código

Ejecuta `ng generate component nombre-componente` para generar un nuevo componente. También puedes usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Compilación

Ejecuta `ng build` para compilar el proyecto. Los archivos de compilación se almacenarán en el directorio `dist/`.

## Pruebas Unitarias

Ejecuta `ng test` para ejecutar las pruebas unitarias a través de [Karma](https://karma-runner.github.io).

## Pruebas End-to-End

Ejecuta `ng e2e` para ejecutar las pruebas end-to-end a través de la plataforma que elijas. Para usar este comando, primero debes agregar un paquete que implemente capacidades de pruebas end-to-end.

## Tecnologías Utilizadas

- Angular 18.2.1
- Angular Material
- Bootstrap 5.3.0
- Font Awesome
- Socket.io (para chat en tiempo real)
- Cloudinary (para gestión de imágenes)

## Ayuda Adicional

Para obtener más ayuda sobre Angular CLI, usa `ng help` o consulta la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
