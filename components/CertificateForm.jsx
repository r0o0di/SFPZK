// if (element)
import React, { useState, useRef } from 'react';
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
import { Button } from '@/components/ui/button';
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

// Import your custom template component
import CertificateTemplate from '@/components/CertificateTemplate';

export default function CertificateForm() {
    const [generating, setGenerating] = useState(false);
    const templateRef = useRef(null);

    const [form, setForm] = useState({
        branchName: "",
        studentLevel: "",
        studentName: "",
        studentNumber: "",
        studentBirthdate: "",
        studentBirthplace: "",
        gradeReading: "",
        gradeReadingMax: "/ 20", // Defaulting max values, change as needed
        gradeWriting: "",
        gradeWritingMax: "/ 20",
        gradeVekitMijar: "",
        gradeVekitMijarMax: "/ 60",
        certificateLocation: "",
        certificateDate: "",
        teacherName: "",
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Automatically calculate total score
    const totalScore = (Number(form.gradeReading) || 0) +
        (Number(form.gradeWriting) || 0) +
        (Number(form.gradeVekitMijar) || 0);

    const isFormReady = Boolean(
        form.branchName &&
        form.studentLevel &&
        form.studentName &&
        form.studentNumber &&
        form.studentBirthdate &&
        form.studentBirthplace &&
        form.gradeReading &&
        form.gradeWriting &&
        form.gradeVekitMijar &&
        form.certificateLocation &&
        form.certificateDate &&
        form.teacherName
    );

    const handleGeneratePDF = async (e) => {
        e.preventDefault();
        if (!isFormReady) return;

        setGenerating(true);

        // 1. Safely inject form data into the hidden HTML Template elements via ID matching
        const element = templateRef.current;
        if (element) {
            const setField = (id, value) => {
                const el = element.querySelector(id);
                if (el) el.innerText = value;
            };

            setField("#branch-name", form.branchName);
            setField("#student-level", form.studentLevel);
            setField("#student-name", form.studentName);
            setField("#student-number", form.studentNumber);
            setField("#student-birthdate", form.studentBirthdate);
            setField("#student-birthplace", form.studentBirthplace);
            setField("#grade-reading", form.gradeReading);
            setField("#grade-reading-max", form.gradeReadingMax);
            setField("#grade-writing", form.gradeWriting);
            setField("#grade-writing-max", form.gradeWritingMax);
            setField("#grade-vekit-mijar", form.gradeVekitMijar);
            setField("#grade-vekit-mijar-max", form.gradeVekitMijarMax);
            setField("#grade-total", totalScore);
            setField("#certificate-location", form.certificateLocation);
            setField("#certificate-date", form.certificateDate);
            setField("#teacher-name", form.teacherName);
        }

        try {
            // 2. Dynamically import libraries to keep Next.js happy
            const html2canvasPro = (await import('html2canvas-pro')).default;
            const { jsPDF } = await import('jspdf');

            // 3. Temporarily show the template element so the canvas engine can read it properly
            element.style.visibility = "visible";

            // 4. Render the HTML element to a canvas using the Pro library (supports oklch!)
            const canvas = await html2canvasPro(element, {
                scale: 2, // Keeps text pixel-perfect and sharp
                useCORS: true, // Allows loading external logo/stamp images if needed
                logging: false,
                backgroundColor: null // Keeps background transparent if needed, or matches your CSS
            });

            // 5. Hide the template element again right after rendering is done
            element.style.visibility = "hidden";

            // 6. Convert canvas to image data
            const imgData = canvas.toDataURL('image/jpeg', 1.0);

            // 7. Create a native A4 portrait PDF file via jsPDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // A4 dimensions in portrait: 210mm x 297mm
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

            // 8. Download the finished document
            const fileName = `Sertifika_${form.studentName.replace(/\s+/g, '_')}.pdf`;
            pdf.save(fileName);

            toast.success("Sertîfîka bi serkeftî hat amadekirin!");
        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("Şaşiyek çêbû di dema çêkirina PDFê de.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-6 mt-[3rem]">
            <div className="w-full max-w-3xl bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-8">

                <header className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-semibold text-yellow-200">Forma Fêrnamê</h1>
                </header>

                <form onSubmit={handleGeneratePDF} className="grid gap-5">

                    {/* Branch and Level */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="branchName">Şax</Label>
                            <Select value={form.branchName} onValueChange={(val) => handleChange({ target: { name: "branchName", value: val } })}>
                                <SelectTrigger id="branchName" className="w-full cursor-pointer">
                                    <SelectValue placeholder="Şaxa ..." />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border border-slate-700">
                                    <SelectGroup>
                                        <SelectItem value="Ewropayê">Ewropayê</SelectItem>
                                        <SelectItem value="Başûrê Kurdistanê">Başûrê Kurdistanê</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="studentLevel">Ast</Label>
                            <Select value={form.studentLevel} onValueChange={(val) => handleChange({ target: { name: "studentLevel", value: val } })}>
                                <SelectTrigger id="studentLevel" className="w-full cursor-pointer">
                                    <SelectValue placeholder="Asta ..." />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border border-slate-700">
                                    <SelectGroup>
                                        <SelectItem value="yekem">Yekem</SelectItem>
                                        <SelectItem value="duyem">Duyem</SelectItem>
                                        <SelectItem value="sêyem">Sêyem</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Student Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="studentName">Navê Xwendekarê</Label>
                            <Input type="text" id="studentName" name="studentName" placeholder="Sevîn Omer" value={form.studentName} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="studentNumber">Hejmara Xwendekarê</Label>
                            <Input type="text" id="studentNumber" name="studentNumber" placeholder="335" value={form.studentNumber} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Birth Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="studentBirthdate">Dîroka Jidayikbûnê</Label>
                            <Input type="text" id="studentBirthdate" name="studentBirthdate" placeholder="24.08.2006" value={form.studentBirthdate} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="studentBirthplace">Cihê Jidayikbûnê</Label>
                            <Input type="text" id="studentBirthplace" name="studentBirthplace" placeholder="Heleb, Sûryê" value={form.studentBirthplace} onChange={handleChange} required />
                        </div>
                    </div>

                    <hr className="border-slate-700 my-2" />
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Pilên Ezmûnên</h2>

                    {/* Grades Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="gradeReading">Xwendin</Label>
                            <Input type="number" id="gradeReading" name="gradeReading" placeholder="05" value={form.gradeReading} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="gradeWriting">Nivîsandin</Label>
                            <Input type="number" id="gradeWriting" name="gradeWriting" placeholder="15" value={form.gradeWriting} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="gradeVekitMijar">Vekit / Mijar</Label>
                            <Input type="number" id="gradeVekitMijar" name="gradeVekitMijar" placeholder="40" value={form.gradeVekitMijar} onChange={handleChange} required />
                        </div>
                    </div>

                    <hr className="border-slate-700 my-2" />

                    {/* Meta Data */}
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="certificateLocation">Cihê Mamostê</Label>
                            <Input type="text" id="certificateLocation" name="certificateLocation" placeholder="Bremen, Almanya" value={form.certificateLocation} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="certificateDate">Dîroka Fêrnamê</Label>
                            <Input type="text" id="certificateDate" name="certificateDate" placeholder="08.06.2026" value={form.certificateDate} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="teacherName">Navê Mamostê</Label>
                            <Input type="text" id="teacherName" name="teacherName" placeholder="Baranê Cûmê" value={form.teacherName} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Submit Action */}
                    <div>
                        <Button
                            className={`w-full p-[1.5rem] mt-4 select-none transition-colors duration-200 ${isFormReady && !generating ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold cursor-pointer' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                            type="submit"
                            disabled={!isFormReady || generating}
                        >
                            {generating ? (
                                <>
                                    <Loader2Icon className="animate-spin mr-2 inline-block" />
                                    Fêrname tê amadekirin...
                                </>
                            ) : (
                                'Fêrnamê wek PDF daxîne'
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Visually hidden container optimized for html2canvas-pro */}
            <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
                <div ref={templateRef} style={{ visibility: "hidden" }}>
                    <CertificateTemplate data={form} totalScore={totalScore} />
                </div>
            </div>

        </div>
    );
}
// 