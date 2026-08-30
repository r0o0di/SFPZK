// app/[customPage]/page.js
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import CustomPageClient from './CustomPageClient';

// Helper to convert dd-mm-yyyy -> yyyy-mm-dd reliably
function parseToDocId(rawId) {
  if (!rawId) return '';
  const parts = rawId.split('-');
  if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return rawId;
}

// Helper to find the first image URL inside the media array
function extractFirstImageUrl(mediaArray) {
  if (!Array.isArray(mediaArray) || mediaArray.length === 0) return null;

  for (const item of mediaArray) {
    let url = typeof item === 'string' ? item : item?.storageUrl || item?.url || '';
    
    // Check if the item is an image file or direct storage upload
    if (url && (/\.(jpe?g|png|gif|webp)(?:\?|$)/i.test(url) || url.includes('firebasestorage.googleapis.com'))) {
      return url;
    }
  }

  return null;
}

export async function generateMetadata({ params, searchParams }) {
  const { customPage } = await params;
  const param = decodeURIComponent(customPage);
  const resolvedSearchParams = await searchParams;
  const rawArticleId = resolvedSearchParams?.article;

  const metadataMap = {
    'çalakî': {
      title: 'Çalakî | SFPZK',
      description: 'Çalakiyên SFPZK.',
      url: '/çalakî',
    },
    'fêrbûn': {
      title: 'Fêrbûn | SFPZK',
      description: 'Fêrbûna zimanê Kurdî - SFPZK.',
      url: '/fêrbûn',
    },
    'têkilî': {
      title: 'Têkilî | SFPZK',
      description: 'Bi SFPZK re têkilî bike.',
      url: '/têkilî',
    },
    'fêrname': {
      title: 'Fêrname | SFPZK',
      description: 'Fêrname ya SFPZK.',
      url: '/fêrname',
    },
  };

  const page = metadataMap[param];
  if (!page) return {};

  let dynamicTitle = page.title;
  let dynamicDescription = page.description;
  let dynamicImage = 'https://sfpzk.com/sfpzk-logo.png'; // Fallback default image
  const pageUrl = `https://sfpzk.com/çalakî${rawArticleId ? `?article=${encodeURIComponent(rawArticleId)}` : ''}`;

  if (param === 'çalakî' && rawArticleId) {
    try {
      const formattedDocId = parseToDocId(rawArticleId); // e.g., "2025-11-08"
      let articleData = null;

      // 1. Direct document lookup by target ID (yyyy-mm-dd)
      const docRef = doc(db, 'çalakî', formattedDocId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        articleData = docSnap.data();
      } else {
        // 2. Fallback query matching either date format in the date field
        const q = query(
          collection(db, 'çalakî'),
          where('date', 'in', [formattedDocId, rawArticleId])
        );
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          articleData = querySnap.docs[0].data();
        }
      }

      if (articleData) {
        if (articleData.title) {
          dynamicTitle = `${articleData.title} | Çalakî - SFPZK`;
        }

        if (articleData.content) {
          // Flatten newlines and limit to ~160 characters for social cards
          const cleanText = articleData.content.replace(/\s+/g, ' ').trim();
          dynamicDescription = cleanText.length > 160
            ? `${cleanText.substring(0, 157)}...`
            : cleanText;
        }

        // Extract image from article's media array
        const foundImage = extractFirstImageUrl(articleData.media);
        if (foundImage) {
          dynamicImage = foundImage;
        }
      }
    } catch (error) {
      console.error('Error fetching dynamic article metadata:', error);
    }
  }

  return {
    title: dynamicTitle,
    description: dynamicDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: dynamicTitle,
      description: dynamicDescription,
      url: pageUrl,
      type: 'article',
      locale: 'ku_IQ',
      siteName: 'SFPZK',
      images: [
        {
          url: dynamicImage,
          alt: dynamicTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dynamicTitle,
      description: dynamicDescription,
      images: [dynamicImage],
    },
  };
}

export default async function CustomPage({ params }) {
  const { customPage } = await params;
  const param = decodeURIComponent(customPage);

  const validPages = ['çalakî', 'fêrbûn', 'têkilî', 'fêrname'];

  if (!validPages.includes(param)) {
    notFound();
  }

  return <CustomPageClient param={param} />;
}