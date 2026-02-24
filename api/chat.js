export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).send('ok');
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages } = req.body;
        if (!messages || !messages.length) {
            return res.status(400).json({ error: 'No messages provided' });
        }

        const lastMessage = messages[messages.length - 1].content.toLowerCase();
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        // --- CASE 1: USE GEMINI API (Highly Recommended & Free level available) ---
        if (GEMINI_API_KEY) {
            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${GEMINI_API_KEY}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: messages.map(m => ({
                                role: m.role === 'assistant' ? 'model' : 'user',
                                parts: [{ text: m.content }]
                            })),
                            systemInstruction: {
                                parts: [{ text: "You are the AI Assistant for Yonas Yirgu's Portfolio. Be professional, engaging, and guide visitors. Yonas is a Senior Full Stack Developer (React, Next.js, Node.js, Python) with 6+ years of experience based in Addis Ababa. His top projects are the AI Chatbot, Blockchain Wallet, and Video Streaming platform." }]
                            }
                        }),
                    }
                );

                if (response.ok) {
                    res.setHeader('Content-Type', 'text/event-stream');
                    res.setHeader('Cache-Control', 'no-cache');
                    res.setHeader('Connection', 'keep-alive');

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let assistantContent = "";

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value);
                        // Gemini stream returns JSON objects in an array format or individual chunks
                        // For simplicity in this proxy, we'll try to extract the text and re-format for our frontend
                        try {
                            // Basic regex to find text content in Gemini chunks
                            const matches = chunk.match(/"text":\s*"([^"]+)"/g);
                            if (matches) {
                                for (const match of matches) {
                                    const text = match.slice(8, -1).replace(/\\n/g, '\n');
                                    assistantContent += text;
                                    const payload = { choices: [{ delta: { content: text } }] };
                                    res.write(`data: ${JSON.stringify(payload)}\n\n`);
                                }
                            }
                        } catch (e) { }
                    }
                    res.write(`data: [DONE]\n\n`);
                    return res.end();
                }
            } catch (err) {
                console.error("Gemini failed:", err);
            }
        }

        // --- CASE 2: USE OPENAI API ---
        if (OPENAI_API_KEY) {
            try {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [
                            { role: "system", content: "You are Yonas's Portfolio Assistant." },
                            ...messages
                        ],
                        stream: true,
                    }),
                });

                if (response.ok) {
                    res.setHeader('Content-Type', 'text/event-stream');
                    res.setHeader('Cache-Control', 'no-cache');
                    res.setHeader('Connection', 'keep-alive');

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        res.write(decoder.decode(value));
                    }
                    return res.end();
                }
            } catch (err) {
                console.error("OpenAI failed:", err);
            }
        }

        // --- CASE 3: STATIC FALLBACK (Always works) ---
        let reply = "I'm Yonas's AI assistant. Please contact Yonas directly at yonasyirgu718@gmail.com for inquiries!";
        if (lastMessage.includes("hi") || lastMessage.includes("hello")) reply = "Hello! I'm Yonas's AI guide. How can I help you today?";
        else if (lastMessage.includes("skill")) reply = "Yonas is a Senior Full Stack Developer (React, Next.js, Node.js, Python).";

        res.setHeader('Content-Type', 'text/event-stream');
        const payload = { choices: [{ delta: { content: reply } }] };
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();

    } catch (error) {
        res.status(500).json({ error: 'Chat failed', details: error.message });
    }
}
