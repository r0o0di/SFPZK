// this page uses dynamic routing 
// because otherwise it would not be able to handle 
// special characters like ç, î, ê in the URL
// app/[customPage]/page.js (or your dynamic route file)
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase'; // Or Firebase Admin Admin SDK if preferred
import { doc, getDoc } from 'firebase/firestore';
import CustomPageClient from './CustomPageClient';

export async function generateMetadata({ params, searchParams }) {
  const { customPage } = await params;
  const param = decodeURIComponent(customPage);
  const resolvedSearchParams = await searchParams;
  const articleId = resolvedSearchParams?.article;

  // Base page metadata defaults
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
  let pageUrl = `${page.url}${articleId ? `?article=${encodeURIComponent(articleId)}` : ''}`;

  // Fetch specific article data for dynamic social metadata
  if (param === 'çalakî' && articleId) {
    try {
      const docRef = doc(db, 'çalakî', articleId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.title) {
          dynamicTitle = `${data.title} | Çalakî - SFPZK`;
        }
        if (data.content) {
          // Truncate content for social description preview (~160 chars)
          const cleanText = data.content.replace(/\s+/g, ' ').trim();
          dynamicDescription = cleanText.length > 160 
            ? `${cleanText.substring(0, 157)}...` 
            : cleanText;
        }
      }
    } catch (error) {
      console.error('Error fetching article for metadata:', error);
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
      type: 'website',
      locale: 'ku_IQ',
      siteName: 'SFPZK',
      images: [
        {
          url: '/sfpzk-logo.png',
          width: 1200,
          height: 630,
          alt: 'SFPZK',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dynamicTitle,
      description: dynamicDescription,
      images: ['/sfpzk-logo.png'],
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