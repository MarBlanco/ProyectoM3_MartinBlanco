import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const {
            message,
            history,
            personality
        } = req.body;

        const genAI = new GoogleGenerativeAI(
            process.env.GEMINI_API_KEY
        );

        const model = genAI.getGenerativeModel({
            model: "gemini-3.5-flash",
            systemInstruction: personality
        });

        const chat = model.startChat({
            history: history.map((item) => ({
                role: item.role === "character"
                    ? "model"
                    : "user",
                parts: [
                    {
                        text: item.content
                    }
                ]
            }))
        });

        const result = await chat.sendMessage(message);

        const response = result.response;

        const text = response.text();

        return res.status(200).json({
            reply: text
        });
    } catch (error) {
        console.error("Error calling Gemini:", error);

        return res.status(500).json({
            error: "Error generating response"
        });
    }
}