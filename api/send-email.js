import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // SMTP Configuration from environment variables
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '465', 10),
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;
        const recipientEmail = 'yonasyirgu718@gmail.com';

        // 1. Send notification to site owner
        await transporter.sendMail({
            from: `"Portfolio Contact" <${fromEmail}>`,
            to: recipientEmail,
            replyTo: email,
            subject: `New contact from ${name}`,
            html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #0088ff;">New Portfolio Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
        });

        // 2. Send confirmation to the sender
        await transporter.sendMail({
            from: `"Yonas" <${fromEmail}>`,
            to: email,
            subject: 'Message Received - Yonas Yirgu Portfolio',
            html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #0088ff;">Thanks for reaching out, ${name}!</h2>
          <p>I've received your message and will get back to you as soon as possible.</p>
          <hr />
          <p><strong>Your Message:</strong></p>
          <p style="color: #666;">${message}</p>
          <br />
          <p>Best regards,<br /><strong>Yonas Yirgu</strong></p>
        </div>
      `,
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Email sending error:', error);
        return res.status(500).json({
            error: 'Failed to send email',
            details: error.message
        });
    }
}
