// this page uses dynamic routing 
// because otherwise it would not be able to handle 
// special characters like ç, î, ê in the URL
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CustomPageClient from './CustomPageClient';

export async function generateMetadata({ params }) {
  const { customPage } = await params;
  const param = decodeURIComponent(customPage);

  const metadata = {
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

  const page = metadata[param];

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,

    alternates: {
      canonical: page.url,
    },

    openGraph: {
      title: page.title,
      description: page.description,
      url: page.url,
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
      title: page.title,
      description: page.description,
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