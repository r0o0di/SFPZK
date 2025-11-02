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
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";


export default function CourseForm() {
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
    if (!form.option) {
      alert("Astek hilbijêre.");
      return;
    }
    setSubmitted(true);

    const fetchForm = await fetch('/api/send-course-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then(async (res) => {
      if (!res.ok) throw new Error('Failed to send');
      setForm({
        name: '',
        surname: '',
        age: '',
        email: '',
        phone: '',
        option: '',
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
      <h2 className='text-2xl'>Fêrbûna zimanê Kurdî</h2>

      <div className='flex mb-4 mt-2'>
        <div className="grid gap-2 mr-2">
          <Label htmlFor="name">Nav</Label>
          <Input type="text" id="name" name="name" placeholder="Sevîn" value={form.name} onChange={handleChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="surname">Paşnav</Label>
          <Input type="text" id="surname" name="surname" placeholder="Omer" value={form.surname} onChange={handleChange} required />
        </div>
      </div>

      <div className='flex mb-2'>
        <div className="grid gap-2 mr-2">
          <Label htmlFor="age">Temen</Label>
          <Input type="number" id="age" name="age" placeholder="22" value={form.age} onChange={handleChange} required />
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
        <div className='grid w-full gap-2'>
          <label htmlFor='ast' className="text-sm font-medium select-none">Ast</label>
          <Select value={form.option} onValueChange={(val) => handleChange({ target: { name: "option", value: val } })}>
            <SelectTrigger id="ast" className="w-full cursor-pointer selection:bg-primary selection:text-primary-foreground">
              <SelectValue placeholder="Asta..." />
            </SelectTrigger>
            <SelectContent>
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

      <div className='grid gap-2'>
        <Label htmlFor={"note"}>Têbîn / Peyam</Label>
        <Textarea
          id={"note"}
          className="selection:bg-primary selection:text-primary-foreground"
          name={"note"}
          value={form.note}
          onChange={handleChange}
          placeholder={`Eger Têbînên yan jî Peyamên te hene, wan li vir binivîse...`}
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