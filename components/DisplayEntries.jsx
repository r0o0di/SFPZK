// 'use client';

// import EntryForm from '@/components/EntryForm';
// import { useEffect, useState } from 'react';
// import { db, auth } from '@/lib/firebase';
// import { collection, getDocs, orderBy, query, deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore';

// export default function DisplayEntries() {
//   const [entries, setEntries] = useState([]);
//   const [user, setUser] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({ date: '', title: '', content: '', media: [] });
//   const [activeId, setActiveId] = useState(null);


//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(setUser);
//     return () => unsubscribe();
//   }, []);

//   async function fetchEntries() {
//     const ref = collection(db, 'entries');
//     const q = query(ref, orderBy('date', 'desc'));
//     const snap = await getDocs(q);
//     setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//   }

//   useEffect(() => {
//     fetchEntries();
//   }, []);

//   function renderMedia(link) {
//     if (/youtube\.com\/watch\?v=|youtu\.be\//.test(link)) {
//       // Extract video ID
//       let videoId = '';
//       const ytMatch = link.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
//       if (ytMatch) videoId = ytMatch[1];
//       if (videoId) {
//         return (
//           <iframe
//             width="560"
//             height="315"
//             src={`https://www.youtube.com/embed/${videoId}`}
//             title="YouTube video player"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             referrerPolicy="strict-origin-when-cross-origin"
//             allowFullScreen
//             style={{ marginBottom: 10 }}
//           />
//         );
//       }
//     }
//     if (/facebook\.com/.test(link)) {
//       const encoded = encodeURIComponent(link);
//       return (
//         <iframe
//           src={`https://www.facebook.com/plugins/post.php?href=${encoded}&show_text=true&width=500`}
//           width="500"
//           height="673"
//           style={{ border: "none", overflow: "hidden", marginBottom: 10 }}
//           scrolling="no"
//           frameBorder="0"
//           allowFullScreen={true}
//           allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
//         />
//       );
//     }
//     if (/imgur\.com/.test(link)) {
//       // Extract image ID
//       const imgMatch = link.match(/imgur\.com\/(?:gallery\/|a\/)?([A-Za-z0-9]+)/);
//       if (imgMatch) {
//         return (
//           <img
//             src={`https://i.imgur.com/${imgMatch[1]}.jpg`}
//             alt="Imgur"
//             style={{ wdth: 350, marginBottom: 10 }}
//           />
//         );
//       }
//     }
//     return null;
//   }
//   const adminList = ['rodikhello2000@gmail.com', 'rodykhello@gmail.com', "sfpzk.s@gmail.com"];
//   const isAdmin = adminList.includes(user?.email);

//   const handleDelete = async (id) => {
//     if (!isAdmin) return;
//     const confirmed = window.confirm('هل أنت متأكد أنك تريد حذف هذه المنشور؟');
//     if (!confirmed) return;
//     await deleteDoc(doc(db, 'entries', id));
//     setEntries(entries.filter(e => e.id !== id));
//   };

//   const startEdit = (entry) => {
//     setEditingId(entry.id);
//     setEditData({ date: entry.date, title: entry.title, content: entry.content, media: entry.media || [] });
//   };

//   const handleEditSubmit = async (date, title, content, media) => {
//     if (!isAdmin || !editingId) return;
//     const newId = `${date}-${title}`;

//     // Get previous history if exists
//     let prevHistory = [];
//     const oldDocRef = doc(db, 'entries', editingId);
//     const oldDocSnap = await getDocs(query(collection(db, 'entries'), orderBy('date', 'desc')));
//     const oldDoc = oldDocSnap.docs.find(d => d.id === editingId);
//     if (oldDoc && oldDoc.data().history) {
//       prevHistory = oldDoc.data().history;
//     }

//     // Add new history entry
//     const newHistory = [
//       ...prevHistory,
//       {
//         editedAt: Timestamp.now(),
//         editor: user.email,
//       },
//     ];

//     await setDoc(doc(db, 'entries', newId), {
//       date,
//       title,
//       content,
//       media,
//       createdAt: Timestamp.now(),
//       author: {
//         name: user.displayName,
//         email: user.email,
//       },
//       history: newHistory,
//     });

//     if (newId !== editingId) {
//       await deleteDoc(doc(db, 'entries', editingId));
//     }

//     setEditingId(null);
//     setEditData({ date: '', title: '', content: '', media: [] });
//     fetchEntries();
//   };

//   return (
//     <div>
//       {entries.map(entry => (
//         <section key={entry.id} id={entry.id} style={{ marginBottom: 20 }}>
//           {editingId === entry.id ? (
//             <EntryForm
//               initialDate={editData.date}
//               initialTitle={editData.title}
//               initialContent={editData.content}
//               initialMedia={editData.media}
//               onSubmit={handleEditSubmit}
//               buttonText="Save"
//               onCancel={() => setEditingId(null)}
//             />
//           ) : (
//             <>
//               {isAdmin && (
//                 <>
//                   {/* Delete */}
//                   <button className='cursor-pointer' onClick={() => handleDelete(entry.id)}>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> Delete
//                   </button> ||
//                   {/* Edit */}
//                   <button className='cursor-pointer' onClick={() => startEdit(entry)}>
//                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 inline lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg> Edit
//                   </button> 
//                 </>
//               )}
//               <h3>{entry.title}</h3>
//               <small>{entry.date}</small>
//               <p>{entry.content}</p>
//               {entry.media && entry.media.map((link, idx) => (
//                 <div key={idx}>{renderMedia(link)}</div>
//               ))}
//             </>
//           )}
//         </section>
//       ))}
//     </div>
//   );
// }


'use client';

import EntryForm from '@/components/EntryForm';
import { useEffect, useRef, useState } from 'react';
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


export default function DisplayEntries() {
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ date: '', title: '', content: '', media: [] });
  const [activeMenu, setActiveMenu] = useState(null); // id of open menu
  const [expandedIds, setExpandedIds] = useState([]);

  const menusRef = useRef({}); // store refs for menus to support click outside

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

  // close dropdowns when clicking outside
  useEffect(() => {
    function handleDocClick(e) {
      // if activeMenu is null no need to check
      if (!activeMenu) return;
      const ref = menusRef.current[activeMenu];
      if (ref && !ref.contains(e.target)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [activeMenu]);

  function renderMedia(link, pointerEvents = 'none') {
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
            className={`w-full h-full rounded-lg shadow-sm pointer-events-${pointerEvents}`}
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
            className={`rounded-lg overflow-hidden pointer-events-${pointerEvents}`}
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
        // <div className="w-full h-full">
        <img
          src={`https://i.imgur.com/${match[1]}.jpg`}
          alt="Imgur"
          className={`w-full rounded-lg pointer-events-${pointerEvents}`}
        />
        // </div>
      );
    }

    return null;
  }

  function GalleryGroup({ media, renderMedia }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentGroup, setCurrentGroup] = useState([]);

    // handle keyboard navigation
    useEffect(() => {
      function handleKey(e) {
        if (!isDialogOpen) return;
        if (e.key === 'ArrowRight') {
          setCurrentIndex((prev) => (prev + 1) % currentGroup.length);
        } else if (e.key === 'ArrowLeft') {
          setCurrentIndex((prev) => (prev - 1 + currentGroup.length) % currentGroup.length);
        }
      }
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }, [isDialogOpen, currentGroup]);

    return (
      <>
        {Array.from({ length: Math.ceil(media.length / 10) }, (_, groupIdx) => {
          const group = media.slice(groupIdx * 10, groupIdx * 10 + 10);
          const count = group.length;

          // Discord-style layout
          let gridTemplate;
          switch (count) {
            case 1: gridTemplate = 'grid-cols-1 grid-rows-1'; break;
            case 2: gridTemplate = 'grid-cols-2 grid-rows-1'; break;
            case 3: gridTemplate = 'grid-cols-2 grid-rows-2'; break;
            case 4: gridTemplate = 'grid-cols-2 grid-rows-2'; break;
            case 5: gridTemplate = 'grid-cols-3 grid-rows-2'; break;
            case 6: gridTemplate = 'grid-cols-3 grid-rows-2'; break;
            case 7: gridTemplate = 'grid-cols-4 grid-rows-2'; break;
            case 8: gridTemplate = 'grid-cols-4 grid-rows-2'; break;
            case 9: gridTemplate = 'grid-cols-3 grid-rows-3'; break;
            case 10:
            default:
              gridTemplate = 'grid-cols-4 grid-rows-3';
              break;
          }

          return (
            <div
              key={groupIdx}
              className={`grid ${gridTemplate} gap-1 my-2 rounded-lg overflow-hidden`}
              style={{ aspectRatio: '16 / 9' }}
            >
              {group.map((link, idx) => (
                <div
                  key={idx}
                  className="relative w-full h-full bg-gray-700 overflow-hidden cursor-pointer hover:opacity-90 transition"
                  onClick={() => {
                    setCurrentGroup(group);
                    setCurrentIndex(idx);
                    setIsDialogOpen(true);
                  }}
                >
                  <div className="w-full h-full">
                    <div className="w-full h-full overflow-hidden">
                      <div className="w-full h-full">
                        {renderMedia(link)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        {/* GALLERY DIALOG / POPUP */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-transparent border-none">
            <DialogTitle className="sr-only">Media Gallery</DialogTitle>
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Media */}
              <div className="w-full h-full max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg shadow-lg">
                {currentGroup.length > 0 && renderMedia(currentGroup[currentIndex], 'auto')}
              </div>

              {/* Left arrow */}
              {currentGroup.length > 1 && (
                <button
                  onClick={() =>
                    setCurrentIndex((prev) => (prev - 1 + currentGroup.length) % currentGroup.length)
                  }
                  className="bg-gray-700 text-[2rem] absolute left-[-1.75rem] text-white/80 hover:text-white p-2 bg-black/40 rounded-full cursor-pointer"
                >
                  ‹
                </button>
              )}

              {/* Right arrow */}
              {currentGroup.length > 1 && (
                <button
                  onClick={() =>
                    setCurrentIndex((prev) => (prev + 1) % currentGroup.length)
                  }
                  className="bg-gray-700 text-[2rem] absolute right-[-1.75rem] text-white/80 hover:text-white p-2 bg-black/40 rounded-full cursor-pointer"
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


  const adminList = ['rodikhello2000@gmail.com', 'rodykhello@gmail.com', 'sfpzk.s@gmail.com'];
  const isAdmin = adminList.includes(user?.email);

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    const confirmed = window.confirm('Möchtest du diesen Beitrag wirklich löschen?');
    if (!confirmed) return;
    await deleteDoc(doc(db, 'entries', id));
    setEntries(prev => prev.filter(e => e.id !== id));
    if (activeMenu === id) setActiveMenu(null);
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditData({
      date: entry.date,
      title: entry.title,
      content: entry.content,
      media: entry.media || []
    });
    // close menu when starting edit
    setActiveMenu(null);
    // small scroll into view (optional)
    setTimeout(() => {
      const el = document.getElementById(entry.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleEditSubmit = async (date, title, content, media) => {
    if (!isAdmin || !editingId) return;
    const newId = `${date}-${title}`;

    // collect prev history if present
    let prevHistory = [];
    try {
      const all = await getDocs(query(collection(db, 'entries'), orderBy('date', 'desc')));
      const oldDoc = all.docs.find(d => d.id === editingId);
      if (oldDoc && oldDoc.data().history) prevHistory = oldDoc.data().history;
    } catch (err) {
      // ignore history read errors
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

    if (newId !== editingId) {
      await deleteDoc(doc(db, 'entries', editingId));
    }

    setEditingId(null);
    setEditData({ date: '', title: '', content: '', media: [] });
    fetchEntries();
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // helper to register menu ref
  const registerMenuRef = (id, node) => {
    if (!node) {
      delete menusRef.current[id];
    } else {
      menusRef.current[id] = node;
    }
  };

  return (
    <div className="min-h-screen py-10 bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto">
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
                // Wrapper that contains EntryForm: ensures consistent padding/background
                <div className="bg-gray-800 rounded-lg p-4 -mx-4">
                  {/* If your EntryForm accepts className, pass it. If not it still sits inside wrapper. */}
                  <EntryForm
                    initialDate={editData.date}
                    initialTitle={editData.title}
                    initialContent={editData.content}
                    initialMedia={editData.media}
                    onSubmit={handleEditSubmit}
                    buttonText="Save"
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <>
                  {/* top row: title + menu */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-100">{entry.title}</h2>
                      <div className="text-sm text-gray-400 mt-1">{entry.date}</div>
                    </div>

                    {isAdmin && (
                      <div
                        className="relative"
                        ref={node => registerMenuRef(entry.id, node)}
                      >
                        <button
                          aria-label="open menu"
                          onClick={() => setActiveMenu(activeMenu === entry.id ? null : entry.id)}
                          className="p-1 rounded-md hover:bg-gray-700 transition cursor-pointer"
                        >
                          {/* three vertical dots */}
                          <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <circle cx="12" cy="5" r="1.5"></circle>
                            <circle cx="12" cy="12" r="1.5"></circle>
                            <circle cx="12" cy="19" r="1.5"></circle>
                          </svg>
                        </button>

                        {/* menu dropdown */}
                        {activeMenu === entry.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-30 overflow-hidden">
                            <button
                              onClick={() => startEdit(entry)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-700 transition text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-700 transition text-sm text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* body: collapsed text + media */}
                  <div className="mt-4">
                    <div className="relative">
                      {/* collapsed text container */}
                      <div
                        className={`text-gray-200 leading-relaxed whitespace-pre-wrap ${!isExpanded && textTooLong ? 'overflow-hidden' : ''}`}
                        style={!isExpanded && textTooLong ? { maxHeight: '6.2em' } : {}}
                      >
                        <p>{entry.content}</p>
                      </div>



                      {/* show more / show less */}
                      {textTooLong && (
                        <div className="mt-1 mb-4">
                          <button
                            onClick={() => toggleExpand(entry.id)}
                            className="text-blue-400 hover:underline"
                          >
                            {isExpanded ? 'Weniger zeigen' : 'Mehr zeigen...'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* media always visible even when text collapsed */}
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
