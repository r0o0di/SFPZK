import nodemailer from 'nodemailer';

export async function POST(req) {
  const { name, surname, age, email, phone, option, note } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rodikhello2000@gmail.com',
      pass: 'xtng ezoc xooq xkbk', // Use App Password, not your main password
    },
  });

  await transporter.sendMail({
    from: email,
    to: 'rodikhello2000@gmail.com',
    subject: 'New Course Form Submission',
    text: `
      Name: ${name}
      Surname: ${surname}
      Age: ${age}
      Email: ${email}
      Phone: ${phone}
      Asta: ${option}
      Note: ${note}
    `,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
