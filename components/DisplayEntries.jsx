"use client";
import EntryForm from '@/components/EntryForm';
import Share from "@/components/Share";
import { adminList } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { SquarePen, Trash2, Languages, Loader2Icon } from "lucide-react";
import TranslateMenu from './TranslateMenu';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { db, auth } from '@/lib/firebase';
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { storage } from '@/lib/firebase';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { Button } from '@/components/ui/button';


export default function DisplayEntries() {
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ date: '', title: '', content: '', media: [] });
  const [activeMenu, setActiveMenu] = useState(null); // id of open menu
  const [expandedIds, setExpandedIds] = useState([]);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const historyPushRef = useRef(false);
  const editingIdRef = useRef(null);
  const ignorePopstateRef = useRef(false);

  const menusRef = useRef({}); // store refs for menus to support click outside

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

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
    const ref = collection(db, 'entries');
    const q = query(ref, orderBy('date'));
    const snap = await getDocs(q);
    setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  // close dropdowns when clicking outside
  useEffect(() => {
    function handleDocClick(e) {
      if (!activeMenu) return;
      const ref = menusRef.current[activeMenu];
      const shareDialog = document.getElementById('share');
      if (shareDialog && shareDialog.contains(e.target)) return;
      if (ref && !ref.contains(e.target)) setActiveMenu(null);
    }
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [activeMenu]);

  function renderMedia(link, pointerEvents = 'none') {
    if (!link) return null;

    // YouTube
    if (/youtube\.com\/watch\?v=|youtu\.be\//.test(link)) {
      const match = link.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      const videoId = match ? match[1] : null;
      if (!videoId) return null;
      return (
        <div className="aspect-video w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allow=" autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            className={`w-full h-full rounded-lg shadow-sm`}
          />
        </div>
      );
    }

    // Facebook
    if (/facebook\.com/.test(link)) {
      const encoded = encodeURIComponent(link);
      return (
        <div className="w-full">
          <iframe
            src={`https://www.facebook.com/plugins/post.php?href=${encoded}&show_text=false&width=500`}
            width="100%"
            height="673"
            className={`rounded-lg overflow-hidden`}
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media"
          />
        </div>
      );
    }

    // Imgur
    if (/imgur\.com/.test(link)) {
      const match = link.match(/imgur\.com\/(?:gallery\/|a\/)?([A-Za-z0-9]+)/);
      if (!match) return null;
      return (
        <img
          src={`https://i.imgur.com/${match[1]}.jpg`}
          alt="Imgur"
          className={`w-full rounded-lg`}
        />
      );
    }

    // Firebase Storage images
    if (/firebasestorage\.googleapis\.com/.test(link)) {
      return (
        <div className="w-full h-full flex items-center justify-center rounded-lg">
          <img
            src={link}
            alt="Photo"
            loading="lazy"
            className={`w-full object-cover rounded-lg`}
          />
        </div>
      );
    }

    return null;
  }

  const isAdmin = adminList.includes(user?.email);

  // helper to convert download URL to storage path (/images/...) for deleteObject
  function getStoragePathFromUrl(url) {
    try {
      const u = new URL(url);
      const match = u.pathname.match(/\/o\/(.+)/);
      if (!match) return null;
      return decodeURIComponent(match[1]);
    } catch (err) {
      return null;
    }
  }

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    const confirmed = window.confirm('Möchtest du diesen Beitrag wirklich löschen?');
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

    await deleteDoc(doc(db, 'entries', id));
    setEntries(prev => prev.filter(e => e.id !== id));
    if (activeMenu === id) setActiveMenu(null);
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
    setActiveMenu(null);
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
    const newId = `${date}`;

    let prevHistory = [];
    try {
      const all = await getDocs(query(collection(db, 'entries'), orderBy('date', 'desc')));
      const oldDoc = all.docs.find(d => d.id === editingId);
      if (oldDoc && oldDoc.data().history) prevHistory = oldDoc.data().history;
    } catch (err) {
      // ignore
    }

    const newHistory = [
      ...prevHistory,
      { editedAt: Timestamp.now(), editor: user?.email || 'unknown' }
    ];

    await setDoc(doc(db, 'entries', newId), {
      date,
      title,
      content,
      media,
      createdAt: Timestamp.now(),
      author: {
        name: user?.displayName || 'unknown',
        email: user?.email || 'unknown'
      },
      history: newHistory
    });

    if (newId !== editingId) await deleteDoc(doc(db, 'entries', editingId));

    resetEditingState();
    fetchEntries();
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const registerMenuRef = (id, node) => {
    if (!node) delete menusRef.current[id];
    else menusRef.current[id] = node;
  };

  function GalleryGroup({ media, renderMedia }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      function handleKey(e) {
        if (!isDialogOpen) return;
        if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % media.length);
        else if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
      }
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }, [isDialogOpen, media]);

    if (!media || media.length === 0) return null;

    // Determine how many tiles to show in the preview grid.
    // Show all when 1-4, but when 5+ show only first 4 with overlay on the 4th.
    const showCount = media.length >= 5 ? 4 : media.length;
    const extra = Math.max(0, media.length - showCount);

    // Choose grid shape based on showCount
    // 1 -> single large
    // 2 -> two side-by-side
    // 3 -> 2x2 grid with bottom-right empty (items at TL, TR, BL)
    // 4 -> 2x2 grid
    const gridClass = (() => {
      if (showCount === 1) return 'grid-cols-1 grid-rows-1';
      if (showCount === 2) return 'grid-cols-2 grid-rows-1';
      return 'grid-cols-2 grid-rows-2';
    })();

    // Map visible indexes to explicit grid positions so we can leave bottom-right empty for 3 items
    const positionStyle = (idx) => {
      if (showCount === 1) return { gridColumn: '1 / 2', gridRow: '1 / 2' };
      if (showCount === 2) {
        return { gridColumn: `${idx + 1} / ${idx + 2}`, gridRow: '1 / 2' };
      }
      // for 3 or 4 (2x2)
      switch (idx) {
        case 0: return { gridColumn: '1 / 2', gridRow: '1 / 2' }; // top-left
        case 1: return { gridColumn: '2 / 3', gridRow: '1 / 2' }; // top-right
        case 2: return { gridColumn: '1 / 2', gridRow: '2 / 3' }; // bottom-left
        case 3: return { gridColumn: '2 / 3', gridRow: '2 / 3' }; // bottom-right
        default: return {}; 
      }
    };

    const visible = media.slice(0, showCount);

    return (
      <>
        <div className={`grid ${gridClass} gap-1 my-2 rounded-lg overflow-hidden`} style={{ aspectRatio: '16 / 9' }}>
          {visible.map((link, idx) => (
            <div
              key={idx}
              style={positionStyle(idx)}
              className="relative w-full h-full bg-gray-700 overflow-hidden cursor-pointer hover:opacity-90 transition"
              onClick={() => { setCurrentIndex(idx); setIsDialogOpen(true); }}
            >
              <div className="w-full h-full">{renderMedia(link)}</div>

              {extra > 0 && idx === showCount - 1 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative text-white text-2xl font-semibold">+{extra}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-transparent border-none">
            <DialogTitle className="sr-only">Media Gallery</DialogTitle>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-full h-full overflow-hidden rounded-lg shadow-lg">
                {media.length > 0 && renderMedia(media[currentIndex], 'auto')}
              </div>

              {media.length > 1 && (
                <button
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length)}
                  className="text-[2rem] absolute left-[-1.75rem] text-white/80 hover:text-white p-2 bg-black/40 rounded-full cursor-pointer"
                >
                  ‹
                </button>
              )}

              {media.length > 1 && (
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % media.length)}
                  className="text-[2rem] absolute right-[-1.75rem] text-white/80 hover:text-white p-2 bg-black/40 rounded-full cursor-pointer"
                >
                  ›
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

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

        {entries.map(entry => {
          const isExpanded = expandedIds.includes(entry.id);
          const textTooLong = (entry.content || '').length > 420; // approx threshold

          return (
            <article
              key={entry.id}
              id={entry.id}
              className="relative bg-gray-800 rounded-2xl shadow-none border border-gray-700 p-6 mb-8 transition-shadow hover:shadow-md"
            >
              {editingId === entry.id ? (
                <div className="bg-gray-800 rounded-lg p-4 -mx-4">
                  <EntryForm
                    initialDate={editData.date}
                    initialTitle={editData.title}
                    initialContent={editData.content}
                    initialMedia={editData.media}
                    onSubmit={handleEditSubmit}
                    buttonText="Sererast bike"
                    onCancel={handleCancelEdit}
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-100">{entry.title}</h2>
                      <div className="text-sm text-gray-400 mt-1 mr-2 inline">{entry.date}</div>
                      {entry.translatedContent && (
                          <button
                            onClick={() => {
                              setEntries(prev => prev.map(e =>
                                e.id === entry.id ? { ...e, translatedContent: null } : e
                              ));
                            }}
                            className="text-blue-400 hover:underline text-sm inline cursor-pointer"
                          >
                            <Languages strokeWidth={1.5} className='inline' />Original zeigen 
                          </button>
                        )}
                    </div>

                    {/* Dropdown Menu */}
                    <div
                      className="relative"
                      ref={node => registerMenuRef(entry.id, node)}
                    >
                      <button
                        aria-label="open menu"
                        onClick={() => setActiveMenu(activeMenu === entry.id ? null : entry.id)}
                        className="p-1 rounded-md hover:bg-gray-700 transition-all duration-250 cursor-pointer"
                      >
                        <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <circle cx="12" cy="5" r="1.5"></circle>
                          <circle cx="12" cy="12" r="1.5"></circle>
                          <circle cx="12" cy="19" r="1.5"></circle>
                        </svg>
                      </button>

                      <div className={`absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-30 origin-top-right transition-all duration-250 ${activeMenu === entry.id ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => startEdit(entry)}
                              className="flex gap-3 w-full text-left px-3 py-2 hover:bg-gray-700 transition text-sm"
                            >
                              <SquarePen size={20} strokeWidth={1.5} />
                              Sererastkirin 
                            </button>
                          </>
                        )}

                        <TranslateMenu
                          onTranslate={async (targetLang) => {
                            if (!entry.content) return;
                            setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, translating: true } : e));
                            try {
                              const res = await fetch('/api/translate', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ text: entry.content, target: targetLang })
                              });
                              const data = await res.json();
                              if (data.translatedText) {
                                setEntries(prev => prev.map(e =>
                                  e.id === entry.id
                                    ? { ...e, translatedContent: data.translatedText, translating: false }
                                    : e
                                ));
                              } else {
                                throw new Error(data.error || 'Translation failed');
                              }
                            } catch (err) {
                              console.error(err);
                              setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, translating: false } : e));
                            }
                            setActiveMenu(null);
                          }}
                        />

                        <Share id={entry.id} />

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="flex gap-3 w-full text-left px-3 py-2 hover:bg-gray-700 transition text-sm text-red-400"
                            >
                              <Trash2 size={20} strokeWidth={1.5} />
                              Rakirin
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="relative">
                      <div
                        className={`text-gray-200 leading-relaxed whitespace-pre-wrap ${!isExpanded && textTooLong ? 'overflow-hidden' : ''}`}
                        style={!isExpanded && textTooLong ? { maxHeight: '6.2em' } : {}}
                      >
                        <p>
                          {entry.translating
                            ? (<> <Loader2Icon className="animate-spin inline" /> Übersetzen...</>)
                            : entry.translatedContent
                              ? entry.translatedContent
                              : entry.content
                          } 
                        </p>
                      </div>

                      <div className="mt-1 mb-4 flex gap-2">
                        {textTooLong && (
                          <button
                            onClick={() => toggleExpand(entry.id)}
                            className="text-blue-400 hover:underline cursor-pointer"
                          >
                            {isExpanded ? 'Weniger zeigen' : 'Mehr zeigen...'}
                          </button>
                        )}
                      </div>
                    </div>

                    {entry.media && entry.media.length > 0 && (
                      <GalleryGroup media={entry.media} renderMedia={renderMedia} />
                    )}

                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
