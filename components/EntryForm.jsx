// used to create a form for adding or editing entries
// used in both @/app/EntriesList.jsx and @/app/form/page.jsx
import React, { useState, useEffect } from 'react';
import { DatePicker } from '@/components/DatePicker';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Save } from 'lucide-react';
import { Trash2 } from 'lucide-react';
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
    <form className='min-w-[400px] max-w-[700px] w-[50vw] place-self-center' onSubmit={handleSubmit} style={{ margin: '0 auto', padding: 20, boxShadow: "black 0px 0px 200px 2px", borderRadius: "2rem" }}>
      {onCancel && (
        <div className='place-self-end mb-[-32px]'>
          <Button onClick={onCancel} className=" rounded-sm select-none cursor-pointer text-white bg-transparent hover:bg-transparent w-12 h-12" type="button">
            <svg version="1.1" width="256" height="256" viewBox="0 0 256 256">
              <g style={{ stroke: "none", strokeWidth: 0, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: "none", fillRule: "nonzero", opacity: 1 }} transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                <path d="M 24.959 68.04 c -0.768 0 -1.536 -0.293 -2.121 -0.879 c -1.172 -1.171 -1.172 -3.071 0 -4.242 l 40.081 -40.081 c 1.172 -1.172 3.07 -1.172 4.242 0 c 1.172 1.171 1.172 3.071 0 4.242 L 27.081 67.161 C 26.495 67.747 25.727 68.04 24.959 68.04 z" style={{ stroke: "none", strokeWidth: 1, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: "rgb(236,0,0)", fillRule: "nonzero", opacity: 1 }} transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round" />
                <path d="M 65.04 68.04 c -0.768 0 -1.535 -0.293 -2.121 -0.879 L 22.838 27.081 c -1.172 -1.171 -1.172 -3.071 0 -4.242 c 1.171 -1.172 3.071 -1.172 4.242 0 l 40.081 40.081 c 1.172 1.171 1.172 3.071 0 4.242 C 66.575 67.747 65.808 68.04 65.04 68.04 z" style={{ stroke: "none", strokeWidth: 1, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: "rgb(236,0,0)", fillRule: "nonzero", opacity: 1 }} transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round" />
                <path d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z M 45 6 C 23.495 6 6 23.495 6 45 s 17.495 39 39 39 s 39 -17.495 39 -39 S 66.505 6 45 6 z" style={{ stroke: "none", strokeWidth: 1, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: "rgb(236,0,0)", fillRule: "nonzero", opacity: 1 }} transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round" />
              </g>
            </svg>
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