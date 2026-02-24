import fs from 'fs';
import path from 'path';

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

        // --- LOAD DATA FROM CSV ---
        let knowledgeBase = "";
        try {
            const csvPath = path.join(process.cwd(), 'public', 'yonas_profile.csv');
            knowledgeBase = fs.readFileSync(csvPath, 'utf8');
        } catch (e) {
            console.warn("Could not read CSV, using default profile", e);
            knowledgeBase = "Name: Yonas Yirgu. Professional Senior Full Stack Developer.";
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        // --- CASE 1: USE GEMINI API ---
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
                                parts: [{ text: `You are the exclusive AI Assistant for Yonas Yirgu's Portfolio. Answer ONLY based on this verified dataset:\n\n${knowledgeBase}\n\nIf asked about something not in this data, politely redirect to his contact info.` }]
                            }
                        }),
                    }
                );

                if (response.ok) {
                    res.setHeader('Content-Type', 'text/event-stream');
                    res.setHeader('Cache-Control', 'no-cache');
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value);
                        const matches = chunk.match(/"text":\s*"([^"]+)"/g);
                        if (matches) {
                            for (const match of matches) {
                                const text = match.slice(8, -1).replace(/\\n/g, '\n');
                                res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`);
                            }
                        }
                    }
                    res.write(`data: [DONE]\n\n`);
                    return res.end();
                }
            } catch (err) { }
        }

        // --- CASE 2: SMART CSV-BASED STATIC FALLBACK ---
        // If no AI key, we look into the CSV rows for matches
        const rows = knowledgeBase.split('\n').filter(r => r.includes(','));
        let reply = "I'm Yonas's AI assistant. I can help with details from his professional profile. Please try asking about his skills, experience, or specific projects!";

        // Logic: Look for the most relevant row in the CSV
        for (const row of rows) {
            const [category, item, details] = row.split(',').map(s => s.trim().replace(/"/g, ''));
            const combined = `${category} ${item}`.toLowerCase();

            if (lastMessage.includes(item.toLowerCase()) || lastMessage.includes(category.toLowerCase())) {
                if (category === "Profile" && item === "Name") reply = `His name is ${details}.`;
                else if (category === "Profile" && item === "Role") reply = `Yonas is a ${details}.`;
                else if (category === "Skills") reply = `In ${item}, Yonas is proficient in: ${details}.`;
                else if (category === "Project") reply = `The ${item} project is: ${details}`;
                else if (category === "Experience") reply = `In ${item}, Yonas was a ${details}`;
                else reply = `${item}: ${details}`;
                break; // found a good match
            }
        }

        // Default Hi/Hello
        if (lastMessage.includes("hi") || lastMessage.includes("hello")) {
            reply = "Hi! I'm Yonas's assistant. Ask me about his projects, skills, or experience (I'm using his verified CSV data!).";
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: reply } }] })}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();

    } catch (error) {
        res.status(500).json({ error: 'Chat failed' });
    }
}
