import { NextResponse } from 'next/server';

// Helper function to split text into chunks while preserving paragraphs
function splitIntoChunks(text, maxLength = 450) {
  // Split text into paragraphs first
  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      chunks.push('[PARA]'); // Preserve empty lines
      continue;
    }

    // Split paragraph into sentences
    const sentences = paragraph.split(/(?<=[.!?])\s+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      // If single sentence is longer than maxLength, split by spaces
      if (sentence.length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk);
          currentChunk = '';
        }
        
        const words = sentence.split(/\s+/);
        let tempChunk = '';
        
        for (const word of words) {
          if ((tempChunk + ' ' + word).length <= maxLength) {
            tempChunk += (tempChunk ? ' ' : '') + word;
          } else {
            chunks.push(tempChunk);
            tempChunk = word;
          }
        }
        if (tempChunk) chunks.push(tempChunk);
        continue;
      }

      // If adding next sentence exceeds maxLength, start new chunk
      if ((currentChunk + ' ' + sentence).length > maxLength) {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
      currentChunk = '';
    }
    
    // Add paragraph marker
    chunks.push('[PARA]');
  }

  return chunks.filter((chunk, index, array) => 
    // Remove consecutive paragraph markers and trailing marker
    !(chunk === '[PARA]' && (array[index + 1] === '[PARA]' || index === array.length - 1))
  );
}

async function translateChunk(text, target) {
  const response = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=ku|${target}`
  );

  const data = await response.json();
  if (data.responseStatus === 200) {
    return data.responseData.translatedText;
  }
  throw new Error(data.responseDetails || 'Translation failed');
}

export async function POST(req) {
  try {
    const { text, target } = await req.json();

    if (!text || !target) {
      return NextResponse.json(
        { error: 'Missing text or target language' },
        { status: 400 }
      );
    }

    // Split text into manageable chunks
    const chunks = splitIntoChunks(text);
    
    // Translate all chunks with a small delay between requests
    const translatedChunks = [];
    for (const chunk of chunks) {
      if (chunk === '[PARA]') {
        translatedChunks.push(chunk);
        continue;
      }

      // Add a small delay between requests to avoid rate limiting
      if (translatedChunks.length > 0 && chunk !== '[PARA]') {
        await new Promise(resolve => setTimeout(resolve, 250));
      }

      if (chunk.trim()) {
        const translatedChunk = await translateChunk(chunk, target);
        translatedChunks.push(translatedChunk);
      }
    }

    // Join chunks, replacing paragraph markers with double newlines
    const translatedText = translatedChunks
      .join(' ')
      .replace(/\s*\[PARA\]\s*/g, '\n\n')
      .trim();

    return NextResponse.json({ translatedText });
  } catch (err) {
    console.error('Translation error:', err);
    return NextResponse.json(
      { error: err.message || 'Translation failed' },
      { status: 500 }
    );
  }
}
