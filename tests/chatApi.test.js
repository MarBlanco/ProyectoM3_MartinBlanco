import {
    describe,
    it,
    expect,
    vi,
    beforeEach
} from "vitest";

import { sendChatMessage } from "../src/chatApi.js";

describe("Cliente de chat", () => {
    beforeEach(() => {
        global.fetch = vi.fn();
        fetch.mockClear();
    });

    it("debe enviar el mensaje y el historial correctamente", async () => {
        // Arrange
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                reply: "Hola, soy Yoda."
            })
        });

        const message = "Hola Yoda";
        const history = [
            {
                role: "user",
                content: "Hola Yoda"
            }
        ];

        // Act
        const result = await sendChatMessage(
            message,
            history
        );

        // Assert
        expect(result).toEqual({
            reply: "Hola, soy Yoda."
        });

        expect(fetch).toHaveBeenCalledWith("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                history
            })
        });
    });

    it("debe lanzar un error cuando la API responde con error", async () => {
        // Arrange
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({
                error: "Error generating response"
            })
        });

        // Act
        const promise = sendChatMessage(
            "Hola",
            []
        );

        // Assert
        await expect(promise).rejects.toThrow(
            "Error generating response"
        );
    });
});