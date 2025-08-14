'use client';
import EntryForm from '@/components/EntryForm';
import { useEffect, useState } from 'react';
import { db, auth, provider } from '@/lib/firebase';
import { setDoc, doc, Timestamp } from 'firebase/firestore';
import { signInWithPopup, signOut } from 'firebase/auth';

export default function FormPage() {
  const [user, setUser] = useState(null);

  // Track user state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async (date, title, content, mediaLinks = []) => {
    try {
      const entryId = `${date}-${title}`;
      await setDoc(doc(db, 'entries', entryId), {
        date,
        title,
        content,
        media: mediaLinks,
        createdAt: Timestamp.now(),
        author: {
          name: user.displayName,
          email: user.email,
        },
      });
      // router.push('/');
      // router.refresh();
      location.reload();
    } catch (err) {
      console.error(err);
      if (err.code === 'permission-denied') {
        alert('ليس لديك صلاحية نشر المنشورات. إذا كنت تعتقد أن هذا خطأ، يُرجى التواصل مع أحد المشرفين');
      }
    }
  };


  return (
    <div style={{ padding: 20 }}>
      {!user ? (
        <div>
          <p>Please log in to add an entry.</p>
          <button onClick={handleLogin}>Login with Google</button>
        </div>
      ) : (
        <div>
          <p>Logged in as {user.displayName} ({user.email})</p>
          <button onClick={handleLogout}>Logout</button>
          <h2>Add Entry</h2>
          <EntryForm onSubmit={handleFormSubmit} buttonText="Save Entry" />
        </div>
      )}
    </div>
  );
}
