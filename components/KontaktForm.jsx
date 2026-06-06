import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { Loader2Icon, Mail } from "lucide-react";
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

  const isFormReady = Boolean(
    form.name &&
    form.phone &&
    form.email &&
    form.note
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormReady) {
      return;
    }

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-8">
        <header className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-yellow-200">Kontakt</h1>
        </header>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nav</Label>
              <Input type="text" id="name" name="name" placeholder="Sevîn Omer" value={form.name} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Jimara Telefonê</Label>
              <Input type="tel" id="phone" name="phone" placeholder="+4912345678900" value={form.phone} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input type="email" id="email" name="email" placeholder="abc@gmail.com" value={form.email} onChange={handleChange} required />
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

          <div>
            <Button
              className={`w-full mt-2 select-none transition-colors duration-200 ${isFormReady && !submitted ? 'bg-green-500 hover:bg-green-600 text-secondary cursor-pointer' : 'bg-gray-500 text-gray-200 cursor-not-allowed'}`}
              type="submit"
              disabled={!isFormReady || submitted}
            >
              {submitted ? (
                <>
                  <Loader2Icon className="animate-spin mr-2 inline-block" />
                  Tê şandin...
                </>
              ) : (
                'Bişîne'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}