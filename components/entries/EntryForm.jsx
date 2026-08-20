// used to create a form for adding or editing entries
// used in both @/app/DisplayEntries.jsx and @/app/new-entry/page.jsx
import React, { useState, useEffect } from 'react';
import { DatePicker } from '@/components/entries/DatePicker';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import ImageUploader from "@/components/media/ImageUploader";
import { Check, Save, Trash2, X } from 'lucide-react';
import { toast } from "sonner";
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { normalizeDateForStorage } from '@/lib/utils';


export default function EntryForm({
  initialDate = '',
  initialTitle = '',
  initialContent = '',
  initialMedia = [],
  onSubmit,
  buttonText = 'Save Entry',
  onCancel,
}) {
  const [date, setDate] = useState(normalizeDateForStorage(initialDate));
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [mediaLinks, setMediaLinks] = useState(initialMedia);
  const [newMedia, setNewMedia] = useState('');

  useEffect(() => {
    setDate(normalizeDateForStorage(initialDate));
    setTitle(initialTitle);
    setContent(initialContent);
    setMediaLinks(initialMedia || []);
  }, []); // Only run once on mount

  function getMediaType(link) {
    if (!link) return null;
    if (typeof link === 'string') {
      if (/youtube\.com\/watch\?v=|youtu\.be\//.test(link)) return 'youtube';
      if (/facebook\.com/.test(link)) return 'facebook';
      if (/imgur\.com/.test(link)) return 'imgur';
      if (/firebasestorage\.googleapis\.com|\.(jpe?g|png|gif|webp)(?:\?|$)/i.test(link)) return 'photo';
      return null;
    }
    // object items (from uploader)
    if (typeof link === 'object') {
      if (link.file || link.storageUrl || (link.url && /\.(jpe?g|png|gif|webp)(?:\?|$)/i.test(link.url))) return 'photo';
    }
    return null;
  }

  function getMediaLabel(item, idx, allMedia) {
    const type = getMediaType(item);
    if (type !== 'photo') return type;

    // compute the position of this photo among photos in the media array
    const photoIndices = (allMedia || []).map((m, i) => ({ m, i })).filter(x => getMediaType(x.m) === 'photo');
    // find matching index by matching string equality or object id/url
    const found = photoIndices.findIndex(x => {
      const m = x.m;
      if (typeof m === 'string' && typeof item === 'string') return m === item;
      if (typeof m === 'string' && typeof item === 'object') return (item.url && item.url === m) || (item.storageUrl && item.storageUrl === m);
      if (typeof m === 'object' && typeof item === 'string') return (m.url && m.url === item) || (m.storageUrl && m.storageUrl === item);
      if (typeof m === 'object' && typeof item === 'object') return (m.id && item.id && m.id === item.id) || (m.url && item.url && m.url === item.url) || (m.storageUrl && item.storageUrl && m.storageUrl === item.storageUrl);
      return false;
    });

    // return found >= 0 ? `Photo ${found + 1}` : 'Photo';
  }

  function downloadUrlToStoragePath(url) {
    try {
      const u = new URL(url);
      const match = u.pathname.match(/\/o\/(.+)/);
      if (!match) return null;
      const encoded = match[1];
      return decodeURIComponent(encoded);
    } catch (err) {
      return null;
    }
  }

  function handleAddMedia() {
    const type = getMediaType(newMedia);
    if (!type) {
      return;
    }
    setMediaLinks([...mediaLinks, newMedia]);
    setNewMedia('');
  }

  function handleRemoveMedia(idx) {
    // remove visually; actual deletion from storage will be performed on Save
    setMediaLinks(mediaLinks.filter((_, i) => i !== idx));
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date) {
      toast.error('Dîrok pêwîst e.');
      return;
    }

    // We will: upload any new image files, compute final media URLs array,
    // delete any removed old storage URLs, then call onSubmit(finalUrls).

    const savePromise = (async () => {
      // 1) Determine initial stored image URLs from initialMedia (strings only)
      const initialStored = (initialMedia || []).filter(m => typeof m === 'string' && /firebasestorage\.googleapis\.com|imgur\.com|\.(jpe?g|png|gif|webp)(?:\?|$)/i.test(m));

      // 2) Build finalUrls by iterating current mediaLinks state. mediaLinks can contain:
      // - strings (external links or stored image URLs)
      // - objects for image items: { file, url, storageUrl?, uploaded? }
      const finalUrls = [];

      // helper to match items when updating progress
      const itemMatches = (a, b) => {
        if (!a || !b) return false;
        if (a.id && b.id) return a.id === b.id;
        if (a.url && b.url) return a.url === b.url;
        if (a.storageUrl && b.storageUrl) return a.storageUrl === b.storageUrl;
        if (a.file && b.file) return a.file.name === b.file.name && a.file.size === b.file.size;
        return false;
      };

      for (let idx = 0; idx < mediaLinks.length; idx++) {
        const item = mediaLinks[idx];
        if (!item) continue;
        if (typeof item === 'string') {
          finalUrls.push(item);
          continue;
        }

        // object
        if (item.file) {
          // mark uploading state in UI
          setMediaLinks(prev => prev.map(m => itemMatches(m, item) ? { ...m, uploading: true, uploadProgress: 0 } : m));

          const file = item.file;
          const path = `images/${date}/${file.name}`;
          const storageRef = ref(storage, path);
          const uploadTask = uploadBytesResumable(storageRef, file);

          // wait for upload with progress updates
          const downloadUrl = await new Promise((resolve, reject) => {
            uploadTask.on('state_changed', (snap) => {
              const progress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
              setMediaLinks(prev => prev.map(m => itemMatches(m, item) ? { ...m, uploadProgress: progress } : m));
            }, (err) => {
              // set uploading false on error
              setMediaLinks(prev => prev.map(m => itemMatches(m, item) ? { ...m, uploading: false } : m));
              reject(err);
            }, async () => {
              try {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                // mark uploaded
                setMediaLinks(prev => prev.map(m => itemMatches(m, item) ? { ...m, uploading: false, uploaded: true, storageUrl: url, uploadProgress: 100 } : m));
                resolve(url);
              } catch (err) {
                setMediaLinks(prev => prev.map(m => itemMatches(m, item) ? { ...m, uploading: false } : m));
                reject(err);
              }
            });
          });

          finalUrls.push(downloadUrl);
        } else if (item.storageUrl) {
          finalUrls.push(item.storageUrl);
        } else if (item.url && item.uploaded) {
          finalUrls.push(item.url);
        }
      }

      // 3) Delete any initialStored URLs that are no longer in finalUrls
      const toDelete = initialStored.filter(u => !finalUrls.includes(u));
      for (const url of toDelete) {
        try {
          const path = downloadUrlToStoragePath(url);
          if (path) {
            await deleteObject(ref(storage, path));
          } else {
            // fallback: attempt delete by creating a ref with the full URL (may fail silently)
            try {
              await deleteObject(ref(storage, url));
            } catch (innerErr) {
              console.warn('Failed to delete storage object (fallback)', url, innerErr?.message || innerErr);
            }
          }
        } catch (err) {
          // continue silently; a missing file shouldn't block saving
          console.warn('Failed to delete storage object', url, err?.message || err);
        }
      }

      // 4) Call parent's onSubmit with finalUrls (parent will write to Firestore)
      return onSubmit(normalizeDateForStorage(date), title, content, finalUrls);
    })();

    toast.promise(savePromise, {
      loading: ' ',
      success: async () => {
        if (!onCancel) {
          setDate('');
          setTitle('');
          setContent('');
          setMediaLinks([]);
        }
        // Wait for the parent onSubmit to resolve (it already did in savePromise)
        await savePromise;
        return 'Hat weşandin.';
      },
      error: 'Failed to send. Please try again.',
    });
  };


  return (
    <form className='w-full max-w-4xl border border-slate-700 bg-slate-950/90 shadow-[0_0_120px_rgba(255,255,255,0.05)] rounded-[2rem] p-4 grid gap-4' onSubmit={handleSubmit}>
      {onCancel && (
        <div className='text-right mb-[-32px]'>
          <Button onClick={onCancel} className=" rounded-sm select-none cursor-pointer text-white bg-transparent hover:bg-transparent w-12 h-12" type="button">
            <X color="#ff0000" strokeWidth={3} className='size-8' />
          </Button>
        </div>
      )}
      {/* {onCancel && (
        <div className="text-sm text-gray-300 mb-4">
          Ji bo girtina forma sererastkirinê, bişkoja browserê ya paşve an jî bişkoja X bikirtînin.
        </div>
      )} */}
      <div className="grid gap-3 mb-4 w-min">
        <DatePicker
          date={date}
          onChange={setDate}
          required />
      </div>

      <div className="grid gap-3 mb-4">
        <Label htmlFor="sernav">Sernav</Label>
        <Input type="text" id="sernav" name="sernav" placeholder="Konfiransa Bremen" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div className='grid gap-3 mb-4'>
        <Label htmlFor={"content"}>Nivîs</Label>
        <Textarea
          id={"content"}
          className="selection:bg-primary selection:text-primary-foreground"
          name={"content"}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={"Nivîstokê xwe binivîse..."}
        />
      </div>

      <ImageUploader
        media={mediaLinks}
        onChange={(updatedMedia) => setMediaLinks(updatedMedia)}
      />

      {/* <div className="flex w-full items-end gap-2">
        <div className="grid w-full gap-2">
          <Label htmlFor="media">Video / Post (Youtube / Facebook)</Label>
          <Input type="url" id="media" name="media" placeholder="https://youtu.be/CnoXR7dDo" value={newMedia} onChange={e => setNewMedia(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Button className="select-none cursor-pointer w-16" type="button" onClick={handleAddMedia}>
            <Check strokeWidth={3} size={28} className="size-"/>
          </Button>
        </div>
      </div> */}

      {mediaLinks.map((link, idx) => {
        const type = getMediaType(link);
        const label = getMediaLabel(link, idx, mediaLinks);
        {/* only show delete button if NOT a photo */}
        // if (type !== "photo" ) return (
        //   <div key={idx} className="mt-2 flex items-center gap-2">
        //     <span>{label}</span>
        //     <Button
        //       className="select-none cursor-pointer bg-red-500 hover:bg-red-600"
        //       type="button"
        //       onClick={() => handleRemoveMedia(idx)}
        //     >
        //       <Trash2 />
        //     </Button>
        //   </div>
        // )
      })}


      <div className="grid gap-2">
        <Button className="select-none cursor-pointer bg-green-500 hover:bg-green-600 mt-5 h-11" type="submit">
          <Save />
          {buttonText}
        </Button>
      </div>
    </form>
  );
}