export default function MediaRenderer({
  link,
  onLoad,
  onError,
  onClick,
  fit = "cover",
}) {
  if (!link) return null;

  const mediaClass =
    fit === "contain"
      ? "max-w-full max-h-full w-auto h-auto object-contain"
      : "w-full h-full object-cover";

  if (/youtube\.com\/watch\?v=|youtu\.be\//.test(link)) {
    const match = link.match(
      /(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );

    const videoId = match ? match[1] : null;

    if (!videoId) return null;

    return (
      <div
        className={
          fit === "contain"
            ? "w-full h-full flex items-center justify-center"
            : "aspect-video w-full h-full"
        }
        onClick={onClick}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={onLoad}
          className={
            fit === "contain"
              ? "max-w-full max-h-full aspect-video rounded-lg shadow-sm"
              : "w-full h-full rounded-lg shadow-sm"
          }
        />
      </div>
    );
  }

  if (/facebook\.com/.test(link)) {
    const encoded = encodeURIComponent(link);

    return (
      <div
        className={
          fit === "contain"
            ? "w-full h-full flex items-center justify-center overflow-hidden"
            : "w-full"
        }
        onClick={onClick}
      >
        <iframe
          src={`https://www.facebook.com/plugins/post.php?href=${encoded}&show_text=false&width=500`}
          width="100%"
          height="673"
          className="rounded-lg overflow-hidden max-w-full"
          scrolling="no"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media"
          onLoad={onLoad}
        />
      </div>
    );
  }

  if (/imgur\.com/.test(link)) {
    const match = link.match(
      /imgur\.com\/(?:gallery\/|a\/)?([A-Za-z0-9]+)/
    );

    if (!match) return null;

    return (
      <img
        src={`https://i.imgur.com/${match[1]}.jpg`}
        alt="Imgur"
          decoding="async"
        onLoad={onLoad}
          onError={onError}
        onClick={onClick}
        className={`${mediaClass} rounded-lg cursor-pointer`}
      />
    );
  }

  if (/firebasestorage\.googleapis\.com/.test(link)) {
    return (
      <div
        className={
          fit === "contain"
            ? "w-full h-full flex items-center justify-center rounded-lg overflow-hidden"
            : "w-full h-full flex items-center justify-center rounded-lg"
        }
        onClick={onClick}
      >
        <img
          src={link}
          alt="Photo"
          loading="lazy"
          decoding="async"
          onLoad={onLoad}
          onError={onError}
          className={`${mediaClass} rounded-lg cursor-pointer`}
        />
      </div>
    );
  }

  return null;
}
