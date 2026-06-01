import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";


export default function KontaktForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    age: "",
    email: "",
    phone: "",
    option: "",
    note: "",
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // === 10/day submission limit ===
    const now = Date.now();
    const limitPeriod = 24 * 60 * 60 * 1000; // 24 hours
    const stored = JSON.parse(localStorage.getItem('kontaktSubmissions') || '[]');
    const recent = stored.filter(ts => now - ts < limitPeriod);

    if (recent.length >= 10) {
      alert("Tu dikarî tenê 10 forman di nav 24 demjimêran de bişînî.");
      return;
    }

    recent.push(now);
    localStorage.setItem('kontaktSubmissions', JSON.stringify(recent));
    // === end limit ===

    setSubmitted(true);
    const fetchForm = await fetch('/api/send-kontakt-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then(async (res) => {
      if (!res.ok) throw new Error('Failed to send');
      setForm({
        name: '',
        email: '',
        phone: '',
        note: '',
      });
      return res;
    });
    setSubmitted(false);

    toast.promise(fetchForm, {
      loading: '',
      success: 'Hat şandin.',
      error: 'Failed to send. Please try again.',
    });
  };


  return (
    <div style={{ height: "100vh", alignContent: "center" }}>
      <form className='place-self-center border' onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto', padding: 20, boxShadow: "black 0px 0px 200px 2px", borderRadius: "2rem" }}>
        <h2 className='text-2xl text-yellow-200'>Kontakt</h2>

        <div className='flex mb-4 mt-2'>
          <div className="grid gap-2 mr-2">
            <Label htmlFor="name">Nav</Label>
            <Input type="text" id="name" name="name" placeholder="Sevîn Omer" value={form.name} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Jimara Telefonê</Label>
            <Input type="tel" id="phone" name="phone" placeholder="+4912345678900" value={form.phone} onChange={handleChange} required />
          </div>
        </div>

        <div className='flex mb-4 items-end'>
          <div className="grid w-full gap-2 mr-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input type="email" id="email" name="email" placeholder="abc@gmail.com" value={form.email} onChange={handleChange} required />
          </div>
        </div>

        <div className='grid gap-2'>
          <Label htmlFor={"note"}>Peyam</Label>
          <Textarea
            id={"note"}
            className="selection:bg-primary selection:text-primary-foreground"
            name={"note"}
            value={form.note}
            onChange={handleChange}
            placeholder={`Peyama xwe li vir binivîse...`}
            required
          />
        </div>

        {!submitted ? (
          <Button
            className="w-full mt-4 select-none cursor-pointer bg-green-500 hover:bg-green-600 text-secondary"
            type="submit"
          >
            Bişîne
          </Button>
        ) : (
          <Button className="w-full mt-4 select-none bg-green-500 hover:bg-green-600 text-secondary" type='submit' disabled>
            <Loader2Icon className="animate-spin" />
            Tê şandin...
          </Button>
        )}
      </form>
    </div>
  );
}