export async function sendChatMessage(
    message,
    history,
    personality
) {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message,
            history,
            personality
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Error en la respuesta del servidor"
        );
    }

    return data;
}