// used to create a form for adding or editing entries
// used in both @/app/EntriesList.jsx and @/app/form/page.jsx
import React, { useState, useEffect } from 'react';
import { DatePicker } from '@/components/DatePicker';

export default function EntryForm({
  initialDate = '',
  initialTitle = '',
  initialContent = '',
  initialMedia = [],
  onSubmit,
  buttonText = 'Save Entry',
  onCancel,
}) {
  const [date, setDate] = useState(initialDate);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [mediaLinks, setMediaLinks] = useState(initialMedia);
  const [newMedia, setNewMedia] = useState('');

  useEffect(() => {
    setDate(initialDate);
    setTitle(initialTitle);
    setContent(initialContent);
    setMediaLinks(initialMedia || []);
  }, []); // Only run once on mount

  function getMediaType(link) {
    if (/youtube\.com\/watch\?v=|youtu\.be\//.test(link)) return 'youtube';
    if (/facebook\.com/.test(link)) return 'facebook';
    if (/imgur\.com/.test(link)) return 'imgur';
    return null;
  }

  function handleAddMedia() {
    const type = getMediaType(newMedia);
    if (!type) {
      alert('Invalid media link. Only YouTube, Facebook, or Imgur links are allowed.');
      return;
    }
    setMediaLinks([...mediaLinks, newMedia]);
    setNewMedia('');
  }

  function handleRemoveMedia(idx) {
    setMediaLinks(mediaLinks.filter((_, i) => i !== idx));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(date, title, content, mediaLinks);
    if (!onCancel) {
      setDate('');
      setTitle('');
      setContent('');
      setMediaLinks([]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DatePicker
        date={date}
        onChange={setDate}
        label="Entry date" />
      <br /><br />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      /><br /><br />
      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      /><br /><br />

      <div>
        <label>Media Links:</label>
        {mediaLinks.map((link, idx) => (
          <div key={idx} style={{ marginBottom: 4 }}>
            <span>{link}</span>
            <button type="button" onClick={() => handleRemoveMedia(idx)} style={{ marginLeft: 8 }}>Remove</button>
          </div>
        ))}
        <input
          type="url"
          placeholder="Paste YouTube, Facebook, or Imgur link"
          value={newMedia}
          onChange={e => setNewMedia(e.target.value)}
          style={{ width: '80%' }}
        />
        <button type="button" onClick={handleAddMedia} style={{ marginLeft: 8 }}>Add Media</button>
      </div>
      <br />

      <button type="submit">{buttonText}</button>
      {onCancel && (
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      )}
    </form>
  );
}