import nodemailer from 'nodemailer';
import { escapeHtml, sanitizeCourseForm, validateCourseFields } from '@/lib/inputSanitization';

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

  const emailFields = {
    name: escapeHtml(name),
    age: escapeHtml(age),
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    option: escapeHtml(option),
    note: escapeHtml(note).replace(/\n/g, '<br>'),
  };

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
    subject: `Fêrbûn - ${name}`,
    text: `
      Nav: ${name}
      Temen: ${age}
      Jimara Telefonê: ${phone}
      E-Mail: ${email}
      Asta: ${option}
      Têbîn / Peyam: ${note}
    `,
    html: `
      <div style="margin:0;background:#f3f6f4;padding:32px 16px;font-family:Arial,sans-serif;color:#20352d;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #d9e5de;border-radius:8px;overflow:hidden;">
          <div style="background:#1f5c48;padding:24px 28px;color:#ffffff;">
            <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:.8;">SFPZK</div>
            <h1 style="margin:8px 0 0;font-size:24px;line-height:1.2;font-weight:600;">Fêrbûn</h1>
          </div>
          <div style="padding:28px;">
            <table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px;">
              <tr><td style="padding:10px 0;color:#6b7d74;width:34%;">Nav</td><td style="padding:10px 0;border-bottom:1px solid #e8efeb;">${emailFields.name}</td></tr>
              <tr><td style="padding:10px 0;color:#6b7d74;">Temen</td><td style="padding:10px 0;border-bottom:1px solid #e8efeb;">${emailFields.age}</td></tr>
              <tr><td style="padding:10px 0;color:#6b7d74;">Telefon</td><td style="padding:10px 0;border-bottom:1px solid #e8efeb;">${emailFields.phone}</td></tr>
              <tr><td style="padding:10px 0;color:#6b7d74;">E-Mail</td><td style="padding:10px 0;border-bottom:1px solid #e8efeb;">${emailFields.email}</td></tr>
              <tr><td style="padding:10px 0;color:#6b7d74;">Asta</td><td style="padding:10px 0;border-bottom:1px solid #e8efeb;">${emailFields.option}</td></tr>
              <tr><td style="padding:10px 0;color:#6b7d74;vertical-align:top;">Peyam</td><td style="padding:10px 0;line-height:1.6;">${emailFields.note}</td></tr>
            </table>
          </div>
        </div>
      </div>
    `,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
