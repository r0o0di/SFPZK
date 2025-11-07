// used to create a form for adding or editing entries
// used in both @/app/EntriesList.jsx and @/app/form/page.jsx
import React, { useState, useEffect } from 'react';
import { DatePicker } from '@/components/DatePicker';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { Plus, Save, Trash2, X } from 'lucide-react';
import { toast } from "sonner";

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
      return;
    }
    setMediaLinks([...mediaLinks, newMedia]);
    setNewMedia('');
  }

  function handleRemoveMedia(idx) {
    setMediaLinks(mediaLinks.filter((_, i) => i !== idx));
  }


  const handleSubmit = (e) => {
    e.preventDefault();

    toast.promise(onSubmit(date, title, content, mediaLinks), {
      loading: ' ',
      success: () => {
        if (!onCancel) {
          setDate('');
          setTitle('');
          setContent('');
          setMediaLinks([]);
        }
        return 'Hat weşandin.';
      },
      error: 'Failed to send. Please try again.',
    });
  };


  return (
    <form className='min-w-fit max-w-[700px] w-[50vw] place-self-center border' onSubmit={handleSubmit} style={{ margin: '0', padding: 20, boxShadow: "white 0px 0px 200px 2px", borderRadius: "2rem" }}>
      {onCancel && (
        <div className='place-self-end mb-[-32px]'>
          <Button onClick={onCancel} className=" rounded-sm select-none cursor-pointer text-white bg-transparent hover:bg-transparent w-12 h-12" type="button">
            <X color="#ff0000" strokeWidth={2} className='size-8' />
          </Button>
        </div>
      )}
      <div className="grid gap-3 mb-4 w-min">
        <DatePicker
          date={date}
          onChange={setDate} />
      </div>

      <div className="grid gap-3 mb-4">
        <Label htmlFor="sernav">Sernav</Label>
        <Input type="text" id="sernav" name="sernav" placeholder="Konfiransa Bremen" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div className='grid gap-3 mb-4'>
        <Label htmlFor={"content"}>Nivîstok</Label>
        <Textarea
          id={"content"}
          className="selection:bg-primary selection:text-primary-foreground"
          name={"content"}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={"Nivîstokê xwe binivîse..."}
        />
      </div>

      <div className="flex w-full items-end gap-2">
        <div className="grid w-full gap-2">
          <Label htmlFor="media">Video / Wêne (Youtube / Facebook)</Label>
          <Input type="url" id="media" name="media" placeholder="https://youtu.be/CnoXR7dDo" value={newMedia} onChange={e => setNewMedia(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Button className="select-none cursor-pointer" type="button" onClick={handleAddMedia}>
            <Plus />
          </Button>
        </div>
      </div>

      {mediaLinks.map((link, idx) => (
        <div key={idx} className='mt-2'>
          <span>{getMediaType(link)}</span>
          <Button className="select-none cursor-pointer ml-2 bg-red-500 hover:bg-red-600" type="button" onClick={() => handleRemoveMedia(idx)}>
            <Trash2 />
          </Button>
        </div>
      ))}

      <div className="grid gap-2">
        <Button className="select-none cursor-pointer bg-green-500 hover:bg-green-600 mt-5" type="submit">
          <Save />
          {buttonText}
        </Button>
      </div>
    </form>
  );
}