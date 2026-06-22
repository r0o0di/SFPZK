import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import chromium from '@sparticuz/chromium';
import { chromium as playwright } from 'playwright-core';

const loadDataUrl = async (filename) => {
    const filePath = path.join(process.cwd(), 'public', filename);
    const buffer = await fs.readFile(filePath);
    const mime = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
    return `data:${mime};base64,${buffer.toString('base64')}`;
};

const loadFontDataUrl = async (filename) => {
    const filePath = path.join(process.cwd(), 'public', 'fonts', filename);
    const buffer = await fs.readFile(filePath);
    return `data:font/ttf;base64,${buffer.toString('base64')}`;
};

const formatGradeValue = (value) => {
    const normalized = String(value || '').trim();
    return /^[0-9]$/.test(normalized) ? `0${normalized}` : normalized;
};

const buildHtml = async ({ form, showReading, vekitOrMijar }) => {
    const krgLogo = await loadDataUrl('krg-logo.png');
    const sfpzkLogo = await loadDataUrl('sfpzk-logo.png');
    const iklfLogo = await loadDataUrl('iklf-logo.png');
    const stampImage = await loadDataUrl(form.branchName === 'Ewropayê' ? 'stamp.jpg' : 'stamp-basur.jpg');

    const totalScore = (showReading ? Number(form.gradeReading) || 0 : 0) +
        (Number(form.gradeWriting) || 0) +
        (Number(form.gradeVekitMijar) || 0);

    const headerHtml = form.branchName === 'Ewropayê' ? `
    <div class="header-row">
      <div class="header-side">
        <img src="${krgLogo}" alt="KRG Logo" class="logo-side" />
      </div>
      <div class="header-center">
        <img src="${sfpzkLogo}" alt="SFPZK Logo" class="logo-main" />
      </div>
      <div class="header-side header-right">
        <img src="${iklfLogo}" alt="IKLF Logo" class="logo-side" />
      </div>
    </div>
  ` : `
    <div class="header-row single-logo">
      <img src="${sfpzkLogo}" alt="SFPZK Logo" class="logo-main" />
    </div>
  `;

    const readingRow = showReading ? `
    <div class="subject-row">
      <span>Xwendin</span>
      <span class="grade-box"><span>${formatGradeValue(form.gradeReading)}</span><span class="grade-max"> / ${form.gradeReadingMax}</span></span>
    </div>
  ` : '';

    const timesNewRomanFont = await loadFontDataUrl('Times New Roman.ttf');

    return `<!DOCTYPE html>
<html lang="ku">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fêrname</title>
  <style>
    @font-face {
      font-family: 'Times New Roman';
      src: url('${timesNewRomanFont}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    body { margin: 0; padding: 0; background: #fff; font-family: 'Times New Roman', Times, serif; color: #000; display: flex; flex-direction: column; }
    .boldText { letter-spacing: 1px; }
    .certificate { width: 210mm; min-height: 297mm; padding: 15mm; box-sizing: border-box; }
    .certificate-title { margin: 0; font-size: 50px; font-weight: 500; letter-spacing: 1px; }
    .header-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; }
    .header-row.single-logo { justify-content: center; }
    .header-side { width: 30%; }
    .header-right { text-align: right; }
    .logo-side { width: 115px; height: auto; }
    .logo-main { width: 155px; height: auto; margin-top: -15px; }
    .institution-info { margin-top: -10px; text-align: center; font-size: 30px; }
    .institution-branch { display: block; margin-top: -5px; font-size: 28px; }
    .student-info { padding-bottom: 10px; border-bottom: 1px solid #000; font-size: 21px; }
    .level-text { margin: 5px 0; text-align: center; font-size: 25px; }
    .student-info strong { font-weight: 700; }
    .student-details-right { float: right; margin-top: -52px; text-align: right; }
    main.grades {margin-bottom: 120px;}
    .subjects-grid { display: grid; gap: 10px 25px; margin-bottom: 20px; font-size: 23px; }
    .subject-row { display: flex; justify-content: space-between; align-items: center; min-height: 24px; padding: 5px 0; border-bottom: 1px dotted #999; }
    .grade-box { min-width: 25px; padding: 2px 8px; text-align: center; font-weight: bold; border: 1px solid #000; background: #fafafa; }
    .grade-max { font-weight: 100; }
    .total-row { justify-content: center; gap: 2rem; margin-top: 5px; font-size: 25px; }
    .signature-section { display: flex; justify-content: space-around; align-items: flex-end; font-size: 22px; margin-top: 80px; }
    .stamp-image { width: 165px; height: auto; transform: rotate(-25deg); position: relative; top: 20px; }
    .signature-container { width: 300px; text-align: center; }
    .signature-line { border-bottom: 1px solid #000; }
    .signature-name { font-family: 'Courier New', monospace; font-size: 28px; font-style: italic; }
    .proxy-text, .signature-title { margin: 5px 0 0; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="certificate">
    <div style="display:flex; justify-content:center;">
      <div style="width:100%; justify-items:center; margin-top:-22px; text-align:center;">
        <h1 class="certificate-title">Fêrname</h1>
      </div>
    </div>
    ${headerHtml}
    <div class="institution-info">
      <span>Saziya Fêrkirin û Parastina Zimanê Kurdî</span>
      <span class="institution-branch">Şaxa <strong class="boldText">${form.branchName}</strong></span>
    </div>
    <section class="student-info">
      <p class="level-text">Asta <strong class="boldText">${form.studentLevel}</strong></p>
      <p style="margin:5px 0;">Ji bo</p>
      <strong class="boldText">${form.studentName}</strong><br />
      Hejmar <strong class="boldText">${form.studentNumber}</strong><br />
      <div class="student-details-right">
        <strong class="boldText">${form.studentBirthdate}</strong><br />
        <strong class="boldText">${form.studentBirthplace}</strong>
      </div>
    </section>
    <main class="grades">
      <h3 class="boldText" style="margin:40px 0 -5px; margin-bottom: 5px; font-size:25px; font-weight: 900;">Pileyên Ezmûnê</h3>
      <div class="subjects-grid">
        ${readingRow}
        <div class="subject-row">
          <span>Nivîsandin</span>
          <span class="grade-box"><span>${formatGradeValue(form.gradeWriting)}</span><span class="grade-max"> / ${form.gradeWritingMax}</span></span>
        </div>
        <div class="subject-row">
          <span>${vekitOrMijar}</span>
          <span class="grade-box"><span>${formatGradeValue(form.gradeVekitMijar)}</span><span class="grade-max"> / ${form.gradeVekitMijarMax}</span></span>
        </div>
        <div class="subject-row total-row">
          <span>Tevahî</span>
          <span class="grade-box">${totalScore} <span style="font-weight:100;">/ 100</span></span>
        </div>
      </div>
    </main>
    <section class="signature-section">
      <div>
        <img src="${stampImage}" alt="stamp" class="stamp-image" />
      </div>
      <div class="signature-container">
        <span><strong  class="boldText">${form.certificateLocation}</strong></span><br />
        <span><strong class="boldText">${form.certificateDate}</strong></span>
        <p class="proxy-text">Bi navê mamoste</p>
        <div class="signature-line">
          <span class="signature-name">${form.teacherName}</span>
        </div>
        <p class="signature-title"></p>
      </div>
    </section>
  </div>
</body>
</html>`;
};

export async function POST(req) {
    try {
        const { form, showReading, vekitOrMijar } = await req.json();

        if (!form || typeof showReading !== 'boolean' || !vekitOrMijar) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const html = await buildHtml({ form, showReading, vekitOrMijar });
        const browser = await playwright.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
});
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
        await browser.close();

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="certificate.pdf"',
            },
        });
    } catch (error) {
        console.error('Generate certificate PDF error:', error);
        return NextResponse.json({ error: error?.message || 'PDF generation failed' }, { status: 500 });
    }
}
