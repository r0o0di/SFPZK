export default function MediaRenderer({ link, onLoad }) {
  if (!link) return null;

  if (/youtube\.com\/watch\?v=|youtu\.be\//.test(link)) {
    const match = link.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    const videoId = match ? match[1] : null;
    if (!videoId) return null;

    return (
      <div className="aspect-video w-full h-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={onLoad}
          className="w-full h-full rounded-lg shadow-sm"
        />
      </div>
    );
  }

  if (/facebook\.com/.test(link)) {
    const encoded = encodeURIComponent(link);
    return (
      <div className="w-full">
        <iframe
          src={`https://www.facebook.com/plugins/post.php?href=${encoded}&show_text=false&width=500`}
          width="100%"
          height="673"
          className="rounded-lg overflow-hidden"
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
    const match = link.match(/imgur\.com\/(?:gallery\/|a\/)?([A-Za-z0-9]+)/);
    if (!match) return null;
    return (
      <img
        src={`https://i.imgur.com/${match[1]}.jpg`}
        alt="Imgur"
        onLoad={onLoad}
        className="w-full rounded-lg h-full object-cover"
      />
    );
  }

  if (/firebasestorage\.googleapis\.com/.test(link)) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-lg">
        <img
          src={link}
          alt="Photo"
          loading="lazy"
          onLoad={onLoad}
          className="w-full object-cover rounded-lg"
        />
      </div>
    );
  }

  return null;
}
