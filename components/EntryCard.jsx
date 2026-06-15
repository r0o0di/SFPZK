"use client";
import { useEffect, useRef, useState } from 'react';
import { SquarePen, Trash2, Languages, Loader2Icon, Expand, Shrink } from 'lucide-react';
import EntryForm from '@/components/EntryForm';
import Share from '@/components/Share';
import TranslateMenu from './TranslateMenu';
import MediaGallery from './MediaGallery';
import { formatDateForDisplay } from '@/lib/utils';

export default function EntryCard({
  entry,
  isAdmin,
  isExpanded,
  isEditing,
  editData,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
  onDelete,
  onToggleExpand,
  onTranslate,
  onResetTranslation,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(event) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const textTooLong = (entry.content || '').length > 420;

  return (
    <article id={formatDateForDisplay(entry.date)} className="relative bg-gray-800 rounded-2xl shadow-none border border-gray-700 p-6 mb-8 transition-shadow hover:shadow-md">
      {isEditing ? (
        <div className="bg-gray-800 rounded-lg p-4 -mx-4">
          <EntryForm
            initialDate={editData.date}
            initialTitle={editData.title}
            initialContent={editData.content}
            initialMedia={editData.media}
            onSubmit={onSubmitEdit}
            buttonText="Sererast bike"
            onCancel={onCancelEdit}
          />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-100">{entry.title}</h2>
              <div className="text-sm text-gray-400 mt-1 mr-2 inline">{formatDateForDisplay(entry.date)}</div>
              {entry.translatedContent && (
                <button
                  onClick={() => onResetTranslation(entry.id)}
                  className="text-blue-400 hover:underline text-sm inline cursor-pointer"
                >
                  <Languages strokeWidth={1.5} className="inline" /> Nivîsa Orîjînal
                </button>
              )}
            </div>

            <div className="relative" ref={menuRef}>
              <button
                aria-label="open menu"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-1 rounded-md hover:bg-gray-700 transition-all duration-250 cursor-pointer"
              >
                <svg
                  className="w-5 h-5 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <circle cx="12" cy="5" r="1.5"></circle>
                  <circle cx="12" cy="12" r="1.5"></circle>
                  <circle cx="12" cy="19" r="1.5"></circle>
                </svg>
              </button>

              <div
                className={`absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-30 origin-top-right transition-all duration-250 ${
                  menuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                {isAdmin && (
                  <button
                    onClick={() => {
                      onStartEdit(entry);
                      setMenuOpen(false);
                    }}
                    className="flex gap-3 w-full text-left px-3 py-2 hover:bg-gray-700 transition text-sm cursor-pointer"
                  >
                    <SquarePen size={20} strokeWidth={1.5} /> Sererastkirin
                  </button>
                )}

                <TranslateMenu
                  onTranslate={async (targetLang) => {
                    if (!entry.content) return;
                    await onTranslate(entry.id, entry.content, targetLang);
                    setMenuOpen(false);
                  }}
                />

                <Share id={formatDateForDisplay(entry.date)} />

                {isAdmin && (
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="flex gap-3 w-full text-left px-3 py-2 hover:bg-gray-700 transition text-sm text-red-400 cursor-pointer"
                  >
                    <Trash2 size={20} strokeWidth={1.5} /> Rakirin
                  </button>
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
                  {entry.translating ? (
                    <>
                      <Loader2Icon className="animate-spin inline" /> Tê wergerandin...
                    </>
                  ) : entry.translatedContent ? (
                    entry.translatedContent
                  ) : (
                    entry.content
                  )}
                </p>
              </div>

              <div className="mt-1 mb-4 flex gap-2">
                {textTooLong && (
                  <button
                    onClick={() => onToggleExpand(entry.id)}
                    className="text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <Shrink size={20} /> Biçûk bike
                      </>
                    ) : (
                      <>
                        <Expand size={20} /> Berfireh bike...
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {entry.media && entry.media.length > 0 && <MediaGallery media={entry.media} />}
          </div>
        </>
      )}
    </article>
  );
}
