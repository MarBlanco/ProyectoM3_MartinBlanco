import { characters } from "./characters.js";

function createCharacterCard(character) {
    return `
        <article class="character-card">
            <img src="${character.image}" alt="${character.name}">
            <h3>${character.name}</h3>
            <p>${character.description}</p>
            <button type="button">Hablar</button>
        </article>
    `;
}

const app = document.querySelector("#app");

app.innerHTML = `
    <section class="character-gallery">
        <h2>Elegí con quién querés conversar</h2>
        <div class="character-grid">
            ${characters.map(createCharacterCard).join("")}
        </div>
    </section>
`;

