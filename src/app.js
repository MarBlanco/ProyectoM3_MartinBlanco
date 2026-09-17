import { characters } from "./characters.js";

const app = document.querySelector("#app");

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

function renderChat() {
    app.innerHTML = `
        <section class="chat">
            <h2>Chat</h2>
            <p>Acá estará la conversación.</p>
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

function router() {
    const path = window.location.pathname;

    switch (path) {
        case "/chat":
            renderChat();
            break;

        case "/about":
            renderAbout();
            break;

        case "/home":
        case "/":
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

    if (!link) {
        return;
    }

    event.preventDefault();

    const path = link.getAttribute("href");

    navigate(path);
});

window.addEventListener("popstate", router);

router();