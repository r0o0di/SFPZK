import React, { useState, useRef, useEffect } from 'react';
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
import { Loader2Icon, Download } from "lucide-react";
import { toast } from "sonner";

// Import your custom template component
import CertificateTemplate from '@/components/CertificateTemplate';

export default function CertificateForm() {
    const [generating, setGenerating] = useState(false);
    const templateRef = useRef(null);

    // Grading configuration per student level (ast)
    const AST_CONFIG = {
        Yekem: {
            showReading: true,
            readingMax: 20,
            writingMax: 60,
            vekitMax: 20,
            vekitOrMijar: 'Vekît',
        },
        Duyem: {
            showReading: false,
            readingMax: 0,
            writingMax: 80,
            vekitMax: 20,
            vekitOrMijar: 'Mijar',
        },
        'Sêyem': {
            showReading: false,
            readingMax: 0,
            writingMax: 80,
            vekitMax: 20,
            vekitOrMijar: 'Mijar',
        },
    };

    const [vekitOrMijar, setVekitOrMijar] = useState('Vekît');
    const [showReading, setShowReading] = useState(true);

    const getTodayDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        return `${day}.${month}.${today.getFullYear()}`;
    };

    const [form, setForm] = useState({
        branchName: "",
        studentLevel: "",
        studentName: "",
        studentNumber: "",
        studentBirthdate: "",
        studentBirthplace: "",
        gradeReading: "",
        gradeReadingMax: "20", // Defaulting max values (numbers only)
        gradeWriting: "",
        gradeWritingMax: "60",
        gradeVekitMijar: "",
        gradeVekitMijarMax: "20",
        certificateLocation: "",
        certificateDate: getTodayDate(),
        teacherName: "",
    });

    const STORAGE_KEY = 'certificateTeacherPrefs';
    const PREF_FIELDS = ['branchName', 'studentLevel', 'certificateLocation', 'teacherName'];

    const formatGradeValue = (value) => {
        const normalized = String(value || '').trim();
        return /^[0-9]$/.test(normalized) ? `0${normalized}` : normalized;
    };

    const saveTeacherPreferences = (newForm) => {
        if (typeof window === 'undefined') return;
        const payload = {
            updatedAt: Date.now(),
        };
        PREF_FIELDS.forEach((key) => {
            payload[key] = newForm[key] || '';
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    };

    const loadTeacherPreferences = () => {
        if (typeof window === 'undefined') return null;
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        try {
            const parsed = JSON.parse(raw);
            if (!parsed?.updatedAt || Date.now() - parsed.updatedAt > 24 * 60 * 60 * 1000) {
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
            return parsed;
        } catch (error) {
            return null;
        }
    };

    useEffect(() => {
        const saved = loadTeacherPreferences();
        if (saved) {
            setForm((prev) => ({
                ...prev,
                branchName: saved.branchName || prev.branchName,
                studentLevel: saved.studentLevel || prev.studentLevel,
                certificateLocation: saved.certificateLocation || prev.certificateLocation,
                teacherName: saved.teacherName || prev.teacherName,
            }));
        }
    }, []);

    useEffect(() => {
        // when studentLevel initially loaded from prefs, apply config
        const cfg = AST_CONFIG[form.studentLevel];
        if (cfg) {
            setVekitOrMijar(cfg.vekitOrMijar);
            setShowReading(!!cfg.showReading);
            setForm((prev) => ({
                ...prev,
                gradeReadingMax: cfg.readingMax ? String(cfg.readingMax) : '',
                gradeWritingMax: String(cfg.writingMax),
                gradeVekitMijarMax: String(cfg.vekitMax),
                gradeReading: cfg.showReading ? prev.gradeReading : '',
            }));
        }
    }, [form.studentLevel]);

    const handleChange = e => {
        let { name, value } = e.target;
        if (["gradeReading", "gradeWriting", "gradeVekitMijar"].includes(name)) {
            const cfg = AST_CONFIG[form.studentLevel] || AST_CONFIG['Yekem'];
            const max = name === 'gradeReading' ? (cfg.readingMax || 0) : name === 'gradeWriting' ? (cfg.writingMax || 0) : (cfg.vekitMax || 0);
            // allow empty, otherwise clamp numeric values
            if (value === '') {
                // keep empty
            } else {
                const num = Number(value);
                if (Number.isNaN(num)) value = '';
                else if (max && num > max) value = String(max);
                else value = String(Math.max(0, Math.floor(num)));
            }
        }

        const updatedForm = { ...form, [name]: value };
        setForm(updatedForm);
    };

    const handleLevelChange = (val) => {
        const cfg = AST_CONFIG[val] || {};
        setVekitOrMijar(cfg.vekitOrMijar || 'Vekît');
        setShowReading(!!cfg.showReading);
        setForm((prev) => ({
            ...prev,
            studentLevel: val,
            gradeReading: cfg.showReading ? prev.gradeReading : '',
            gradeReadingMax: cfg.readingMax ? String(cfg.readingMax) : '',
            gradeWritingMax: cfg.writingMax ? String(cfg.writingMax) : prev.gradeWritingMax,
            gradeVekitMijarMax: cfg.vekitMax ? String(cfg.vekitMax) : prev.gradeVekitMijarMax,
        }));
    };

    // Automatically calculate total score
    const totalScore = (showReading ? (Number(form.gradeReading) || 0) : 0) +
        (Number(form.gradeWriting) || 0) +
        (Number(form.gradeVekitMijar) || 0);

    const isFormReady = Boolean(
        form.branchName &&
        form.studentLevel &&
        form.studentName &&
        form.studentNumber &&
        form.studentBirthdate &&
        form.studentBirthplace &&
        (showReading ? form.gradeReading : true) &&
        form.gradeWriting &&
        form.gradeVekitMijar &&
        form.certificateLocation &&
        form.certificateDate &&
        form.teacherName
    );

    const handleGeneratePDF = async (e) => {
        e.preventDefault();
        if (!isFormReady) return;

        // save teacher preferences once when the teacher clicks download
        try {
            saveTeacherPreferences(form);
        } catch (err) {
            // ignore storage errors
        }

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
            setField("#grade-reading", formatGradeValue(form.gradeReading));
            setField("#grade-reading-max", form.gradeReadingMax);
            setField("#grade-writing", formatGradeValue(form.gradeWriting));
            setField("#grade-writing-max", form.gradeWritingMax);
            setField("#grade-vekit-mijar", formatGradeValue(form.gradeVekitMijar));
            setField("#grade-vekit-mijar-max", form.gradeVekitMijarMax);
            setField("#grade-total", formatGradeValue(totalScore));
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
            const fileName = `Ast_${form.studentLevel.replace("Yekem", '1').replace("Duyem", '2').replace("Sêyem", '3')}_${form.studentName.replace(/\s+/g, '_')}.pdf`;
            pdf.save(fileName);

            toast.success("Fêrname bi serkeftî hat amadekirin!");
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
                    <h2 className="mt-[-10px] mb-[-10px] text-sm font-semibold text-slate-400 uppercase tracking-wider">Sazi</h2>

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
                            <Select value={form.studentLevel} onValueChange={(val) => handleLevelChange(val)}>
                                <SelectTrigger id="studentLevel" className="w-full cursor-pointer">
                                    <SelectValue placeholder="Asta ..." />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border border-slate-700">
                                    <SelectGroup>
                                        <SelectItem value="Yekem">Yekem</SelectItem>
                                        <SelectItem value="Duyem">Duyem</SelectItem>
                                        <SelectItem value="Sêyem">Sêyem</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <hr className="border-slate-700 my-2" />
                    <h2 className="mt-[-10px] mb-[-10px] text-sm font-semibold text-slate-400 uppercase tracking-wider">Xwendekar</h2>

                    {/* Student Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="studentName">Navê Xwendekarê</Label>
                            <Input type="text" id="studentName" name="studentName" placeholder="Sevîn Omer" value={form.studentName} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="studentNumber">Hejmara Xwendekarê</Label>
                            <Input type="number" id="studentNumber" name="studentNumber" placeholder="335" value={form.studentNumber} onChange={handleChange} required />
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
                    <h2 className="mt-[-10px] mb-[-10px] text-sm font-semibold text-slate-400 uppercase tracking-wider">Pilên Ezmûnê</h2>

                    {/* Grades Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="gradeReading">Xwendin</Label>
                            {showReading ? (
                                <Input
                                    type="number"
                                    id="gradeReading"
                                    name="gradeReading"
                                    placeholder="05"
                                    value={form.gradeReading}
                                    onChange={handleChange}
                                    max={AST_CONFIG[form.studentLevel]?.readingMax || AST_CONFIG['Yekem'].readingMax}
                                    required
                                />
                            ) : (
                                <div className="text-slate-400">-</div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="gradeWriting">Nivîsandin</Label>
                            <Input
                                type="number"
                                id="gradeWriting"
                                name="gradeWriting"
                                placeholder="15"
                                value={form.gradeWriting}
                                onChange={handleChange}
                                max={AST_CONFIG[form.studentLevel]?.writingMax || AST_CONFIG['Yekem'].writingMax}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="gradeVekitMijar">{vekitOrMijar}</Label>
                            <Input
                                type="number"
                                id="gradeVekitMijar"
                                name="gradeVekitMijar"
                                placeholder="40"
                                value={form.gradeVekitMijar}
                                onChange={handleChange}
                                max={AST_CONFIG[form.studentLevel]?.vekitMax || AST_CONFIG['Yekem'].vekitMax}
                                required
                            />
                        </div>
                    </div>

                    <hr className="border-slate-700 my-2" />
                    <h2 className="mt-[-10px] mb-[-10px] text-sm font-semibold text-slate-400 uppercase tracking-wider">Mamoste</h2>


                    {/* Mamoste */}
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="certificateDate">Dîroka Fêrnamê</Label>
                            <Input type="text" id="certificateDate" name="certificateDate" placeholder="08.06.2026" value={form.certificateDate} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="teacherName">Navê Mamostê</Label>
                            <Input type="text" id="teacherName" name="teacherName" placeholder="Baranê Cûmê" value={form.teacherName} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="certificateLocation">Cihê Mamostê</Label>
                            <Input type="text" id="certificateLocation" name="certificateLocation" placeholder="Bremen, Almanya" value={form.certificateLocation} onChange={handleChange} required />
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
                                <>
                                    <Download strokeWidth={2.5} className="h-auto size-6" />
                                    Fêrnamê wek PDF daxîne
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Visually hidden container optimized for html2canvas-pro */}
            <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
                <div ref={templateRef} style={{ visibility: "hidden" }}>
                    <CertificateTemplate data={form} vekitOrMijar={vekitOrMijar} totalScore={totalScore} showReading={showReading} />
                </div>
            </div>

        </div>
    );
}
// 