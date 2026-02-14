import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

app.post("/api/convert", async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",


            messages: [
                {
                    role: "system",
                    content: "You are a code translator. Only return the converted code. No explanations."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.2,
        });

        res.json({ result: response.choices[0].message.content });

    } catch (error) {
        console.error(error);

        if (error?.error?.code === "insufficient_quota") {
            return res.status(429).json({
                error: "API quota exceeded. Please try again later."
            });
        }

        if (error?.error?.message?.toLowerCase().includes("quota")) {
            return res.status(429).json({
                error: "API quota exceeded. Please try again later."
            });
        }

        res.status(500).json({ error: "Conversion failed" });
    }

});

app.listen(4000, () => {
    console.log("Backend running on http://localhost:4000");
});
