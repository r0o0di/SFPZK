'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { formatDateForDisplay, normalizeDateForStorage } from '@/lib/utils';

export default function SearchEntries() {
  const [entries, setEntries] = useState([]);
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchEntries() {
      const ref = collection(db, 'entries');
      const q = query(ref, orderBy('date', 'desc'));
      const snap = await getDocs(q);
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchEntries();
  }, []);

  useEffect(() => {
    if (!queryText) {
      setResults([]);
      return;
    }
    const q = queryText.toLowerCase();
    setResults(
      entries.filter(
        entry =>
          entry.title.toLowerCase().includes(q) ||
          formatDateForDisplay(entry.date).toLowerCase().includes(q) ||
          normalizeDateForStorage(entry.date).toLowerCase().includes(q)
      )
    );
  }, [queryText, entries]);

  const handleResultClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ position: 'fixed', width: '100%', padding: 8, zIndex: 99 }}>
      <input
        type="text"
        placeholder="Search by date (Roj-Meh-Sal) or title..."
        style={{ width: '100%', padding: 8, outline: "1px solid" }}
        value={queryText}
        onChange={e => setQueryText(e.target.value)}
      />

      {results.length > 0 && (
        <div style={{ marginTop: 12, background: '#2f2f2f', borderRadius: 8, boxShadow: '0 1px 4px #eee', padding: 8 }}>
          {results.map(entry => (
            <div
              key={entry.id}
              style={{ cursor: 'pointer', marginBottom: 10, padding: 6 }}
              onClick={() => handleResultClick(entry.id)}
            >
              <div style={{ color: "white" }}>{entry.title}</div>
              <small style={{ color: '#666' }}>{formatDateForDisplay(entry.date)}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}