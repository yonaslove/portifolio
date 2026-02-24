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

        // --- CASE 3: COMPREHENSIVE CSV-BASED FALLBACK (No API Key Required) ---
        const rows = knowledgeBase.split('\n').filter(r => r.includes(','));
        let replyParts = [];
        let isGreeting = lastMessage.includes("hi") || lastMessage.includes("hello");

        if (lastMessage.includes("yonas") || lastMessage.includes("who is") || lastMessage.includes("profile") || lastMessage.includes("about")) {
            // Full Profile Summary
            const name = rows.find(r => r.includes("Profile,Name"))?.split(',')[2]?.replace(/"/g, '') || "Yonas Yirgu";
            const role = rows.find(r => r.includes("Profile,Role"))?.split(',')[2]?.replace(/"/g, '') || "Developer";
            const loc = rows.find(r => r.includes("Profile,Location"))?.split(',')[2]?.replace(/"/g, '') || "Addis Ababa";
            replyParts.push(`${name} is a ${role} based in ${loc}.`);
            replyParts.push("He has a strong background in Full Stack development and a passion for creating innovative tech solutions.");
        }

        if (lastMessage.includes("skill") || lastMessage.includes("tech") || lastMessage.includes("stack")) {
            const skills = rows.filter(r => r.startsWith("Skills")).map(r => {
                const parts = r.split(',');
                return `**${parts[1]}**: ${parts.slice(2).join(',').replace(/"/g, '')}`;
            });
            if (skills.length) {
                replyParts.push("### Technical Skills:");
                replyParts.push(...skills);
            }
        }

        if (lastMessage.includes("project") || lastMessage.includes("work")) {
            const projects = rows.filter(r => r.startsWith("Project")).map(r => {
                const parts = r.split(',');
                return `- **${parts[1]}**: ${parts.slice(2).join(',').replace(/"/g, '')}`;
            });
            if (projects.length) {
                replyParts.push("### Featured Projects:");
                replyParts.push(...projects);
            }
        }

        if (lastMessage.includes("experience") || lastMessage.includes("career") || lastMessage.includes("history")) {
            const exp = rows.filter(r => r.startsWith("Experience")).map(r => {
                const parts = r.split(',');
                return `- **${parts[1]}**: ${parts.slice(2).join(',').replace(/"/g, '')}`;
            });
            if (exp.length) {
                replyParts.push("### Professional Experience:");
                replyParts.push(...exp);
            }
        }

        if (lastMessage.includes("contact") || lastMessage.includes("email") || lastMessage.includes("phone")) {
            const email = rows.find(r => r.includes("Profile,Email"))?.split(',')[2]?.replace(/"/g, '') || "yonasyirgu718@gmail.com";
            const phone = rows.find(r => r.includes("Profile,Phone"))?.split(',')[2]?.replace(/"/g, '') || "+251 987 384 233";
            replyParts.push("### Contact Information:");
            replyParts.push(`- **Email**: ${email}`);
            replyParts.push(`- **Phone**: ${phone}`);
        }

        let reply = replyParts.join('\n\n');

        if (!reply || isGreeting) {
            const welcome = "Hi! I'm Yonas's AI assistant. I can tell you all about his projects, technical skills, and professional experience using his verified data profile.";
            reply = isGreeting ? `${welcome}\n\n${reply}` : welcome;
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: reply } }] })}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();

    } catch (error) {
        res.status(500).json({ error: 'Chat failed' });
    }
}
