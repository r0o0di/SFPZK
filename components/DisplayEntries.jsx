"use client";
import EntryCard from '@/components/EntryCard';
import { useAdminState } from '@/lib/useAuth';
import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { db, auth } from '@/lib/firebase';
import {
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { normalizeDateForStorage } from '@/lib/utils';
import { storage } from '@/lib/firebase';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { getStoragePathFromUrl } from '@/lib/storageHelpers';
import { loadTranslationFromCache, saveTranslationToCache } from '@/lib/translationCache';


export default function DisplayEntries() {
  const [entries, setEntries] = useState([]);
  const { user, isAdmin } = useAdminState();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ date: '', title: '', content: '', media: [] });
  const [expandedIds, setExpandedIds] = useState([]);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const historyPushRef = useRef(false);
  const editingIdRef = useRef(null);
  const ignorePopstateRef = useRef(false);


  useEffect(() => {
    editingIdRef.current = editingId;
  }, [editingId]);

  useEffect(() => {
    const handlePopState = () => {
      if (editingIdRef.current) {
        if (ignorePopstateRef.current) {
          ignorePopstateRef.current = false;
          setEditingId(null);
          setEditData({ date: '', title: '', content: '', media: [] });
          historyPushRef.current = false;
          return;
        }

        setShowConfirmClose(true);
        window.history.pushState({ editingEntryId: editingIdRef.current }, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  async function fetchEntries() {
    const ref = collection(db, 'çalakî');
    const q = query(ref, orderBy('date', 'desc'));
    const snap = await getDocs(q);
    setEntries(snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        date: normalizeDateForStorage(data.date),
      };
    }));
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  // const isAdmin = adminList.includes(user?.email);

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    const confirmed = window.confirm('Tu bi rastî dixwazî vê postê rakî?');
    if (!confirmed) return;

    const entry = entries.find(e => e.id === id);
    if (entry && entry.media && Array.isArray(entry.media)) {
      for (const m of entry.media) {
        try {
          let path = null;
          if (typeof m === 'string') path = getStoragePathFromUrl(m);
          else if (typeof m === 'object') path = getStoragePathFromUrl(m.storageUrl || m.url || '');
          if (path) await deleteObject(storageRef(storage, path));
        } catch (err) {
          console.warn('Failed to delete media for entry', id, err?.message || err);
        }
      }
    }

    await deleteDoc(doc(db, 'çalakî', id));
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const resetEditingState = () => {
    setEditingId(null);
    setEditData({ date: '', title: '', content: '', media: [] });
    if (historyPushRef.current && typeof window !== 'undefined') {
      // window.history.replaceState(null, '', window.location.href);
      historyPushRef.current = false;
    }
  };

  const confirmCloseForm = () => {
    setShowConfirmClose(false);
    if (historyPushRef.current && typeof window !== 'undefined') {
      ignorePopstateRef.current = true;
      window.history.back();
    } else {
      resetEditingState();
    }
  };

  const cancelCloseForm = () => {
    setShowConfirmClose(false);
  };

  const handleCancelEdit = () => {
    setShowConfirmClose(true);
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditData({
      date: entry.date,
      title: entry.title,
      content: entry.content,
      media: entry.media || []
    });
    if (typeof window !== 'undefined') {
      window.history.pushState({ editingEntryId: entry.id }, '', window.location.href);
      historyPushRef.current = true;
    }
    setTimeout(() => {
      const el = document.getElementById(entry.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleEditSubmit = async (date, title, content, media) => {
    if (!isAdmin || !editingId) return;
    const normalizedDate = normalizeDateForStorage(date);
    const newId = `${normalizedDate}`;

    let prevHistory = [];
    let originalAuthor = null;
    let originalCreatedAt = null;
    try {
      const oldDocSnapshot = await getDoc(doc(db, 'çalakî', editingId));
      const oldData = oldDocSnapshot.exists() ? oldDocSnapshot.data() : null;
      if (oldData?.history) prevHistory = oldData.history;
      if (oldData?.author) originalAuthor = oldData.author;
      if (oldData?.createdAt) originalCreatedAt = oldData.createdAt;
    } catch (err) {
      // ignore
    }

    const newHistory = [
      ...prevHistory,
      { editedAt: Timestamp.now(), editor: user?.email || 'unknown' }
    ];

    await setDoc(doc(db, 'çalakî', newId), {
      date: normalizedDate,
      title,
      content,
      media,
      ...(originalCreatedAt ? { createdAt: originalCreatedAt } : {}),
      ...(originalAuthor ? { author: originalAuthor } : {}),
      history: newHistory
    }, { merge: true });

    if (newId !== editingId) await deleteDoc(doc(db, 'çalakî', editingId));

    resetEditingState();
    fetchEntries();
  };

  const handleTranslate = async (entryId, content, targetLang) => {
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, translating: true } : e));

    const cachedTranslation = loadTranslationFromCache(entryId, targetLang, content);
    if (cachedTranslation) {
      setEntries(prev => prev.map(e =>
        e.id === entryId
          ? { ...e, translatedContent: cachedTranslation, translating: false }
          : e
      ));
      return;
    }

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, target: targetLang })
      });
      const data = await res.json();
      if (data.translatedText) {
        saveTranslationToCache(entryId, targetLang, content, data.translatedText);
        setEntries(prev => prev.map(e =>
          e.id === entryId
            ? { ...e, translatedContent: data.translatedText, translating: false }
            : e
        ));
      } else {
        throw new Error(data.error || 'Translation failed');
      }
    } catch (err) {
      console.error(err);
      setEntries(prev => prev.map(e => e.id === entryId ? { ...e, translating: false } : e));
    }
  };

  const resetTranslation = (entryId) => {
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, translatedContent: null } : e));
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen py-10 bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto">
        <Dialog open={showConfirmClose} onOpenChange={(open) => { if (!open) setShowConfirmClose(false); }}>
          <DialogContent className="bg-gray-900 border border-gray-700 shadow-2xl max-w-md mx-auto rounded-2xl transition-all duration-300">
            <DialogTitle className="text-lg font-semibold text-gray-100 mb-2">Formê bigire</DialogTitle>
            <p className="text-sm text-gray-200 mb-4">Forma sererastkirinê bigire?</p>
            <div className="flex justify-end gap-2">
              <Button type="button" className="bg-red-900 hover:bg-red-600 text-white cursor-pointer" onClick={cancelCloseForm}>Na</Button>
              <Button type="button" className="bg-green-600 hover:bg-green-500 text-white cursor-pointer" onClick={confirmCloseForm}>Erê</Button>
            </div>
          </DialogContent>
        </Dialog>

        <h1 className="text-3xl font-semibold text-center mb-8 text-yellow-200">Çalakî</h1>

        {entries.length === 0 && (
          <p className="text-center text-gray-400">Ein Moment warten...</p>
        )}

        {entries.map(entry => (
          <EntryCard
            key={entry.id}
            entry={entry}
            isAdmin={isAdmin}
            isExpanded={expandedIds.includes(entry.id)}
            isEditing={editingId === entry.id}
            editData={editData}
            onStartEdit={startEdit}
            onCancelEdit={handleCancelEdit}
            onSubmitEdit={handleEditSubmit}
            onDelete={handleDelete}
            onToggleExpand={toggleExpand}
            onTranslate={handleTranslate}
            onResetTranslation={resetTranslation}
          />
        ))}
      </div>
    </div>
  );
}