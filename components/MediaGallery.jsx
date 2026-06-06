"use client";
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import MediaRenderer from './MediaRenderer';

export default function MediaGallery({ media }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    function handleKey(e) {
      if (!isDialogOpen) return;
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % media.length);
      else if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isDialogOpen, media]);

  useEffect(() => {
    if (!isDialogOpen) return;
    media.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [isDialogOpen, media]);

  useEffect(() => {
    let cancelled = false;
    const url = media[currentIndex];
    if (!url) return;

    const img = new Image();
    img.src = url;

    if (img.complete) {
      setImageLoaded(true);
    } else {
      setImageLoaded(false);
      img.onload = () => {
        if (!cancelled) setImageLoaded(true);
      };
      img.onerror = () => {
        if (!cancelled) setImageLoaded(true);
      };
    }

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [currentIndex, media]);

  if (!media || media.length === 0) return null;

  const showCount = media.length >= 5 ? 4 : media.length;
  const extra = Math.max(0, media.length - showCount);

  const gridClass = showCount === 1 ? 'grid-cols-1 grid-rows-1' : showCount === 2 ? 'grid-cols-2 grid-rows-1' : 'grid-cols-2 grid-rows-2';

  const positionStyle = (idx) => {
    if (showCount === 1) return { gridColumn: '1 / 2', gridRow: '1 / 2' };
    if (showCount === 2) return { gridColumn: `${idx + 1} / ${idx + 2}`, gridRow: '1 / 2' };
    switch (idx) {
      case 0:
        return { gridColumn: '1 / 2', gridRow: '1 / 2' };
      case 1:
        return { gridColumn: '2 / 3', gridRow: '1 / 2' };
      case 2:
        return { gridColumn: '1 / 2', gridRow: '2 / 3' };
      case 3:
        return { gridColumn: '2 / 3', gridRow: '2 / 3' };
      default:
        return {};
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
            onClick={() => {
              setCurrentIndex(idx);
              setIsDialogOpen(true);
            }}
          >
            <div className="w-full h-full">
              <MediaRenderer link={link} onLoad={() => null} />
            </div>
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
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="w-full h-full overflow-hidden rounded-lg shadow-lg relative">
              {!imageLoaded && (
                <>
                  <div className="absolute inset-0 bg-gray-900 z-20" />
                  <div className="absolute inset-0 bg-gray-700/60 animate-pulse z-30" />
                </>
              )}
              {media.length > 0 && <MediaRenderer link={media[currentIndex]} onLoad={() => setImageLoaded(true)} />}
            </div>

            <div className="mt-3 text-white text-sm font-medium">
              {currentIndex + 1} / {media.length}
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
