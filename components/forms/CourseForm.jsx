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
import { sanitizeCourseForm, validateCourseFields } from '@/lib/inputSanitization';


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
    setForm(prev => sanitizeCourseForm({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormReady = validateCourseFields(form);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormReady) {
      toast.error('Ji kerema xwe hemû agahiyên pêwîst rast dagire.');
      return;
    }

    const submittedForm = sanitizeCourseForm(form);

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

    const id = generateCourseDocId(submittedForm.option, submittedForm.name);
    const payload = {
      name: submittedForm.name,
      age: submittedForm.age,
      email: submittedForm.email,
      phone: submittedForm.phone,
      option: submittedForm.option,
    };

    if (submittedForm.note) {
      payload.note = submittedForm.note;
    }

    try {
      // Save to Firestore for archive
      await saveToFirestore('ferbun', id, payload);
      
      // Send email via API
      const response = await fetch('/api/send-course-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submittedForm),
      });
      if (!response.ok) throw new Error('Failed to send application');

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-2 mt-[3rem]">
      <div className="w-full max-w-4xl bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-6">
        <header className=" items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-yellow-200">Fêrbûna zimanê Kurdî</h1>
          <p className="text-gray-300">Fêrî zimanê Kurdî bibe! Vê formê ji me re bişîne, û emê bi te re têkiliyê bikin.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Name and Age */}
          <div className="grid xs:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nav</Label>
              <Input type="text" id="name" name="name" maxLength={100} placeholder="Sevîn Omer" value={form.name} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="age">Temen</Label>
              <Input type="number" id="age" name="age" min="1" max="120" inputMode="numeric" placeholder="22" value={form.age} onChange={handleChange} required />
            </div>
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">E-Mail</Label>
              <Input type="email" id="email" name="email" maxLength={254} placeholder="abc@gmail.com" value={form.email} onChange={handleChange} required />
          </div>

          {/* Phone and Ast */}
          <div className="grid xs:grid-cols-2 gap-4 items-end">
            <div className="grid gap-2">
              <Label htmlFor="phone">Jimara Telefonê</Label>
              <Input type="tel" id="phone" name="phone" maxLength={30} placeholder="+4912345678900" value={form.phone} onChange={handleChange} required />
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
              className="selection:bg-primary selection:text-primary-foreground max-h-[250px]"
              name={"note"}
              value={form.note}
              onChange={handleChange}
              maxLength={1000}
              placeholder={`Eger Têbîn yan jî Peyamên te hene, wan li vir binivîse...`}
            />
          </div>

          <div>
            <p className="mb-2 text-right text-xs text-slate-400">{form.note.length}/1000</p>
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