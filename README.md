# ChatWars

## Chatea con tu personaje favorito

[🚀 **Ver aplicación en producción**](https://proyecto-m3-martin-blanco.vercel.app)  
[💻 **Ver repositorio en GitHub**](https://github.com/MarBlanco/ProyectoM3_MartinBlanco)

---

## 📋 Descripción

ChatWars es una aplicación web **SPA (Single Page Application)** desarrollada como Proyecto Integrador del **Módulo 3 de Henry Full Stack**.

La aplicación permite conversar con diferentes personajes del universo de Star Wars mediante **Google Gemini AI**, manteniendo una personalidad específica para cada personaje y un historial independiente de conversación.

El proyecto integra:

- Navegación SPA mediante **History API**.
- Consumo de APIs mediante **Fetch API**.
- Integración con **Google Gemini AI**.
- **Vercel Serverless Functions** para proteger la API Key.
- Persistencia de conversaciones mediante `localStorage`.
- Reconocimiento de voz.
- Diseño responsive Mobile First.
- Tests unitarios con **Vitest**.
- Deployment en **Vercel**.

---

# ✨ Características principales

- 🏠 Navegación SPA sin recargar la página.
- 💬 Conversaciones con personajes mediante Gemini AI.
- 🤖 Personalidad específica para cada personaje.
- 💾 Persistencia de conversaciones mediante `localStorage`.
- 🧠 Historial independiente para cada personaje.
- ⌨️ Efecto de escritura en las respuestas.
- 🔄 Botón de reintento ante errores.
- 🎤 Reconocimiento de voz en español argentino.
- 📜 Autoscroll automático de la conversación.
- ⏳ Indicador visual mientras Gemini responde.
- 📱 Diseño responsive Mobile First.
- 🔐 API Key protegida mediante variables de entorno.
- ⚡ Backend mediante Vercel Serverless Function.
- 🧪 Tests unitarios con Vitest.
- 🌐 Navegación compatible con los botones Atrás y Adelante del navegador.

---

# 💬 Experiencia de chat

La interfaz de chat está diseñada para mantener una conversación independiente con cada personaje.

### Conversaciones

Cada personaje mantiene su propio historial.

Las conversaciones se almacenan en:

```text
localStorage
└── chatwars-conversations
```

La aplicación conserva hasta los últimos **50 mensajes** de cada conversación.

### Funcionalidades del chat

- Selección de personaje.
- Lista de conversaciones.
- Última actividad de cada conversación.
- Historial independiente por personaje.
- Mensajes diferenciados entre usuario y personaje.
- Efecto de escritura de las respuestas.
- Autoscroll automático.
- Indicador de respuesta.
- Manejo de errores.
- Botón de reintento.
- Reconocimiento de voz mediante `SpeechRecognition` / `webkitSpeechRecognition`.

El reconocimiento de voz utiliza:

```text
es-AR
```

---

# 🤖 Personajes

La aplicación permite conversar con cuatro personajes:

| Personaje | Personalidad |
|---|---|
| Master Yoda | Personalidad definida para responder como Yoda |
| Luke Skywalker | Personalidad definida para responder como Luke |
| Darth Vader | Personalidad definida para responder como Vader |
| Jar Jar Binks | Personalidad definida para responder como Jar Jar |

La personalidad de cada personaje se encuentra definida en:

```text
src/characters.js
```

Esta información se utiliza como contexto para generar las respuestas mediante Gemini.

---

# 📱 Responsive Design

El proyecto utiliza un enfoque **Mobile First** y adapta la interfaz a diferentes tamaños de pantalla.

### 📱 Mobile

En dispositivos móviles:

- La lista de personajes ocupa la pantalla.
- Al seleccionar un personaje se muestra la conversación.
- Se puede volver a la lista mediante el botón de regreso.
- La navegación inferior permanece disponible.
- La interfaz utiliza un comportamiento similar al de una aplicación de mensajería.

### 📲 Tablet

En tablet:

- La lista de personajes se mantiene a la izquierda.
- La conversación aparece a la derecha.
- Ambas áreas ocupan todo el ancho disponible.
- Los encabezados permanecen alineados.
- El área de mensajes y el composer se adaptan al espacio disponible.

### 🖥️ Desktop

En escritorio:

- El chat utiliza todo el ancho disponible.
- La lista y la conversación permanecen visibles simultáneamente.
- Home y About mantienen su estructura de contenido.
- La interfaz aprovecha el espacio horizontal disponible.

---

# 🧠 Arquitectura

El flujo principal de comunicación con Gemini es:

```text
┌──────────────────────┐
│      Frontend        │
│  HTML / CSS / JS     │
└──────────┬───────────┘
           │
           │ POST /api/chat
           ▼
┌──────────────────────┐
│ Vercel Serverless    │
│      Function        │
│      /api/chat       │
└──────────┬───────────┘
           │
           │ API Key
           ▼
┌──────────────────────┐
│    Google Gemini     │
│         AI           │
└──────────┬───────────┘
           │
           │ Response
           ▼
┌──────────────────────┐
│      Frontend        │
│    ChatWars UI       │
└──────────────────────┘
```

La API Key de Gemini permanece en el servidor mediante una variable de entorno.

Nunca se expone directamente en el código del frontend.

---

# 🔄 Flujo de una conversación

El flujo de una conversación es:

```text
1. Usuario selecciona un personaje
        ↓
2. Se carga su conversación
        ↓
3. Usuario escribe o dicta un mensaje
        ↓
4. Frontend prepara mensaje + historial + personalidad
        ↓
5. Frontend realiza POST /api/chat
        ↓
6. Vercel ejecuta la Serverless Function
        ↓
7. La función utiliza GEMINI_API_KEY
        ↓
8. Gemini genera la respuesta
        ↓
9. Serverless Function devuelve la respuesta
        ↓
10. Frontend actualiza la conversación
        ↓
11. La conversación se guarda en localStorage
```

---

# 🛠️ Tecnologías utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript
- History API
- Fetch API
- Web Speech API
- localStorage

### Backend / API

- Node.js
- Vercel Serverless Functions
- Google Gemini AI

### Testing

- Vitest
- Fetch mocks

### Deployment

- Vercel

### Control de versiones

- Git
- GitHub

---

# 📁 Estructura del proyecto

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
│   │
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
```

---

# ⚙️ Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/MarBlanco/ProyectoM3_MartinBlanco.git
```

## 2. Ingresar al proyecto

```bash
cd ProyectoM3_MartinBlanco
```

## 3. Instalar dependencias

```bash
npm install
```

---

# 🔐 Variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

```env
GEMINI_API_KEY=tu_api_key
```

La API Key de Gemini **nunca debe estar expuesta en el frontend ni subirse al repositorio**.

La Serverless Function accede a la variable mediante:

```javascript
process.env.GEMINI_API_KEY
```

De esta manera, la credencial permanece del lado del servidor.

---

# ▶️ Ejecutar la aplicación localmente

Para ejecutar el proyecto utilizando el entorno de Vercel:

```bash
vercel dev
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

---

# 🧪 Testing

El proyecto utiliza **Vitest** para realizar tests unitarios.

Para ejecutar los tests:

```bash
npm test -- --run
```

Actualmente se encuentran implementadas pruebas para:

- Configuración de Vitest.
- Routing.
- Datos de personajes.
- Envío de mensajes.
- Respuestas correctas de la API.
- Errores HTTP.
- Errores de conexión.
- Mocks de llamadas externas mediante `fetch`.

### Resultado actual

```text
4 test files passed
11 tests passed
```

---

# 🧭 Routing

ChatWars utiliza **History API** para implementar una navegación SPA.

### Rutas disponibles

| Ruta | Vista |
|---|---|
| `/` | Home |
| `/home` | Home |
| `/chat` | Chat |
| `/about` | About |

La navegación se realiza sin recargar completamente la página.

El sistema utiliza:

- `pushState`
- `popstate`
- Tabla de rutas
- Renderizado dinámico de vistas

Esto permite mantener una experiencia de aplicación de una sola página.

---

# 🤖 Integración con Gemini

La integración con Gemini se realiza mediante una arquitectura cliente-servidor.

El frontend no realiza directamente la llamada utilizando la API Key.

### Flujo

```text
Frontend
   ↓
POST /api/chat
   ↓
Vercel Serverless Function
   ↓
Google Gemini AI
   ↓
Respuesta
   ↓
Frontend
```

La petición contiene la información necesaria para mantener el contexto de la conversación, incluyendo:

- Mensaje del usuario.
- Historial.
- Personalidad del personaje.

La Serverless Function utiliza:

```javascript
process.env.GEMINI_API_KEY
```

para realizar la comunicación con Gemini.

---

# 🔄 Manejo de errores

La aplicación contempla diferentes situaciones de error.

Entre ellas:

- Errores HTTP.
- Errores de conexión.
- Problemas al comunicarse con Gemini.
- Respuestas inválidas.

Cuando ocurre un problema, el usuario recibe un mensaje indicando que el personaje está teniendo problemas para responder y puede utilizar el botón **Retry** para intentar nuevamente.

Mensaje utilizado:

```text
[Personaje] está teniendo problemas para responder.
Intentá nuevamente en unos segundos.
```

---

# 💾 Persistencia de conversaciones

Las conversaciones se almacenan en `localStorage`.

Clave utilizada:

```text
chatwars-conversations
```

Esto permite conservar las conversaciones entre navegaciones dentro de la aplicación.

Cada personaje mantiene su historial independiente.

Para evitar que el almacenamiento crezca indefinidamente, se conservan hasta los últimos:

```text
50 mensajes
```

---

# ⏳ Experiencia durante la respuesta

Mientras Gemini genera una respuesta, la interfaz muestra un estado de carga.

Una vez recibida la respuesta, el mensaje se muestra mediante un efecto de escritura progresiva.

Velocidad utilizada:

```text
25 ms por carácter
```

También se realiza autoscroll para mantener visible la parte más reciente de la conversación.

---

# 🎤 Reconocimiento de voz

ChatWars incorpora reconocimiento de voz mediante:

```javascript
SpeechRecognition
```

o:

```javascript
webkitSpeechRecognition
```

El idioma utilizado es:

```text
es-AR
```

Esto permite dictar mensajes directamente desde el micrófono del dispositivo compatible.

---

# 🚀 Deployment

La aplicación está desplegada en **Vercel**.

### Producción

https://proyecto-m3-martin-blanco.vercel.app

### Variable de entorno

```text
GEMINI_API_KEY
```

La variable se configura en el entorno de Vercel y no forma parte del código fuente público.

---

# 🧩 Conceptos aplicados

Durante el desarrollo del proyecto se aplicaron conceptos trabajados durante el Módulo 3 de Henry:

- Responsive Design.
- Mobile First.
- History API.
- SPA Routing.
- `pushState`.
- `popstate`.
- JavaScript asíncrono.
- Promises.
- `async / await`.
- Fetch API.
- APIs REST.
- Manejo de respuestas HTTP.
- Integración con APIs de Inteligencia Artificial.
- API Keys.
- Variables de entorno.
- Vercel Serverless Functions.
- Testing unitario.
- Mocks.
- Deployment.
- Persistencia con `localStorage`.

---

# 🤖 Uso de herramientas de IA

Durante el desarrollo se utilizaron herramientas de Inteligencia Artificial como apoyo al proceso de aprendizaje y desarrollo.

Se utilizaron principalmente para:

- Comprender JavaScript asíncrono y Fetch API.
- Analizar conceptos relacionados con APIs REST.
- Comprender la integración con APIs de Inteligencia Artificial.
- Trabajar con Google Gemini.
- Comprender el manejo de API Keys y variables de entorno.
- Implementar y comprender Serverless Functions.
- Analizar errores durante el desarrollo.
- Trabajar con tests.
- Revisar y mejorar documentación.

Las soluciones propuestas mediante herramientas de IA fueron analizadas, adaptadas y verificadas antes de incorporarse al proyecto.

---

# 🎓 Proyecto Integrador — Henry

Este proyecto fue desarrollado como parte del:

**Módulo 3 — Henry Full Stack Developer**

El objetivo principal fue integrar los conceptos aprendidos durante el módulo en una aplicación funcional, incorporando frontend, consumo de APIs, integración con Inteligencia Artificial, manejo seguro de credenciales, testing y deployment.

---

# 👨‍💻 Autor

**Martín Blanco**

Proyecto Integrador — Módulo 3

**Henry Full Stack Developer**