import nodemailer from 'nodemailer';
import { sanitizeCourseForm, validateCourseFields } from '@/lib/inputSanitization';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { name, age, email, phone, option, note } = sanitizeCourseForm(body);

  if (!validateCourseFields({ name, age, email, phone, option })) {
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
    subject: `Fêrbûn ${name}`,
    text: `
      Nav: ${name}
      Temen: ${age}
      Jimara Telefonê: ${phone}
      E-Mail: ${email}
      Asta: ${option}
      Têbîn / Peyam: ${note}
    `,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
