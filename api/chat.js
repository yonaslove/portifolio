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
        const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;

        // --- CASE 1: USE AI GATEWAY IF KEY IS AVAILABLE ---
        if (LOVABLE_API_KEY) {
            try {
                const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "google/gemini-2.0-flash",
                        messages: [
                            {
                                role: "system",
                                content: "You are the exclusive AI Assistant for Yonas Yirgu's Portfolio. Be professional, engaging, and help visitors learn about Yonas's skills (Full Stack, React, Node.js, Python), 6+ years of experience, and projects like the AI Chat Platform and Blockchain Wallet. You are based in Addis Ababa, Ethiopia."
                            },
                            ...messages
                        ],
                        stream: true,
                    }),
                });

                if (aiResponse.ok) {
                    // Stream the response back to client
                    res.setHeader('Content-Type', 'text/event-stream');
                    res.setHeader('Cache-Control', 'no-cache');
                    res.setHeader('Connection', 'keep-alive');

                    if (!aiResponse.body) throw new Error("No body from AI gateway");

                    const reader = aiResponse.body.getReader();
                    const decoder = new TextDecoder();

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        res.write(decoder.decode(value));
                    }
                    return res.end();
                } else {
                    console.error("AI Gateway responded with error:", aiResponse.status);
                }
            } catch (aiErr) {
                console.error("AI Gateway call failed, falling back to static responses:", aiErr);
            }
        }

        // --- CASE 2: STATIC FALLBACK (If AI fails or no key) ---
        // This ensures the chatbot ALWAYS works even without an API key
        let reply = "I'm Yonas's AI assistant. I'm currently in power-saving mode. Please reach out to Yonas directly at yonasyirgu718@gmail.com for detailed inquiries!";

        if (lastMessage.includes("hi") || lastMessage.includes("hello")) {
            reply = "Hello! I'm Yonas's AI guide. How can I help you explore his portfolio today?";
        } else if (lastMessage.includes("skill") || lastMessage.includes("tech")) {
            reply = "Yonas is a Senior Full Stack Developer. His expertise includes React, Next.js, Node.js, TypeScript, Python, and Cloud tools like AWS/Docker.";
        } else if (lastMessage.includes("project")) {
            reply = "Yonas has built many great projects! Check out the AI Chatbot Platform, the Video Streaming service (Moovida), and his Blockchain Wallet in the projects section above.";
        } else if (lastMessage.includes("experience") || lastMessage.includes("work")) {
            reply = "Yonas has over 6 years of industry experience, currently serving as a Senior Full Stack Developer at Tech Innovations Inc.";
        }

        // Format as OpenAI-style SSE stream for compatibility
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const payload = { choices: [{ delta: { content: reply } }] };
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Failed to process chat', details: error.message });
    }
}
