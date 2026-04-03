# 🪟 DESGLOSE PRO V2.0.0

**Sistema profesional de cálculo para carpintería de aluminio**

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.11-646cff?logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.11.0-ffca28?logo=firebase)](https://firebase.google.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-7952b3?logo=bootstrap)](https://getbootstrap.com/)

## 📋 Descripción

Aplicación profesional para talleres de aluminio que calcula automáticamente todas las piezas necesarias para fabricar:

- ✅ **Ventana P-92** (2, 3 y 4 hojas)
- ✅ **Ventana P-65** (2, 3 y 4 hojas)
- ✅ **Ventana TRADICIONAL** (2, 3 y 4 hojas)
- ✅ **Puerta Comercial** (Simple)

## ✨ Características

- 📐 **Cálculo preciso** con fracciones (1/16 de pulgada)
- 🔄 **Múltiples sistemas** en una sola interfaz
- 📊 **Tabla de desglose profesional**
- 🖨️ **Impresión directa** con formato profesional
- 📄 **Exportación a PDF**
- 👥 **Sistema de usuarios** con Firebase Auth
- 👑 **Panel de administración** para gestionar usuarios
- 🔒 **Control de acceso** (usuarios bloqueados/activos)
- 📱 **Diseño responsive** (funciona en móvil, tablet y PC)
- 🎨 **Interfaz moderna** con Bootstrap 5

## 🚀 Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18.2.0 | Framework frontend |
| Vite | 5.4.11 | Build tool |
| Firebase | 10.11.0 | Auth + Database |
| Bootstrap | 5.3.3 | UI Components |
| html2pdf.js | 0.10.1 | Exportación PDF |

## 📁 Estructura del proyecto

desglose-v2/
├── public/
│ ├── favicon.svg
│ ├── manifest.json
│ ├── sw.js
│ └── robots.txt
├── src/
│ ├── app/
│ │ ├── App.jsx
│ │ └── routes.jsx
│ ├── components/
│ │ ├── Navbar.jsx
│ │ ├── FormInputs.jsx
│ │ ├── TableResults.jsx
│ │ └── ProtectedRoute.jsx
│ ├── pages/
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ ├── Dashboard.jsx
│ │ ├── Calculator.jsx
│ │ └── Admin.jsx
│ ├── systems/
│ │ ├── p92.js
│ │ ├── p65.js
│ │ ├── tradicional.js
│ │ └── puerta-comercial.js
│ ├── services/
│ │ ├── firebase.js
│ │ ├── authService.js
│ │ └── userService.js
│ ├── context/
│ │ └── AuthContext.jsx
│ ├── utils/
│ │ └── fraction.js
│ └── styles/
│ └── main.css
├── .env
├── .gitignore
├── package.json
├── vite.config.js
└── README.md

text

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/christopher801/desglose-pro.git
cd desglose-v2

# Instalar dependencias
npm install

# Configurar Firebase (crear archivo .env)
cp .env.example .env

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la construcción
npm run preview
🔧 Configuración de Firebase
Crea un proyecto en Firebase Console

Activa Authentication (Email/Password)

Activa Firestore Database

Copia la configuración en .env:

env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
📱 Uso
Para usuarios normales:
Regístrate con email y contraseña

Espera a que el administrador active tu cuenta

Una vez activada, selecciona el sistema (P-92, P-65, TRADICIONAL o PUERTA)

Ingresa las medidas (ANCHO y ALTO)

Haz clic en AGREGAR para añadir al desglose

Usa PRINT o EXPORT PDF para obtener el desglose profesional

Para administradores:
Inicia sesión con cuenta de administrador

Ve al panel de administración (/admin)

Activa o bloquea usuarios según sea necesario


👨‍💻 Autor
Christopher

✧ 2026 ✧

📝 Licencia
Este proyecto es para uso profesional en talleres de carpintería de aluminio.

🤝 Contribuciones
Las contribuciones son bienvenidas. Por favor abre un issue primero para discutir los cambios.

📧 Contacto
Para soporte o consultas, contacta al administrador del sistema.

KREYE PA CHRISTOPHER
