
# DocuTrack

Sistema de gestión de certificados para usuarios y administradores. Permite a los usuarios subir certificados en PDF y a los administradores revisarlos, aprobarlos o rechazarlos.



## Tecnologias Usadas

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Base de Datos:** PostgreSQL (gestionada con Supabase)
- **ORM:** Prisma
- **Autenticación:** JWT (JSON Web Tokens)
- **Otros:** Multer (subida de archivos), Axios, dotenv

## Requisitos Previos

Tener instalado:
- Node.js (recomendado v18 o superior)
- Git



## Instalacion del Proyecto

1. Clona el repositorio:

```bash
git clone https://github.com/CosminTG/DocuTrack.git
cd docutrack
```
2. Instala dependencias:
```bash
cd docutrack-backend
npm install
```
```bash
cd docutrack-frontend
npm install
```
##  Configurar variables de entorno

1. En Supabase:
- Crea un nuevo proyecto en https://supabase.com.
- Ve a la sección "Project Settings" > "Database" y copia la URL de conexión del tipo "connection string" (postgresql://...).
- Ve a "Table Editor" y crea las tablas necesarias con Prisma (ver más abajo).

2. En docutrack-backend:
- Crea un archivo .env:
```bash
cd docutrack-backend
touch .env
```
- Contenido del archivo .env:
```bash
DATABASE_URL=postgresql://usuario:password@host:puerto/nombrebasededatos
JWT_SECRET= aqui va el jwt
PORT=3001
```
##  Preparar Base de Datos
```bash
cd docutrack-backend
npx prisma generate
npx prisma migrate dev --name init
```
- Esto creará las tablas en Supabase.

## Correr la Aplicación Localmente
- Backend:
```bash
cd docutrack-backend
npm run dev
```
- Frontend:
```bash
cd docutrack-frontend
npm run dev
```
- Esto abrirá la app en http://localhost:3000

## Cuentas de prueba y creación de administradores
- Actualmente no existe una interfaz gráfica para registrar usuarios desde el frontend.
- Para agregar usuarios de prueba, sigue estos pasos desde Supabase:
    - Ve a Table Editor y abre la tabla Usuario.
    - Crea un nuevo usuario manualmente (rellena los campos email, password en texto   plano y role con USER o ADMIN).
    - Guarda los cambios

## Estructura del Proyecto
```
/docutrack
├── docutrack-backend
│   ├── src
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── routes
│   │   ├── utils
│   │   └── index.js
│   ├── prisma
│   │   └── schema.prisma
│   └── .env
├── docutrack-frontend
│   ├── src
│   │   ├── app
│   │   │   ├── login
│   │   │   ├── dashboard
│   │   │   ├── admin
│   │   └── components
│   └── public
└── README.md
```

## Funcionalidades Implementadas

**Usuario:**
- Registro y login con JWT
- Subida de certificados PDF
- Visualización del estado (pendiente, aprobado, rechazado)

**Administrador:**
- Acceso a dashboard privado
- Visualización de todos los certificados
- Aprobación o rechazo
- Descarga de los certificados PDF



## Pruebas Basicas para Validar Funcionamiento
1. Registrar un usuario desde /login
2. Iniciar sesión y subir un certificado desde /dashboard
3. En Supabase, cambiar el rol del usuario a ADMIN
4. Entrar a /admin y ver el panel de administración
5. Aprobar o rechazar certificados, descargar PDF


