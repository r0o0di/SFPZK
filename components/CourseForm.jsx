import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { Loader2Icon, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { generateCourseDocId, saveToFirestore } from '@/lib/firestoreHelpers';


export default function CourseForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
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
    form.age &&
    form.email &&
    form.phone &&
    form.option
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormReady) {
      return;
    }

    // === 10/day submission limit ===
    const now = Date.now();
    const limitPeriod = 24 * 60 * 60 * 1000; // 24 hours
    const stored = JSON.parse(localStorage.getItem('courseSubmissions') || '[]');
    const recent = stored.filter(ts => now - ts < limitPeriod);

    if (recent.length >= 10) {
      alert("Tu dikarî tenê 10 forman di nav 24 demjimêran de bişînî.");
      return;
    }

    recent.push(now);
    localStorage.setItem('courseSubmissions', JSON.stringify(recent));
    // === end limit ===

    setSubmitted(true);

    const id = generateCourseDocId(form.option, form.name);
    const payload = {
      name: form.name,
      age: form.age,
      email: form.email,
      phone: form.phone,
      option: form.option,
    };

    if (form.note) {
      payload.note = form.note;
    }

    try {
      // Save to Firestore for archive
      await saveToFirestore('ferbun', id, payload);
      
      // Send email via API
      await fetch('/api/send-course-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      setForm({
        name: '',
        age: '',
        email: '',
        phone: '',
        option: '',
        note: '',
      });
      toast.success('Hat şandin.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save application. Please try again.');
    } finally {
      setSubmitted(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-6 mt-[3rem]">
      <div className="w-full max-w-2xl bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-8">
        <header className=" items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-yellow-200">Fêrbûna zimanê Kurdî</h1>
          <p className="text-gray-300">Fêrî zimanê Kurdî bibe! Vê formê ji me re bişîne, û emê bi te re têkiliyê bikin.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Name and Age */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nav</Label>
              <Input type="text" id="name" name="name" placeholder="Sevîn Omer" value={form.name} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="age">Temen</Label>
              <Input type="number" id="age" name="age" placeholder="22" value={form.age} onChange={handleChange} required />
            </div>
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input type="email" id="email" name="email" placeholder="abc@gmail.com" value={form.email} onChange={handleChange} required />
          </div>

          {/* Phone and Ast */}
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div className="grid gap-2">
              <Label htmlFor="phone">Jimara Telefonê</Label>
              <Input type="tel" id="phone" name="phone" placeholder="+4912345678900" value={form.phone} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <label htmlFor='ast' className="text-sm font-medium select-none">Ast</label>
              <Select value={form.option} onValueChange={(val) => handleChange({ target: { name: "option", value: val } })}>
                <SelectTrigger id="ast" className="w-full cursor-pointer selection:bg-primary selection:text-primary-foreground">
                  <SelectValue placeholder="Asta..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border border-slate-700">
                  <SelectGroup>
                    <SelectLabel>Asta...</SelectLabel>
                    <SelectItem value="Yekem">Yekem</SelectItem>
                    <SelectItem value="Duyem">Duyem</SelectItem>
                    <SelectItem value="Sêyem">Sêyem</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Note */}
          <div className="grid gap-2">
            <Label htmlFor={"note"}>Têbîn / Peyam</Label>
            <Textarea
              id={"note"}
              className="selection:bg-primary selection:text-primary-foreground"
              name={"note"}
              value={form.note}
              onChange={handleChange}
              placeholder={`Eger Têbîn yan jî Peyamên te hene, wan li vir binivîse...`}
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