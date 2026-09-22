import { characters } from "./characters.js";
import { getRoute } from "./router.js";
import { sendChatMessage } from "./chatApi.js";

const app = document.querySelector("#app");

let selectedCharacter = null;
let chatStatus = "idle";
let isListening = false;

const STORAGE_KEY = "chatwars-conversations";

const conversations =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;

function saveConversations() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(conversations)
    );
}

function scrollMessagesToBottom() {
    const messagesContainer =
        document.querySelector(".chat-messages");

    if (!messagesContainer) {
        return;
    }

    requestAnimationFrame(() => {
        messagesContainer.scrollTop =
            messagesContainer.scrollHeight;
    });
}

function createCharacterCard(character) {
    return `
        <article class="character-card character-card--${character.theme}">
            <img src="${character.image}" alt="${character.name}">

            <div class="character-card__content">
                <h3>${character.name}</h3>
                <p>${character.description}</p>

                <button
                    type="button"
                    class="character-card__button"
                    data-character-id="${character.id}"
                    aria-label="Hablar con ${character.name}"
                >
                    Hablar
                </button>
            </div>
        </article>
    `;
}

function renderHome() {
    app.innerHTML = `
        <section class="home">
            <div class="character-grid">
                ${characters.map(createCharacterCard).join("")}
            </div>
        </section>
    `;
}

function renderChatList() {
    const orderedCharacters = [...characters].sort((a, b) => {
        const messagesA = conversations[a.id] || [];
        const messagesB = conversations[b.id] || [];

        const lastMessageA =
            messagesA[messagesA.length - 1];

        const lastMessageB =
            messagesB[messagesB.length - 1];

        if (!lastMessageA && !lastMessageB) {
            return 0;
        }

        if (!lastMessageA) {
            return 1;
        }

        if (!lastMessageB) {
            return -1;
        }

        return (
            lastMessageB.timestamp -
            lastMessageA.timestamp
        );
    });

    return `
        <aside class="chat-list">

            <header class="chat-list__header">
                <div>
                    <h1>Chats</h1>
                    <p>Elegí un personaje para continuar</p>
                </div>

                <span
                    class="chat-list__icon"
                    aria-hidden="true"
                >
                    ✦
                </span>
            </header>

            <div class="chat-list__items">

                ${orderedCharacters.map((character) => {
                    const messages =
                        conversations[character.id] || [];

                    const lastMessage =
                        messages[messages.length - 1];

                    const preview = lastMessage
                        ? lastMessage.content
                        : "Todavía no hay mensajes";

                    return `
                        <button
                            type="button"
                            class="
                                chat-list__item
                                ${
                                    selectedCharacter?.id ===
                                    character.id
                                        ? "chat-list__item--active"
                                        : ""
                                }
                            "
                            data-chat-character-id="${character.id}"
                            aria-label="Abrir chat con ${character.name}"
                        >

                            <img
                                src="${character.image}"
                                alt=""
                                class="chat-list__avatar"
                            >

                            <span class="chat-list__info">
                                <strong>
                                    ${character.name.replace(
                                        "Master ",
                                        ""
                                    )}
                                </strong>

                                <span>
                                    ${preview}
                                </span>
                            </span>

                            <span class="chat-list__time">
                                ${
                                    lastMessage
                                        ? "Ahora"
                                        : ""
                                }
                            </span>

                        </button>
                    `;
                }).join("")}

            </div>

        </aside>
    `;
}

function renderMessages() {
    if (!selectedCharacter) {
        return "";
    }

    const messages =
        conversations[selectedCharacter.id] || [];

    return messages
        .map((message) => {
            return `
                <div
                    class="chat-message chat-message--${message.role}"
                    aria-label="${
                        message.role === "user"
                            ? "Tu mensaje"
                            : `${selectedCharacter.name} respondió`
                    }"
                >
                    <p>${message.content}</p>
                </div>
            `;
        })
        .join("");
}

function renderTypingIndicator() {
    if (
        !selectedCharacter ||
        chatStatus !== "loading"
    ) {
        return "";
    }

    const characterName =
        selectedCharacter.name.replace(
            "Master ",
            ""
        );

    return `
        <div
            class="chat-typing"
            role="status"
            aria-live="polite"
        >
            <span>
                ${characterName} está escribiendo
            </span>

            <span
                class="chat-typing__dots"
                aria-hidden="true"
            >
                <span></span>
                <span></span>
                <span></span>
            </span>
        </div>
    `;
}

function renderErrorMessage() {
    if (
        !selectedCharacter ||
        chatStatus !== "error"
    ) {
        return "";
    }

    const characterName =
        selectedCharacter.name.replace(
            "Master ",
            ""
        );

    return `
        <div
            class="chat-error"
            role="alert"
        >
            <p>
                ${characterName} está teniendo problemas para responder.
                Intentá nuevamente en unos segundos.
            </p>

            <button
                type="button"
                class="chat-retry-button"
                aria-label="Reintentar último mensaje"
            >
                Reintentar
            </button>
        </div>
    `;
}

function renderConversation() {
    if (!selectedCharacter) {
        return `
            <section
                class="chat-empty"
                aria-label="Selección de personaje"
            >
                <div class="chat-empty__content">

                    <div
                        class="chat-empty__icon"
                        aria-hidden="true"
                    >
                        ✦
                    </div>

                    <h2>Elegí un personaje</h2>

                    <p>
                        Seleccioná un personaje para comenzar o continuar
                        una conversación.
                    </p>

                </div>
            </section>
        `;
    }

    return `
        <section
            class="chat-conversation"
            style="--character-background: url('${selectedCharacter.image}')"
        >

            <header class="chat-header">

                <button
                    type="button"
                    class="chat-mobile-back-button"
                    aria-label="Volver a la lista de chats"
                >
                    ←
                </button>

                <div
                    class="chat-character"
                    aria-label="Conversación con ${selectedCharacter.name}"
                >
                    <img
                        src="${selectedCharacter.image}"
                        alt=""
                    >

                    <div>
                        <strong>
                            ${selectedCharacter.name.replace(
                                "Master ",
                                ""
                            )}
                        </strong>

                        <span>
                            En línea
                        </span>
                    </div>
                </div>

            </header>

            <div
                class="chat-messages"
                aria-live="polite"
                aria-label="Mensajes de la conversación"
            >

                ${renderMessages()}

                ${renderTypingIndicator()}

                ${renderErrorMessage()}

            </div>

            <form
                class="chat-composer"
                aria-label="Enviar mensaje"
            >

                <input
                    type="text"
                    class="chat-input"
                    placeholder="Escribí un mensaje..."
                    autocomplete="off"
                    aria-label="Escribí un mensaje"
                    ${
                        chatStatus === "loading"
                            ? "disabled"
                            : ""
                    }
                >

                <button
                    type="button"
                    class="chat-send-button"
                    data-voice-button
                    aria-label="${
                        isListening
                            ? "Dejar de escuchar"
                            : "Hablar por voz"
                    }"
                    title="${
                        isListening
                            ? "Escuchando..."
                            : "Hablar por voz"
                    }"
                    ${
                        chatStatus === "loading"
                            ? "disabled"
                            : ""
                    }
                >
                    <span aria-hidden="true">
                        ${isListening ? "🔴" : "🎙️"}
                    </span>
                </button>

                <button
                    type="submit"
                    class="chat-send-button"
                    aria-label="Enviar mensaje"
                    ${
                        chatStatus === "loading"
                            ? "disabled"
                            : ""
                    }
                >
                    <span aria-hidden="true">
                        ➤
                    </span>
                </button>

            </form>

        </section>
    `;
}

function renderChat() {
    app.innerHTML = `
        <section class="chat-layout">

            ${renderChatList()}

            ${renderConversation()}

        </section>
    `;

    scrollMessagesToBottom();
}

function renderAbout() {
    app.innerHTML = `
        <section
            class="about-opening"
            aria-label="Acerca de ChatWars"
        >

            <div
                class="about-stars"
                aria-hidden="true"
            ></div>

            <button
                type="button"
                class="about-skip-button"
                data-about-skip
            >
                Saltar intro
            </button>

            <div class="about-intro">
                <p>
                    Hace mucho tiempo, en una galaxia muy, muy lejana...
                </p>
            </div>

            <div
                class="about-crawl"
                aria-live="polite"
            >
                <div class="about-crawl__content">

                    <h1>CHATWARS</h1>

                    <h2>
                        Proyecto Integrador — Henry Full Stack
                    </h2>

                    <p>
                        En este proyecto se desarrolló una SPA interactiva
                        que permite conversar con personajes del universo
                        de Star Wars mediante inteligencia artificial.
                    </p>

                    <p>
                        La aplicación utiliza JavaScript para construir una
                        navegación SPA mediante History API, permitiendo
                        cambiar entre las distintas vistas sin recargar la página.
                    </p>

                    <p>
                        Los usuarios pueden elegir entre diferentes personajes
                        y mantener conversaciones con ellos. Cada conversación
                        puede conservarse localmente para continuarla más tarde.
                    </p>

                    <p>
                        Las respuestas son generadas mediante la API de Gemini.
                        Para proteger la API Key, la comunicación con Gemini pasa
                        por una función Serverless desplegada en Vercel.
                    </p>

                    <p>
                        El proyecto incorpora programación asíncrona, Fetch API,
                        manejo de estados de carga y error, LocalStorage y
                        reconocimiento de voz cuando el navegador lo permite.
                    </p>

                    <p>
                        La interfaz fue desarrollada con diseño responsive para
                        adaptarse a dispositivos móviles, tablets y desktop.
                    </p>

                    <p class="about-crawl__final">
                        ChatWars.<br>
                        Una experiencia interactiva para explorar una galaxia
                        muy, muy lejana.
                    </p>

                </div>
            </div>

            <div class="about-end">

                <div class="about-end__content">

                    <h2>CHATWARS</h2>

                    <p>
                        Elegí tu personaje. Iniciá la conversación.
                    </p>

                    <button
                        type="button"
                        class="about-start-button"
                        data-about-start
                    >
                        Comenzar misión
                    </button>

                </div>

            </div>

        </section>
    `;

    window.setTimeout(() => {
        document
            .querySelector(".about-opening")
            ?.classList.add(
                "about-opening--complete"
            );
    }, 31000);
}

function addUserMessage(message) {
    if (!selectedCharacter) {
        return;
    }

    conversations[selectedCharacter.id].push({
        role: "user",
        content: message,
        timestamp: Date.now()
    });

    conversations[selectedCharacter.id] =
        conversations[selectedCharacter.id].slice(-50);

    saveConversations();
}

function renderCharacterMessage(
    messageElement,
    text
) {
    let index = 0;

    const interval = setInterval(() => {
        messageElement.textContent +=
            text[index];

        index++;

        scrollMessagesToBottom();

        if (index >= text.length) {
            clearInterval(interval);
        }
    }, 25);
}

async function sendMessage(message) {
    if (!selectedCharacter) {
        return;
    }

    chatStatus = "loading";

    renderChat();

    try {
        const data = await sendChatMessage(
            message,
            conversations[selectedCharacter.id],
            selectedCharacter.personality
        );

        conversations[selectedCharacter.id].push({
            role: "character",
            content: data.reply,
            timestamp: Date.now()
        });

        conversations[selectedCharacter.id] =
            conversations[selectedCharacter.id].slice(-50);

        saveConversations();

        chatStatus = "idle";

        renderChat();

        const messagesContainer =
            document.querySelector(
                ".chat-messages"
            );

        const characterMessages =
            messagesContainer?.querySelectorAll(
                ".chat-message--character"
            );

        const lastMessage =
            characterMessages?.[
                characterMessages.length - 1
            ];

        const messageText =
            lastMessage?.querySelector("p");

        if (messageText) {
            messageText.textContent = "";

            renderCharacterMessage(
                messageText,
                data.reply
            );
        }

    } catch (error) {
        console.error(
            "Error sending message:",
            error
        );

        chatStatus = "error";

        renderChat();
    }
}

function retryLastMessage() {
    if (!selectedCharacter) {
        return;
    }

    const messages =
        conversations[selectedCharacter.id];

    const lastMessage =
        messages[messages.length - 1];

    if (
        !lastMessage ||
        lastMessage.role !== "user"
    ) {
        return;
    }

    sendMessage(lastMessage.content);
}

function selectCharacter(characterId) {
    const character = characters.find(
        (item) => item.id === characterId
    );

    if (!character) {
        return;
    }

    selectedCharacter = character;

    if (!conversations[characterId]) {
        conversations[characterId] = [];
    }

    chatStatus = "idle";

    renderChat();
}

function startVoiceRecognition() {
    if (!recognition) {
        alert(
            "El reconocimiento de voz no está disponible en este navegador."
        );

        return;
    }

    if (!selectedCharacter) {
        return;
    }

    if (
        chatStatus === "loading" ||
        isListening
    ) {
        return;
    }

    recognition.start();
}

if (SpeechRecognition) {
    recognition =
        new SpeechRecognition();

    recognition.lang = "es-AR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isListening = true;

        renderChat();
    };

    recognition.onend = () => {
        isListening = false;

        renderChat();
    };

    recognition.onerror = (event) => {
        console.error(
            "Error de reconocimiento de voz:",
            event.error
        );

        isListening = false;

        renderChat();
    };

    recognition.onresult = (event) => {
        const transcript =
            event.results[0][0]
                .transcript
                .trim();

        if (
            !transcript ||
            !selectedCharacter
        ) {
            return;
        }

        addUserMessage(transcript);

        renderChat();

        sendMessage(transcript);
    };
}

function router() {
    const route =
        getRoute(
            window.location.pathname
        );

    switch (route) {
        case "chat":
            renderChat();
            break;

        case "about":
            renderAbout();
            break;

        case "home":
        default:
            renderHome();
            break;
    }

    updateActiveNavigation(route);
}

function updateActiveNavigation(route) {
    const navigationLinks =
        document.querySelectorAll(
            ".app-navigation a"
        );

    navigationLinks.forEach((link) => {
        const path =
            link.getAttribute("href");

        const isActive =
            (route === "home" && path === "/") ||
            (route === "chat" && path === "/chat") ||
            (route === "about" && path === "/about");

        link.classList.toggle(
            "active",
            isActive
        );

        link.setAttribute(
            "aria-current",
            isActive ? "page" : "false"
        );
    });
}

function navigate(path) {
    history.pushState(
        {},
        "",
        path
    );

    router();
}

document.addEventListener(
    "click",
    (event) => {
        const voiceButton =
            event.target.closest(
                "[data-voice-button]"
            );

        if (voiceButton) {
            if (isListening) {
                recognition?.stop();
            } else {
                startVoiceRecognition();
            }

            return;
        }

        const aboutSkipButton =
            event.target.closest(
                "[data-about-skip]"
            );

        if (aboutSkipButton) {
            document
                .querySelector(".about-opening")
                ?.classList.add(
                    "about-opening--complete"
                );

            return;
        }

        const aboutStartButton =
            event.target.closest(
                "[data-about-start]"
            );

        if (aboutStartButton) {
            navigate("/chat");

            return;
        }

        const link =
            event.target.closest(
                ".app-navigation a"
            );

        if (link) {
            event.preventDefault();

            const path =
                link.getAttribute("href");

            if (path === "/chat") {
                selectedCharacter = null;
                chatStatus = "idle";
            }

            navigate(path);

            return;
        }

        const characterButton =
            event.target.closest(
                ".character-card__button"
            );

        if (characterButton) {
            const characterId =
                characterButton.dataset
                    .characterId;

            selectCharacter(characterId);

            navigate("/chat");

            return;
        }

        const chatCharacterButton =
            event.target.closest(
                ".chat-list__item"
            );

        if (chatCharacterButton) {
            const characterId =
                chatCharacterButton.dataset
                    .chatCharacterId;

            selectCharacter(characterId);

            return;
        }

        const mobileBackButton =
            event.target.closest(
                ".chat-mobile-back-button"
            );

        if (mobileBackButton) {
            selectedCharacter = null;
            chatStatus = "idle";

            renderChat();

            return;
        }

        const retryButton =
            event.target.closest(
                ".chat-retry-button"
            );

        if (retryButton) {
            retryLastMessage();
        }
    }
);

document.addEventListener(
    "submit",
    (event) => {
        const form =
            event.target.closest(
                ".chat-composer"
            );

        if (
            !form ||
            chatStatus === "loading"
        ) {
            return;
        }

        event.preventDefault();

        if (!selectedCharacter) {
            return;
        }

        const input =
            form.querySelector(
                ".chat-input"
            );

        const message =
            input.value.trim();

        if (!message) {
            return;
        }

        input.value = "";

        addUserMessage(message);

        renderChat();

        sendMessage(message);
    }
);

window.addEventListener(
    "popstate",
    router
);

router();