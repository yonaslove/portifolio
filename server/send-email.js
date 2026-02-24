/*
  Local email API for development.
  Usage:
    - Copy `.env.example` to `.env` and fill in SMTP credentials.
    - Run: npm run serve:api
    - It listens on port 5178 by default. Frontend will call http://localhost:5178/send-email

  NOTE: This is a development helper only. For production, deploy a secure server or use a hosted email API (SendGrid, Resend, Mailgun).
*/

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 5178;

console.log('--- Environment Check ---');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'Missing');
console.log('SMTP_PORT:', process.env.SMTP_PORT || 'Missing');
console.log('SMTP_USER:', process.env.SMTP_USER || 'Missing');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '********' : 'Missing');
console.log('-------------------------');

// Setup CORS with support for custom headers used by Supabase/Lovable
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'apikey', 'x-client-info'],
  credentials: true
}));
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// JSON parse error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON Parse Error:', err.message);
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next();
});

// --- Chat Endpoint (Local Fallback) ---
app.post('/chat', (req, res) => {
  const { messages } = req.body;
  if (!messages || !messages.length) return res.status(400).json({ error: 'No messages provided' });

  const userMsg = messages[messages.length - 1].content.toLowerCase();
  console.log(`Chat request: "${userMsg}"`);

  let responseText = "I'm AI assistant. I'm currently running in development mode. How can I help you today?";

  // Simple "learned" responses based on Yonas's Portfolio Description
  if (userMsg.includes("hi") || userMsg.includes("hello")) {
    responseText = "Hi there! I'm AI assistant. I can tell you all about Yonas Yirgu—his skills, projects, and professional experience. What would you like to know?";
  } else if (userMsg.includes("yonas")) {
    responseText = "Yonas Yirgu is a passionate Software Engineer and Senior Full Stack Developer with over 6 years of experience. He specializes in crafting elegant, scalable solutions to complex problems and is currently working at Tech Innovations Inc.\n\nHis expertise includes React, Next.js, Node.js, TypeScript, and Python, along with cloud tools like AWS and Docker. He's also a 'Tech Storyteller' who loves building everything from high-performance web apps to secure blockchain solutions. You can reach him at **yonasyirgu718@gmail.com** or **+251 987 384 233**.";
  } else if (userMsg.includes("block") || userMsg.includes("crypto") || userMsg.includes("wallet")) {
    responseText = "The **Blockchain Wallet** is one of Yonas's premium projects. It features multi-chain support and secure transaction handling. Note: This project is currently locked for premium access only.";
  } else if (userMsg.includes("infra") || userMsg.includes("cloud") || userMsg.includes("devops")) {
    responseText = "The **Cloud Infrastructure Tool** is a premium DevOps platform Yonas built for managing AWS resources via Docker and Kubernetes. Access to this tool is currently restricted.";
  } else if (userMsg.includes("weather") || userMsg.includes("forecast")) {
    responseText = "The **Weather Forecast App** provides real-time alerts and 7-day forecasts. It's a premium PWA (Progressive Web App) that requires a subscription to unlock.";
  } else if (userMsg.includes("project")) {
    responseText = "Yonas has an impressive portfolio featuring web applications, mobile apps, and blockchain solutions. Some highlights include:\n1. **Video Streaming Platform** (Live at moovida-real.vercel.app)\n2. **AI Chat Platform** (Real-time AI integration)\n3. **E-Commerce Dashboard** (Next.js/PostgreSQL)\n4. **Blockchain Wallet** (Premium/Locked)\n5. **Cloud Infrastructure Tool** (Premium/Locked)\nWhich one would you like to hear more about?";
  } else if (userMsg.includes("skill") || userMsg.includes("tech") || userMsg.includes("stack")) {
    responseText = "Yonas is a Senior Full Stack Developer. His core tech stack includes:\n- **Frontend**: React, Next.js, TypeScript\n- **Backend**: Node.js, Python, PostgreSQL, Redis\n- **Tools**: AWS, Docker, Kubernetes, Git\nHe's dedicated to writing clean, maintainable code and providing exceptional user experiences.";
  } else if (userMsg.includes("experience") || userMsg.includes("work") || userMsg.includes("timeline")) {
    responseText = "Yonas has over 6 years of experience in the tech industry:\n- **2024**: Senior Full Stack Developer at Tech Innovations Inc\n- **2022**: Full Stack Developer at Digital Solutions Ltd\n- **2020**: Backend Developer at Cloud Services Co\n- **2018**: Junior Developer at StartUp Ventures\nHe's built 50+ production applications and is always eager to learn new technologies.";
  } else if (userMsg.includes("contact") || userMsg.includes("email") || userMsg.includes("phone")) {
    responseText = "You can reach Yonas via email at **yonasyirgu718@gmail.com** or call him at **+251 987 384 233**. You can also use the contact form on this site!";
  } else if (userMsg.includes("location") || userMsg.includes("where")) {
    responseText = "Yonas is based in **Addis Ababa, Ethiopia**, but he works with clients and companies globally.";
  } else if (userMsg.includes("who are you")) {
    responseText = "I'm AI assistant, specifically built to help you navigate Yonas Yirgu's portfolio and professional background. I've been 'trained' on his projects, skills, and experience to provide you with the best guidance.";
  }

  // Return as a fake SSE stream to keep frontend happy
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Format as OpenAI-style SSE
  const mockPayload = {
    choices: [{
      delta: { content: responseText }
    }]
  };

  res.write(`data: ${JSON.stringify(mockPayload)}\n\n`);
  res.write(`data: [DONE]\n\n`);
  res.end();
});

app.post('/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Read SMTP config from env
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.FROM_EMAIL || 'no-reply@portfolio.com';
    const recipientEmail = 'yonasyirgu718@gmail.com';

    console.log(`Email request from: ${name} <${email}>`);

    if (!host || !port || !user || !pass) {
      console.warn('--- SMTP NOT CONFIGURED ---');
      console.warn('Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env to send actual emails.');
      console.log('Variables check:', { host, port, user, pass: pass ? 'SET' : 'MISSING' });

      return res.json({
        success: true,
        message: 'Message received (logged to server console as SMTP is not configured)'
      });
    }

    console.log('Creating transporter...');
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    // Send notification to site owner
    console.log('Sending notification email to site owner...');
    const ownerInfo = await transporter.sendMail({
      from: `Portfolio Contact <${from}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `New contact from ${name}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
    console.log('✓ Notification email sent successfully:', ownerInfo.messageId);

    // Send confirmation to sender (optional)
    console.log(`Sending confirmation email to sender: ${email}...`);
    const senderInfo = await transporter.sendMail({
      from: `Portfolio <${from}>`,
      to: email,
      subject: 'Thanks for contacting me',
      html: `
        <h3>Thanks for reaching out, ${name}!</h3>
        <p>I have received your message and will reply as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <br>
        <p>— Yonas</p>
      `,
    });
    console.log('✓ Confirmation email sent successfully:', senderInfo.messageId);

    res.json({ success: true });
  } catch (err) {
    console.error('!!! Error in /send-email route !!!');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    if (err.stack) console.error('Stack trace:', err.stack);
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
});

app.listen(PORT, async () => {
  console.log(`Email API listening on http://localhost:${PORT}`);

  // Verify SMTP connection on startup if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: process.env.SMTP_PORT === '465',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    try {
      await transporter.verify();
      console.log('✓ SMTP Connection verified successfully');
    } catch (error) {
      console.error('✗ SMTP Connection failed:', error.message);
      console.error('Check your SMTP_PASS (App Password) and other credentials in .env');
    }
  } else {
    console.warn('! SMTP not configured. Emails will be logged to console only.');
  }
});
