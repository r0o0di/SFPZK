"use client";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import MediaRenderer from '@/components/media/MediaRenderer';

export default function MediaGallery({ media }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const thumbnailRefs = useRef([]);

  useEffect(() => {
    function handleKey(e) {
      if (!isDialogOpen) return;
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % media.length), setImageLoaded(false);
      else if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + media.length) % media.length), setImageLoaded(false);
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


  useEffect(() => {
    if (!isDialogOpen) return;

    thumbnailRefs.current[currentIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [currentIndex, isDialogOpen]);


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
        <DialogContent aria-describedby={undefined} className="bg-transparent border-none max-w-[95vw] w-full">
          <DialogTitle className="sr-only">Media Gallery</DialogTitle>

          <div className="w-full max-h-[90vh] flex flex-col items-center gap-4 overflow-hidden">

            {/* Main image */}
            <div className="relative w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-lg shadow-lg bg-gray-900">
              {!imageLoaded && (
                <>
                  <div className="absolute inset-0 bg-gray-900 z-20" />
                  <div className="absolute inset-0 bg-gray-700/60 animate-pulse z-30" />
                </>
              )}

              <MediaRenderer
                link={media[currentIndex]}
                onLoad={() => setImageLoaded(true)}
              />
            </div>


            {/* Counter */}
            <div className="text-white text-sm font-medium">
              {currentIndex + 1} / {media.length}
            </div>


            {/* Thumbnails */}
            {media.length > 1 && (
              <div className="gallery-scroll w-full overflow-x-auto bg-gray-700 rounded ">
                <div className="flex gap-2 px-2 py-2">
                  {media.map((link, idx) => (
                    <button
                      key={idx}
                      ref={(el) => {
                        thumbnailRefs.current[idx] = el;
                      }}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setImageLoaded(false);
                      }}
                      className={`gallery-thumbnails flex-shrink-0 w-15 h-15 rounded-lg overflow-hidden transition-all duration-200
                         ${idx === currentIndex
                          ? "scale-[1.2] "
                          : "opacity-70 hover:opacity-100"
                        }
                      `}
                    >
                      <MediaRenderer link={link} onLoad={() => null} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Previous button */}
            {media.length > 1 && (
              <button
                onClick={() =>
                  setCurrentIndex(
                    (prev) => (prev - 1 + media.length) % media.length
                  )
                }
                className="text-[2rem] absolute left-[-.5rem] top-[32%] -translate-y-1/2 text-white/80 hover:text-white p-2 bg-black/40 rounded-full cursor-pointer"
              >
                ‹
              </button>
            )}

            {/* Next button */}
            {media.length > 1 && (
              <button
                onClick={() =>
                  setCurrentIndex(
                    (prev) => (prev + 1) % media.length
                  )
                }
                className="text-[2rem] absolute right-[-.5rem] top-[32%] -translate-y-1/2 text-white/80 hover:text-white p-2 bg-black/40 rounded-full cursor-pointer"
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
