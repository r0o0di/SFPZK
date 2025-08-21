'use client';

import EntryForm from '@/components/EntryForm';
import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore';

export default function DisplayEntries() {
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ date: '', title: '', content: '', media: [] });
  const [activeId, setActiveId] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  async function fetchEntries() {
    const ref = collection(db, 'entries');
    const q = query(ref, orderBy('date', 'desc'));
    const snap = await getDocs(q);
    setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  function renderMedia(link) {
    if (/youtube\.com\/watch\?v=|youtu\.be\//.test(link)) {
      // Extract video ID
      let videoId = '';
      const ytMatch = link.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      if (ytMatch) videoId = ytMatch[1];
      if (videoId) {
        return (
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            style={{ marginBottom: 10 }}
          />
        );
      }
    }
    if (/facebook\.com/.test(link)) {
      const encoded = encodeURIComponent(link);
      return (
        <iframe
          src={`https://www.facebook.com/plugins/post.php?href=${encoded}&show_text=true&width=500`}
          width="500"
          height="673"
          style={{ border: "none", overflow: "hidden", marginBottom: 10 }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        />
      );
    }
    if (/imgur\.com/.test(link)) {
      // Extract image ID
      const imgMatch = link.match(/imgur\.com\/(?:gallery\/|a\/)?([A-Za-z0-9]+)/);
      if (imgMatch) {
        return (
          <img
            src={`https://i.imgur.com/${imgMatch[1]}.jpg`}
            alt="Imgur"
            style={{ wdth: 350, marginBottom: 10 }}
          />
        );
      }
    }
    return null;
  }
  const adminList = ['rodikhello2000@gmail.com', 'rodykhello@gmail.com', "sfpzk.s@gmail.com"];
  const isAdmin = adminList.includes(user?.email);

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    const confirmed = window.confirm('هل أنت متأكد أنك تريد حذف هذه المنشور؟');
    if (!confirmed) return;
    await deleteDoc(doc(db, 'entries', id));
    setEntries(entries.filter(e => e.id !== id));
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditData({ date: entry.date, title: entry.title, content: entry.content, media: entry.media || [] });
  };

  const handleEditSubmit = async (date, title, content, media) => {
    if (!isAdmin || !editingId) return;
    const newId = `${date}-${title}`;

    // Get previous history if exists
    let prevHistory = [];
    const oldDocRef = doc(db, 'entries', editingId);
    const oldDocSnap = await getDocs(query(collection(db, 'entries'), orderBy('date', 'desc')));
    const oldDoc = oldDocSnap.docs.find(d => d.id === editingId);
    if (oldDoc && oldDoc.data().history) {
      prevHistory = oldDoc.data().history;
    }

    // Add new history entry
    const newHistory = [
      ...prevHistory,
      {
        editedAt: Timestamp.now(),
        editor: user.email,
      },
    ];

    await setDoc(doc(db, 'entries', newId), {
      date,
      title,
      content,
      media,
      createdAt: Timestamp.now(),
      author: {
        name: user.displayName,
        email: user.email,
      },
      history: newHistory,
    });

    if (newId !== editingId) {
      await deleteDoc(doc(db, 'entries', editingId));
    }

    setEditingId(null);
    setEditData({ date: '', title: '', content: '', media: [] });
    fetchEntries();
  };

  return (
    <div>
      {entries.map(entry => (
        <section key={entry.id} id={entry.id} style={{ marginBottom: 20 }}>
          {editingId === entry.id ? (
            <EntryForm
              initialDate={editData.date}
              initialTitle={editData.title}
              initialContent={editData.content}
              initialMedia={editData.media}
              onSubmit={handleEditSubmit}
              buttonText="Save"
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              {isAdmin && (
                <>
                  {/* Delete */}
                  <button className='cursor-pointer' onClick={() => handleDelete(entry.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> Delete
                  </button> ||
                  {/* Edit */}
                  <button className='cursor-pointer' onClick={() => startEdit(entry)}>
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 inline lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg> Edit
                  </button> 
                </>
              )}
              <h3>{entry.title}</h3>
              <small>{entry.date}</small>
              <p>{entry.content}</p>
              {entry.media && entry.media.map((link, idx) => (
                <div key={idx}>{renderMedia(link)}</div>
              ))}
            </>
          )}
        </section>
      ))}
    </div>
  );
}