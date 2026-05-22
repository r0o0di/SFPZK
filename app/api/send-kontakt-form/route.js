import nodemailer from 'nodemailer';

export async function POST(req) {
  const { name, email, phone, note } = await req.json();

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
    subject: 'Kontakt',
    text: `
      Nav: ${name}
      Jimara Telefonê: ${phone}
      E-Mail: ${email}
      Têbîn / Peyam: ${note}
    `,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
