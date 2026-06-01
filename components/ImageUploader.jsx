"use client";
import { useRef, useState, useEffect } from "react";
import { Image } from "lucide-react";

export default function ImageUploader({ media = [], onChange }) {
  const fileInputRef = useRef(null);
  // preview is an array of item objects used only for showing previews here.
  // Items from parent `media` can be strings (external links or storage URLs)
  // or objects (newly added files). We normalize to objects for preview only.
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    setPreview(normalizeMediaToItems(media));
  }, [media]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    let totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      alert("Maximum total size is 50 MB per post.");
      return;
    }

    const valid = files.filter((f) => f.type.startsWith("image/"));
    if (valid.length < files.length) alert("Only images are allowed.");

    // create item objects for parent media array
    const newItems = valid.map((file, i) => ({
      id: `local-${Date.now()}-${i}`,
      file,
      url: URL.createObjectURL(file),
      uploaded: false, // not in storage yet
    }));

    // inform parent of added image items; parent media array may contain
    // strings (external links) and objects; append new items
    onChange && onChange([...(media || []), ...newItems]);
    // update preview immediately
    setPreview((prev) => [...prev, ...newItems]);
  };

  // we don't upload here anymore. Upload will be done by the parent on Save.

  const handleRemove = (url) => {
    // Remove visually and inform parent. Actual storage deletion happens on Save.
    // Parent `media` array may include strings (external/storage URLs) or objects.
    const updatedParent = (media || []).filter((m) => {
      if (typeof m === 'string') return m !== url;
      // object: compare storageUrl or url or id
      return !(m.storageUrl === url || m.url === url || m.id === url);
    });
    onChange && onChange(updatedParent);
    // update local preview immediately
    setPreview((prev) => prev.filter((p) => p.url !== url && p.storageUrl !== url && p.id !== url));
  };

  function normalizeMediaToItems(parentMedia) {
    const items = [];
    (parentMedia || []).forEach((m) => {
      if (!m) return;
      if (typeof m === 'string') {
        // treat string URLs that look like images as uploaded items
        if (/firebasestorage\.googleapis\.com|imgur\.com|\.(jpe?g|png|gif|webp)(?:\?|$)/i.test(m)) {
          items.push({ id: m, url: m, storageUrl: m, uploaded: true });
        }
        // else it's an external non-image link (youtube/facebook) - ignore here
      } else if (typeof m === 'object') {
        // already an item (new file or normalized object)
        items.push(m);
      }
    });
    return items;
  }

  function isPhotoItem(m) {
    if (!m) return false;
    if (typeof m === 'string') return /firebasestorage\.googleapis\.com|imgur\.com|\.(jpe?g|png|gif|webp)(?:\?|$)/i.test(m);
    if (typeof m === 'object') return !!(m.file || m.storageUrl || /\.(jpe?g|png|gif|webp)(?:\?|$)/i.test(m.url || ''));
    return false;
  }

  function renderPhotoBadge(item, previewIndex) {
    // Compute index among image items in the parent media array so numbering matches
    const parentPhotos = (media || []).map((m, i) => ({ m, i })).filter(x => isPhotoItem(x.m));
    // find matching identity: if item has id compare id, else url/storageUrl
    const matchIndex = parentPhotos.findIndex(x => {
      const m = x.m;
      if (typeof m === 'string') return m === (item.url || item.storageUrl || item.id);
      if (typeof m === 'object') return (m.id && item.id && m.id === item.id) || (m.url && item.url && m.url === item.url) || (m.storageUrl && item.storageUrl && m.storageUrl === item.storageUrl);
      return false;
    });

    const number = matchIndex >= 0 ? matchIndex + 1 : null;
    if (!number) return null;

    return (
      <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">{`Wêne ${number}`}</div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <button
          type="button"
          className="flex gap-3 w-fit text-left px-3 py-2 bg-input/30 hover:bg-gray-800 rounded-sm cursor-pointer border border-gray-700 transition-all duration-200"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image /> Wêneyan hilbijêre
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* preview section */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-2">
        {preview.map((item, idx) => (
          <div
            key={item.id || item.url}
            className="relative border border-gray-700 rounded overflow-hidden "
          >
            <img
              src={item.url}
              alt="preview"
              className="object-cover w-full h-32"
            />
            {/* photo index badge: compute index among image items in parent media */}
            {renderPhotoBadge(item, idx)}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 hover:opacity-100 transition">
              <button
                onClick={() => handleRemove(item.url || item.storageUrl || item.id)}
                className="bg-red-600 px-2 py-1 text-xs rounded cursor-pointer"
              >
                Remove
              </button>
            </div>
            {/* per-file upload progress (set by parent during Save) */}
            {typeof item.uploadProgress === 'number' && item.uploadProgress >= 0 && (
              <div className="absolute left-0 bottom-0 w-full">
                <div className="h-2 bg-gray-600 w-full">
                  <div className="h-2 bg-green-500" style={{ width: `${Math.min(100, item.uploadProgress)}%` }} />
                </div>
                <div className="absolute left-1 bottom-1 text-xs text-white/90">{item.uploadProgress}%</div>
              </div>
            )}
          </div>
        ))}

        {/* preview already includes normalized items; nothing else to render here */}
      </div>
    </div>
  );
}
