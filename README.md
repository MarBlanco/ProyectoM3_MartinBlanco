# Chatea con tu personaje favorito

Proyecto Integrador del Módulo 3 de Henry.

Autor: Martín Blanco

---

## 🚀 Demo en producción

**Aplicación:**  
https://proyecto-m3-martin-blanco.vercel.app

---

## 📋 Descripción

Aplicación web SPA que permite conversar con diferentes personajes utilizando Google Gemini AI.

El usuario puede seleccionar un personaje y mantener una conversación respetando la personalidad definida para cada uno.

La aplicación utiliza el sistema de navegación SPA mediante History API y se encuentra desplegada en Vercel.

---

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Google Gemini AI
- Vercel Serverless Functions
- Vercel
- Vitest
- Git
- GitHub

---

## ✨ Funcionalidades

- Navegación SPA sin recargar la página.
- Rutas Home, Chat y About.
- Cuatro personajes disponibles.
- Personalidad propia para cada personaje.
- Conversación con Google Gemini AI.
- Historial de conversación durante la sesión.
- Indicador de carga mientras Gemini responde.
- Manejo de errores de la API.
- Botones de reintento ante errores.
- Navegación con los botones Atrás y Adelante del navegador.
- Diseño responsive Mobile First.
- API Key protegida mediante variables de entorno.
- Integración con Vercel Serverless Functions.
- Tests unitarios con Vitest.

---

## 🤖 Personajes

La aplicación permite conversar con:

- Master Yoda
- Luke Skywalker
- Darth Vader
- Jar Jar Binks

Cada personaje cuenta con una personalidad específica que se utiliza como contexto para generar las respuestas de Gemini.

---

## 📁 Estructura del proyecto

```text
ProyectoM3_MartinBlanco/
├── api/
│   └── chat.js                  # Serverless Function para Gemini
│
├── src/
│   ├── app.js                   # Lógica principal de la aplicación
│   ├── chatApi.js               # Cliente para la API de chat
│   ├── characters.js            # Datos y personalidad de personajes
│   ├── index.html               # HTML principal
│   ├── router.js                # Routing SPA con History API
│   ├── styles.css               # Estilos responsive
│   └── images/
│       ├── yoda.jpg
│       ├── luke.jpg
│       ├── vader.jpg
│       └── jar_jar.jpg
│
├── tests/
│   ├── setup.test.js
│   ├── router.test.js
│   ├── characters.test.js
│   └── chatApi.test.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── vercel.json

⚙️ Instalación
1. Clonar el repositorio
git clone https://github.com/MarBlanco/ProyectoM3_MartinBlanco.git
2. Ingresar al proyecto
cd ProyectoM3_MartinBlanco
3. Instalar las dependencias
npm install
🔐 Variables de entorno

Crear un archivo .env en la raíz del proyecto tomando como referencia .env.example.

GEMINI_API_KEY=tu_api_key

La API Key de Gemini nunca debe estar expuesta en el frontend ni subirse al repositorio.

La aplicación utiliza:

process.env.GEMINI_API_KEY

desde la Serverless Function de Vercel.

▶️ Ejecutar la aplicación localmente

Para ejecutar el proyecto utilizando Vercel:

vercel dev

La aplicación estará disponible en:

http://localhost:3000
🧪 Ejecutar los tests

Para ejecutar los tests:

npm test -- --run

El proyecto cuenta con:

Tests de configuración de Vitest.
Tests del routing.
Tests de los personajes.
Tests del cliente de chat.
Tests de manejo de errores.
Tests de errores de conexión.

Resultado actual:

4 test files passed
11 tests passed
🧭 Routing

La aplicación utiliza History API para implementar una SPA.

Rutas principales:

Ruta	Vista
/	Home
/home	Home
/chat	Chat
/about	About

La navegación se realiza sin recargar la página.

🤖 Integración con Gemini

El flujo de comunicación es:

Usuario
   ↓
Frontend
   ↓
/api/chat
   ↓
Vercel Serverless Function
   ↓
Google Gemini AI
   ↓
Respuesta
   ↓
Frontend
   ↓
Chat

La personalidad del personaje seleccionado se envía al backend como contexto para Gemini.

El historial de conversación también se utiliza para mantener el contexto durante la sesión.

🚀 Deployment en Vercel

La aplicación está desplegada en Vercel.

URL de producción

https://proyecto-m3-martin-blanco.vercel.app

Variables de entorno

En Vercel se configura:

GEMINI_API_KEY

como variable de entorno de producción.

La API Key no forma parte del código fuente ni del repositorio.

🧪 Testing

Los tests fueron desarrollados utilizando Vitest.

Se aplicaron pruebas sobre:

Routing.
Datos de los personajes.
Envío de mensajes.
Respuestas correctas de la API.
Errores HTTP.
Errores de conexión.

Los tests utilizan mocks para simular las llamadas externas mediante fetch.

Los tests actuales pasan correctamente:

4 test files passed
11 tests passed
🤖 Registro de uso de IA

Durante el desarrollo del proyecto se utilizó ChatGPT como herramienta de apoyo para:

Comprender conceptos de JavaScript asíncrono y Fetch API.
Comprender el funcionamiento de APIs REST.
Integrar una API de inteligencia artificial.
Comprender la comunicación con Google Gemini.
Comprender el uso de API Keys y variables de entorno.
Implementar Serverless Functions en Vercel.
Crear y revisar tests unitarios.
Resolver errores durante el desarrollo.
Revisar y mejorar la documentación del proyecto.

Todas las respuestas fueron analizadas, adaptadas y verificadas antes de incorporarlas al proyecto.

👨‍💻 Autor

Martín Blanco

Proyecto Integrador — Módulo 3
Henry Full Stack Developer