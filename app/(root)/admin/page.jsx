'use client';
import EntryForm from '@/components/EntryForm';
import { db, auth, provider } from '@/lib/firebase';
import { setDoc, doc, Timestamp } from 'firebase/firestore';
import { signInWithPopup, signOut } from 'firebase/auth';
import { Loader2Icon } from 'lucide-react';
import { useAuthState } from '@/lib/useAuth';

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
      const entryId = `${date}`;
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
      // location.reload();
    } catch (err) {
      console.error(err);
      if (err.code === 'permission-denied') {
        alert('ليس لديك الصلاحية لنشر المنشورات. إذا كنت تعتقد أن هذا خطأ، يُرجى التواصل مع أحد المشرفين');
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-8">
        <div className=" p-8 text-center">
          <Loader2Icon className="animate-spin inline size-10" />
        </div>
      </div>
    );
  } else {

    return (

      <div className='mt-20'>
        {!user ? (
          <div className="mx-2">
            <p>Ji bo ku tu bikaribî çalakiyan biweşînî û sererast bikî, xwe bi hesabê xwe yê Google-ê ve girêde</p>
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer" onClick={handleLogin}>Girêde</button>
          </div>
        ) : (
          <>
            <p className=" mx-2">{user.displayName} ({user.email})</p>
            <p className="mx-2">Ji hesabê xwe yê Google-ê derkeve:</p>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded cursor-pointer mx-2">
              Derkeve
            </button>
            <div style={{ height: "90vh", alignContent: "center" }}>
              <EntryForm onSubmit={handleFormSubmit} buttonText="Biweşîne" />
            </div>
          </>
        )}

      </div>
    );
  }
}