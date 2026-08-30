// app/sitemap.js
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { formatDateForDisplay } from '@/lib/utils'; // Or your date formatter helper

export default async function sitemap() {
  const baseUrl = 'https://sfpzk.com';

  // Static routes
  const routes = [
    {
      url: `${baseUrl}/çalakî`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/fêrbûn`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/têkilî`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.1,
    },
  ];

  // Fetch all articles to dynamically construct URL query parameters
  try {
    const snap = await getDocs(collection(db, 'çalakî'));
    const articleUrls = snap.docs.map((doc) => {
      const data = doc.data();
      // Format doc date to match your share link format (dd-mm-yyyy)
      const displayDate = formatDateForDisplay(data.date || doc.id);

      return {
        url: `${baseUrl}/çalakî?article=${encodeURIComponent(displayDate)}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      };
    });

    return [...routes, ...articleUrls];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return routes;
  }
}