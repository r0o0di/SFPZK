import nodemailer from 'nodemailer';

export async function POST(req) {
  const { name, surname, age, email, phone, option, note } = await req.json();

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
    subject: 'Fêrbûn',
    text: `
      Nav: ${name}
      Paşnav: ${surname}
      Temen: ${age}
      Jimara Telefonê: ${phone}
      E-Mail: ${email}
      Asta: ${option}
      Têbîn / Peyam: ${note}
    `,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
