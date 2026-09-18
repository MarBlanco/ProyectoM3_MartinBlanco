import { describe, it, expect } from "vitest";
import { getRoute } from "../src/router.js";

describe("Routing", () => {
    it("debe devolver chat para la ruta /chat", () => {
        // Arrange
        const path = "/chat";

        // Act
        const result = getRoute(path);

        // Assert
        expect(result).toBe("chat");
    });

    it("debe devolver about para la ruta /about", () => {
        // Arrange
        const path = "/about";

        // Act
        const result = getRoute(path);

        // Assert
        expect(result).toBe("about");
    });

    it("debe devolver home para la ruta /home", () => {
        // Arrange
        const path = "/home";

        // Act
        const result = getRoute(path);

        // Assert
        expect(result).toBe("home");
    });

    it("debe devolver home para la ruta /", () => {
        // Arrange
        const path = "/";

        // Act
        const result = getRoute(path);

        // Assert
        expect(result).toBe("home");
    });
});