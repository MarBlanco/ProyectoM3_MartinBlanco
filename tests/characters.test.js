import { describe, it, expect } from "vitest";
import { characters } from "../src/characters.js";

describe("Personajes de la Home", () => {
    it("debe tener 4 personajes", () => {
        // Arrange
        const expectedCharacters = 4;

        // Act
        const result = characters.length;

        // Assert
        expect(result).toBe(expectedCharacters);
    });

    it("debe contener los personajes esperados", () => {
        // Arrange
        const expectedIds = [
            "yoda",
            "luke",
            "vader",
            "jar-jar"
        ];

        // Act
        const result = characters.map((character) => character.id);

        // Assert
        expect(result).toEqual(expectedIds);
    });

    it("cada personaje debe tener los datos necesarios", () => {
        // Arrange
        const requiredProperties = [
            "id",
            "name",
            "description",
            "image",
            "theme"
        ];

        // Act
        const result = characters.every((character) =>
            requiredProperties.every(
                (property) => character[property]
            )
        );

        // Assert
        expect(result).toBe(true);
    });
});