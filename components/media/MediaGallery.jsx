"use client";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Maximize, Minimize } from "lucide-react";
import MediaRenderer from "@/components/media/MediaRenderer";
import SwipeableMedia from "@/components/media/SwipeableMedia";

export default function MediaGallery({ media }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const thumbnailRefs = useRef([]);

  useEffect(() => {
    function handleKey(e) {
      if (!isDialogOpen) return;

      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % media.length);
        setImageLoaded(false);
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
        setImageLoaded(false);
      }
    }

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [isDialogOpen, media.length]);

  useEffect(() => {
    function handlePopState() {
      if (isFullscreen) {
        setIsFullscreen(false);
        return;
      }

      if (isDialogOpen) {
        setIsDialogOpen(false);
      }
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDialogOpen, isFullscreen]);

  const openGallery = (idx) => {
    setCurrentIndex(idx);
    setImageLoaded(false);
    setIsDialogOpen(true);

    window.history.pushState(
      { mediaGallery: true },
      ""
    );
  };

  const closeGallery = () => {
    if (isFullscreen) {
      window.history.back();
      return;
    }

    if (isDialogOpen) {
      window.history.back();
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      window.history.back();
      return;
    }

    window.history.pushState(
      { mediaGalleryFullscreen: true },
      ""
    );

    setIsFullscreen(true);
  };
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
        if (!cancelled) {
          setImageLoaded(true);
        }
      };

      img.onerror = () => {
        if (!cancelled) {
          setImageLoaded(true);
        }
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

  if (!media || media.length === 0) {
    return null;
  }

  const showCount = media.length >= 5 ? 4 : media.length;
  const extra = Math.max(0, media.length - showCount);

  const gridClass =
    showCount === 1
      ? "grid-cols-1 grid-rows-1"
      : showCount === 2
        ? "grid-cols-2 grid-rows-1"
        : "grid-cols-2 grid-rows-2";

  const positionStyle = (idx) => {
    if (showCount === 1) {
      return {
        gridColumn: "1 / 2",
        gridRow: "1 / 2",
      };
    }

    if (showCount === 2) {
      return {
        gridColumn: `${idx + 1} / ${idx + 2}`,
        gridRow: "1 / 2",
      };
    }

    switch (idx) {
      case 0:
        return {
          gridColumn: "1 / 2",
          gridRow: "1 / 2",
        };

      case 1:
        return {
          gridColumn: "2 / 3",
          gridRow: "1 / 2",
        };

      case 2:
        return {
          gridColumn: "1 / 2",
          gridRow: "2 / 3",
        };

      case 3:
        return {
          gridColumn: "2 / 3",
          gridRow: "2 / 3",
        };

      default:
        return {};
    }
  };

  const visible = media.slice(0, showCount);

  const showPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + media.length) % media.length
    );

    setImageLoaded(false);
  };

  const showNext = () => {
    setCurrentIndex(
      (prev) => (prev + 1) % media.length
    );

    setImageLoaded(false);
  };
  return (
    <>
      {/* Gallery preview */}

      <div
        className={`grid ${gridClass} gap-1 my-2 rounded-lg overflow-hidden`}
        style={{ aspectRatio: "16 / 9" }}
      >
        {visible.map((link, idx) => (
          <div
            key={idx}
            style={positionStyle(idx)}
            className="relative w-full h-full bg-gray-700 overflow-hidden cursor-pointer hover:opacity-90 transition"
            onClick={() => openGallery(idx)}
          >
            <MediaRenderer
              link={link}
              onLoad={() => null}
              fit="cover"
            />

            {extra > 0 && idx === showCount - 1 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative text-white text-2xl font-semibold">
                  +{extra}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dialog */}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeGallery();
          }
        }}
      >
        <DialogContent
          aria-describedby={undefined}
          className={`transition-all duration-300 ease-in-out ${isFullscreen
            ? "is-full-screen fixed inset-0 translate-x-0 translate-y-0 w-screen h-[100dvh] max-w-none rounded-none border-none p-0 m-0"
            : "bg-transparent border-none max-w-[95vw] w-full"
            }`}
        >
          <DialogTitle className="sr-only">
            Media Gallery
          </DialogTitle>

          <div
            className={`transition-all duration-300 ease-in-out ${isFullscreen
              ? "relative w-screen h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-black"
              : "w-full max-h-[90dvh] flex flex-col items-center gap-4 overflow-hidden"
              }`}
          >
            {/* Main media */}

            <div
              className={`transition-all duration-300 ease-in-out relative w-full flex items-center justify-center overflow-hidden bg-gray-900 ${isFullscreen
                ? "h-full rounded-none shadow-none"
                : "max-w-[900px] aspect-[5/4] rounded-lg shadow-lg"
                }`}
            >
              {!imageLoaded && (
                <>
                  <div className="absolute inset-0 bg-gray-900 z-20" />

                  <div className="absolute inset-0 bg-gray-700/60 animate-pulse z-30" />
                </>
              )}

              <SwipeableMedia
                disabled={media.length <= 1}
                onSwipeLeft={showNext}
                onSwipeRight={showPrevious}
                onClick={toggleFullscreen}
                previous={
                  media.length > 1 ? (
                    <MediaRenderer
                      link={
                        media[
                        (currentIndex - 1 + media.length) %
                        media.length
                        ]
                      }
                      onLoad={() => null}
                      fit={isFullscreen ? "contain" : "cover"}
                    />
                  ) : null
                }
                next={
                  media.length > 1 ? (
                    <MediaRenderer
                      link={
                        media[
                        (currentIndex + 1) % media.length
                        ]
                      }
                      onLoad={() => null}
                      fit={isFullscreen ? "contain" : "cover"}
                    />
                  ) : null
                }
              >
                <MediaRenderer
                  link={media[currentIndex]}
                  onLoad={() => setImageLoaded(true)}
                  fit={isFullscreen ? "contain" : "cover"}
                />
              </SwipeableMedia>




              {/* Maximize / Minimize */}

              <button
                type="button"
                onClick={toggleFullscreen}
                className={`absolute bottom-3 z-50 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition cursor-pointer
                  ${isFullscreen ? "right-5 bottom-[100px]" : "right-3"}
                `}
                aria-label={
                  isFullscreen
                    ? "Exit fullscreen"
                    : "Enter fullscreen"
                }
              >
                {isFullscreen ? (
                  <Minimize size={22} />
                ) : (
                  <Maximize size={22} />
                )}
              </button>
            </div>





            {/* Counter */}

            <div
              className={
                isFullscreen
                  ? "absolute bottom-[100px] left-1/2 -translate-x-1/2 z-40 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full"
                  : "text-white text-sm font-medium"
              }
            >
              {currentIndex + 1} / {media.length}
            </div>


            

            {/* Thumbnails */}

            {media.length > 1 && (
              <div
                className={
                  `gallery-scroll ${isFullscreen
                    ? "absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-[465px] max-w-[calc(100vw-20px)] overflow-x-auto bg-gray-700/90 rounded"
                    : "w-[465px] max-w-full overflow-x-auto bg-gray-700 rounded"
                  }`
                }
              >
                <div className="flex gap-2 px-2 py-2">
                  {media.map((link, idx) => (
                    <button
                      type="button"
                      key={idx}
                      ref={(el) => {
                        thumbnailRefs.current[idx] = el;
                      }}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setImageLoaded(false);
                      }}
                      className={`
                        gallery-thumbnails
                        flex-shrink-0 w-15
                        h-15
                        rounded-lg
                        overflow-hidden
                        transition-all
                        duration-200
                        flex
                        bg-gray-800
                        ${idx === currentIndex
                          ? "scale-[1.2]"
                          : "opacity-70 hover:opacity-100"
                        }
                      `}
                    >
                      <MediaRenderer
                        link={link}
                        onLoad={() => null}
                        fit="cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Previous button */}

            {media.length > 1 && (
              <button
                type="button"
                onClick={showPrevious}
                className={
                  isFullscreen
                    ? "text-[2rem] absolute left-4 top-1/2 -translate-y-1/2 z-40 text-white/80 hover:text-white p-2 bg-black/40 rounded-full cursor-pointer"
                    : "text-[2rem] absolute left-[-.5rem] top-[35%] -translate-y-1/2 text-white/80 hover:text-white p-2 bg-black/40 rounded-full cursor-pointer"
                }
                aria-label="Previous image"
              >
                ‹
              </button>
            )}

            {/* Next button */}

            {media.length > 1 && (
              <button
                type="button"
                onClick={showNext}
                className={
                  isFullscreen
                    ? "text-[2rem] absolute right-4 top-1/2 -translate-y-1/2 z-40 text-white/80 hover:text-white p-2 bg-black/40 rounded-full cursor-pointer"
                    : "text-[2rem] absolute right-[-.5rem] top-[35%] -translate-y-1/2 text-white/80 hover:text-white p-2 bg-black/40 rounded-full cursor-pointer"
                }
                aria-label="Next image"
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