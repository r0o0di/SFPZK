import nodemailer from 'nodemailer';
import { sanitizeKontaktForm, validateContactFields } from '@/lib/inputSanitization';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { name, email, phone, note } = sanitizeKontaktForm(body);

  if (!validateContactFields({ name, email, phone, note })) {
    return Response.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rodikhello2000@gmail.com',
      pass: process.env.EMAIL_PASS, // Use App Password, not main password
    },
  });

  await transporter.sendMail({
    from: email,
    to: 'rodikhello2000@gmail.com',
    subject: `Kontakt ${name}`,
    text: `
      Nav: ${name}
      Jimara Telefonê: ${phone}
      E-Mail: ${email}
      Têbîn / Peyam: ${note}
    `,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
