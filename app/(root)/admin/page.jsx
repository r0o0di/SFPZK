'use client';
import EntryForm from '@/components/EntryForm';
import { db, auth, provider } from '@/lib/firebase';
import { setDoc, doc, Timestamp } from 'firebase/firestore';
import { signInWithPopup, signOut } from 'firebase/auth';
import { Loader2Icon } from 'lucide-react';
import { useAuthState } from '@/lib/useAuth';
import { saveToFirestore } from '@/lib/firestoreHelpers';
import { normalizeDateForStorage } from '@/lib/utils';

export default function FormPage() {
  const { user, authLoading } = useAuthState();

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
      const entryId = `${normalizeDateForStorage(date)}`;
      const payload = {
        date: normalizeDateForStorage(date),
        title,
        content,
        media: mediaLinks,
        createdAt: Timestamp.now(),
        author: {
          name: user.displayName,
          email: user.email,
        },
      };
      await saveToFirestore('çalakî', entryId, payload);
    } catch (err) {
      console.error(err);
      if (err.code === 'permission-denied') {
        alert('ليس لديك الصلاحية لنشر المنشورات. إذا كنت تعتقد أن هذا خطأ، يُرجى التواصل مع أحد المشرفين');
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-3xl bg-slate-900/80 border border-slate-700 p-10 text-center">
          <Loader2Icon className="animate-spin inline size-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center py-[1.5rem] px-[.5rem]">
      <div className="w-full max-w-4xl">
        {!user ? (
          <div className="grid gap-6 text-center">
            <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-8 shadow-sm">
              <h1 className="text-3xl font-semibold text-yellow-200 mb-4">Admin</h1>
              <p className="text-slate-300 mb-6">
                Ji bo ku tu bikaribî çalakiyan biweşînî û sererast bikî, xwe bi hesabê xwe yê Google-ê ve girêde.
              </p>
              <button className="inline-flex items-center justify-center rounded-2xl bg-green-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-600 cursor-pointer" onClick={handleLogin}>
                Girêde
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 mt-[3rem]">
            <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-yellow-200 text-lg font-semibold">{user.displayName}</p>
                  <p className="text-slate-300 text-sm">{user.email}</p>
                </div>
                <button className="rounded-2xl bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600 cursor-pointer" onClick={handleLogout}>
                  Derkeve
                </button>
              </div>
            </div>

              <h1 className="text-3xl font-semibold text-center text-yellow-200 mt-4">Çalakîyeke Nû Biweşîne</h1>
              <EntryForm onSubmit={handleFormSubmit} buttonText="Biweşîne" />
          </div>
        )}
      </div>
    </div>
  );
}