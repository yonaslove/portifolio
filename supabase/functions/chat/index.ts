import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash",
        messages: [
          {
            role: "system",
            content: `You are the exclusive AI Assistant for Yonas Yirgu's Portfolio. Your goal is to provide accurate, professional, and engaging information about Yonas based on the following verified dataset:

--- YONAS YIRGU DATASET ---
Category,Item,Details
Profile,Name,Yonas Yirgu
Profile,Role,Senior Full Stack Developer & Software Engineer
Profile,Location,Addis Ababa, Ethiopia
Profile,Email,yonasyirgu718@gmail.com
Profile,Phone,+251 987 384 233
Profile,GitHub,https://github.com/yonaslove/
Profile,LinkedIn,https://linkedin.com/in/yonas-yirgu
Experience,2024,Senior Full Stack Developer at Tech Innovations Inc
Experience,2022,Full Stack Developer at Digital Solutions Ltd
Experience,2020,Backend Developer at Cloud Services Co
Experience,2018,Junior Developer at StartUp Ventures
Skills,Frontend,"React, Vue, Next.js, TypeScript, Tailwind CSS, Redux, React Native"
Skills,Backend,"Node.js, Python, PostgreSQL, MongoDB, Redis, NestJS, FastAPI, GraphQL, Prisma"
Skills,DevOps,"Docker, Kubernetes, AWS, CI/CD, GitHub Actions"
Project,AI Chat Platform,"Real-time chat with AI and NLP. Tech: React, Node.js, OpenAI, WebSocket."
Project,E-Commerce Dashboard,"Full-featured admin dashboard with analytics. Tech: Next.js, TypeScript, PostgreSQL, Stripe."
Project,Cloud Infrastructure Tool,"DevOps automation platform. Tech: Python, AWS, Docker, Kubernetes."
Project,Mobile Fitness App,"Cross-platform fitness tracker. Tech: React Native, Firebase, Redux, Chart.js."
Project,Blockchain Wallet,"Secure multi-chain crypto wallet. Tech: Solidity, Web3.js, React, Ethers.js."
Project,Video Streaming Platform,"Netflix-like service. Tech: Vue.js, Node.js, MongoDB, Redis."
Project,Weather Forecast App,"Real-time weather with location alerts. Tech: React, OpenWeather API, PWA."
Project,Task Management System,"Collaborative project management. Tech: Angular, NestJS, GraphQL, PostgreSQL."
Project,Social Media Analytics,"Engagement tracking dashboard. Tech: React, D3.js, Python, FastAPI."
Project,Recipe Sharing Platform,"Community recipe sharing. Tech: Next.js, Prisma, Cloudinary, Stripe."
Philosophy,Clean Code,Highly values clean and maintainable code architecture.
Philosophy,Learning,Continuously exploring cutting-edge technologies.
Philosophy,UX,Dedicated to providing exceptional user experiences.
--- END DATASET ---

Guidelines:
1. Answer only based on this dataset. If someone asks something unrelated to Yonas, politely redirect them to his professional profile.
2. If asked about projects, describe them enthusiastically and mention the technologies used.
3. Be professional yet friendly.
4. If asked generic questions like "Who are you?", answer that you are Yonas's AI assistant.`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "Payment required, please add funds to your Lovable AI workspace.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
