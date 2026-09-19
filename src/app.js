import { characters } from "./characters.js";
import { getRoute } from "./router.js";
import { sendChatMessage } from "./chatApi.js";

const app = document.querySelector("#app");

let selectedCharacter = null;
let chatStatus = "idle";

const conversations = {};

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

function renderMessages() {
    if (!selectedCharacter) {
        return "";
    }

    const messages = conversations[selectedCharacter.id];

    return messages
        .map((message) => {
            return `
                <div class="chat-message chat-message--${message.role}">
                    <p>${message.content}</p>
                </div>
            `;
        })
        .join("");
}

function renderTypingIndicator() {
    if (!selectedCharacter || chatStatus !== "loading") {
        return "";
    }

    const characterName = selectedCharacter.name.replace("Master ", "");

    return `
        <div class="chat-typing">
            <span>${characterName} está escribiendo</span>

            <span class="chat-typing__dots">
                <span></span>
                <span></span>
                <span></span>
            </span>
        </div>
    `;
}

function renderErrorMessage() {
    if (!selectedCharacter || chatStatus !== "error") {
        return "";
    }

    const characterName = selectedCharacter.name.replace("Master ", "");

    return `
        <div class="chat-error">
            <p>
                ${characterName} está teniendo problemas para responder.
                Intentá nuevamente en unos segundos.
            </p>

            <button
                type="button"
                class="chat-retry-button"
            >
                Reintentar
            </button>
        </div>
    `;
}

function renderChat() {
    const character = selectedCharacter;

    app.innerHTML = `
        <section
            class="chat"
            style="--character-background: url('${character?.image || ""}')"
        >

            <header class="chat-header">

                <button
                    type="button"
                    class="chat-back-button"
                    aria-label="Volver a Inicio"
                >
                    <span>←</span>
                    <span>Chat</span>
                </button>

                ${
                    character
                        ? `
                            <div class="chat-character">
                                <img
                                    src="${character.image}"
                                    alt="${character.name}"
                                >

                                <span>
                                    ${character.name.replace("Master ", "")}
                                </span>
                            </div>
                        `
                        : ""
                }

                <button
                    type="button"
                    class="chat-options-button"
                    aria-label="Más opciones"
                >
                    ⋮
                </button>

            </header>

            <div class="chat-messages">

                ${renderMessages()}

                ${renderTypingIndicator()}

                ${renderErrorMessage()}

            </div>

            <form class="chat-composer">

                <input
                    type="text"
                    class="chat-input"
                    placeholder="Escribí tu mensaje..."
                    autocomplete="off"
                    ${chatStatus === "loading" ? "disabled" : ""}
                >

                <button
                    type="submit"
                    class="chat-send-button"
                    aria-label="Enviar mensaje"
                    ${chatStatus === "loading" ? "disabled" : ""}
                >
                    <span>➤</span>
                </button>

            </form>

        </section>
    `;
}

function renderAbout() {
    app.innerHTML = `
        <section class="about">
            <h2>Acerca de</h2>
            <p>Información sobre ChatWars.</p>
        </section>
    `;
}

function addUserMessage(message) {
    if (!selectedCharacter) {
        return;
    }

    conversations[selectedCharacter.id].push({
        role: "user",
        content: message
    });
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
            content: data.reply
        });

        chatStatus = "idle";

        renderChat();
    } catch (error) {
        console.error("Error sending message:", error);

        chatStatus = "error";

        renderChat();
    }
}

function retryLastMessage() {
    if (!selectedCharacter) {
        return;
    }

    const messages = conversations[selectedCharacter.id];

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== "user") {
        return;
    }

    sendMessage(lastMessage.content);
}

function router() {
    const route = getRoute(window.location.pathname);

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
}

function navigate(path) {
    history.pushState({}, "", path);

    router();
}

document.addEventListener("click", (event) => {
    const link = event.target.closest(".app-navigation a");

    if (link) {
        event.preventDefault();

        const path = link.getAttribute("href");

        navigate(path);

        return;
    }

    const characterButton = event.target.closest(
        ".character-card__button"
    );

    if (characterButton) {
        const characterId = characterButton.dataset.characterId;

        selectedCharacter = characters.find(
            (character) => character.id === characterId
        );

        if (!conversations[characterId]) {
            conversations[characterId] = [];
        }

        chatStatus = "idle";

        navigate("/chat");

        return;
    }

    const backButton = event.target.closest(".chat-back-button");

    if (backButton) {
        chatStatus = "idle";

        navigate("/home");

        return;
    }

    const retryButton = event.target.closest(".chat-retry-button");

    if (retryButton) {
        retryLastMessage();
    }
});

document.addEventListener("submit", (event) => {
    const form = event.target.closest(".chat-composer");

    if (!form || chatStatus === "loading") {
        return;
    }

    event.preventDefault();

    const input = form.querySelector(".chat-input");
    const message = input.value.trim();

    if (!message) {
        return;
    }

    input.value = "";

    addUserMessage(message);

    renderChat();

    sendMessage(message);
});

window.addEventListener("popstate", router);

router();