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

function renderChatList() {
    return `
        <aside class="chat-list">

            <header class="chat-list__header">
                <div>
                    <h1>Chats</h1>
                    <p>Elegí un personaje para continuar</p>
                </div>

                <span class="chat-list__icon">✦</span>
            </header>

            <div class="chat-list__items">

                ${characters.map((character) => {
                    const messages = conversations[character.id] || [];
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
                        >

                            <img
                                src="${character.image}"
                                alt="${character.name}"
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

    const messages = conversations[selectedCharacter.id] || [];

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

    const characterName =
        selectedCharacter.name.replace("Master ", "");

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

    const characterName =
        selectedCharacter.name.replace("Master ", "");

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

function renderConversation() {
    if (!selectedCharacter) {
        return `
            <section class="chat-empty">
                <div class="chat-empty__content">
                    <div class="chat-empty__icon">✦</div>

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

                <div class="chat-character">
                    <img
                        src="${selectedCharacter.image}"
                        alt="${selectedCharacter.name}"
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
                    placeholder="Escribí un mensaje..."
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

function renderChat() {
    app.innerHTML = `
        <section class="chat-layout">

            ${renderChatList()}

            ${renderConversation()}

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
        const characterId =
            characterButton.dataset.characterId;

        selectCharacter(characterId);

        navigate("/chat");

        return;
    }

    const chatCharacterButton = event.target.closest(
        ".chat-list__item"
    );

    if (chatCharacterButton) {
        const characterId =
            chatCharacterButton.dataset.chatCharacterId;

        selectCharacter(characterId);

        return;
    }

    const mobileBackButton = event.target.closest(
        ".chat-mobile-back-button"
    );

    if (mobileBackButton) {
        selectedCharacter = null;
        chatStatus = "idle";

        renderChat();

        return;
    }

    const retryButton = event.target.closest(
        ".chat-retry-button"
    );

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

    if (!selectedCharacter) {
        return;
    }

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