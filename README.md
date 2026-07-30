![Desglose Pro](./public/banner.svg)
---

## 📋 Descripción

**Desglose Pro** es una Progressive Web App (PWA) diseñada para profesionales de carpintería de aluminio. Permite calcular con precisión los perfiles necesarios para ventanas y puertas, gestionar cotizaciones, controlar gastos y emitir facturas — todo desde cualquier dispositivo, con o sin internet.

---

## ✨ Funcionalidades

### 🧮 Sistemas de Cálculo
| Sistema | Hojas |
|---------|-------|
| Ventana P-92 | 2, 3 o 4 hojas |
| Ventana P-65 | 2, 3 o 4 hojas |
| Ventana Tradicional | 2, 3 o 4 hojas |
| Ventana P-40 Proyectada | 1 o 2 hojas |
| Puerta Comercial | Simple o Doble |
| Puerta P40 | Simple |

- Resultados precisos en fracciones de **1/16"**
- Exportación a **PDF** profesional
- Información del proyecto (Cuenta, Obra, Color)

### 💼 Gestión de Negocio
- **Cotizaciones** — Crea y da seguimiento con estados (Borrador, Enviada, Aprobada, Rechazada)
- **Gastos** — Control por categoría (Materiales, Mano de obra, Transporte, Herramientas)
- **Finanzas** — Resumen de ingresos, gastos y balance

### 🛡️ Panel de Administración
- Gestión de usuarios (Activar / Bloquear)

### 📱 PWA
- Instalable en cualquier dispositivo (Android, iOS, Desktop)
- Funciona **sin internet** (Service Worker + Cache)
- Push notifications para el administrador

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **React 18** | Framework UI |
| **Vite** | Build tool |
| **Firebase Auth** | Autenticación |
| **Firebase Firestore** | Base de datos en tiempo real |
| **Firebase Cloud Messaging** | Push notifications |
| **Firebase Cloud Functions** | Backend serverless |
| **Bootstrap Icons** | Iconografía |
| **Vercel** | Deployment |
| **GitHub** | Control de versiones |

---


---

## 🔐 Roles y Permisos

| Acción | Usuario | Admin |
|--------|---------|-------|
| Usar sistemas de cálculo | ✅ | ✅ |
| Cotizaciones, Gastos, Facturas | ✅ | ✅ |
| Ver panel de administración | ❌ | ✅ |
| Activar / Bloquear usuarios | ❌ | ✅ |
| Ver actividad de usuarios | ❌ | ✅ |
| Recibir push notifications | ❌ | ✅ |

---

## 🌐 Deploy

El proyecto está desplegado en **Vercel**:

🔗 [desglose-pro.vercel.app](https://desglose-pro.vercel.app)

---

## 📞 Contacto y Soporte

- **Email:** softwaredesglosepro@gmail.com
- **WhatsApp:** +1 (849) 485-0059
- **Instagram:** [@desglosepro](https://instagram.com/desglosepro)

---

## 📄 Licencia

Copyright © 2026 Desglose-pro. Todos los derechos reservados.

Este software es propietario y confidencial. Su copia, distribución o uso no autorizado está estrictamente prohibido.

Ver [Licencia completa](./src/pages/legal/License.jsx)