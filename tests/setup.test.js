import { describe, it, expect } from "vitest";

describe("Configuración de Vitest", () => {
    it("debe ejecutar correctamente un test básico", () => {
        // Arrange
        const value = 2 + 2;

        // Act
        const result = value;

        // Assert
        expect(result).toBe(4);
    });
});