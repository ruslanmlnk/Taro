import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  console.log('POST request received');
  
  try {
    const body = await request.text();
    console.log('Raw body length:', body.length);
    console.log('Raw body:', body);
    
    if (!body || body.trim() === '') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Empty request body' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const data = JSON.parse(body);
    console.log('Parsed data:', data);
    
    const { name, contact, description } = data;

    if (!name || !contact || !description) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Sending email...');
    console.log('All import.meta.env keys:', Object.keys(import.meta.env).filter(key => key.startsWith('SMTP') || key === 'EMAIL_TO'));
    console.log('SMTP_HOST:', import.meta.env.SMTP_HOST);
    console.log('SMTP_PORT:', import.meta.env.SMTP_PORT);
    console.log('SMTP_SECURE:', import.meta.env.SMTP_SECURE);
    console.log('SMTP_USER:', import.meta.env.SMTP_USER);
    console.log('SMTP_PASS:', import.meta.env.SMTP_PASS ? '***' : 'NOT SET');
    console.log('EMAIL_TO:', import.meta.env.EMAIL_TO);
    
    // Перевірка наявності всіх необхідних змінних
    if (!import.meta.env.SMTP_HOST || !import.meta.env.SMTP_USER || !import.meta.env.SMTP_PASS || !import.meta.env.EMAIL_TO) {
      console.error('Missing required environment variables');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'SMTP configuration is incomplete' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const transporter = nodemailer.createTransport({
      host: import.meta.env.SMTP_HOST,
      port: parseInt(import.meta.env.SMTP_PORT || '587'),
      secure: import.meta.env.SMTP_SECURE === 'true',
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS,
      },
      // Додаткові налаштування для Gmail
      tls: {
        rejectUnauthorized: false
      }
    });

    // Перевірка з'єднання
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    await transporter.sendMail({
      from: import.meta.env.SMTP_USER,
      to: import.meta.env.EMAIL_TO,
      subject: 'Заявка з форми Таро',
      text: `Ім'я: ${name}\nКонтакт: ${contact}\nСитуація: ${description}`,
    });

    console.log('Email sent successfully');
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Error:', e);
    return new Response(JSON.stringify({ success: false, error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};