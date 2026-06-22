import React, { useState, useEffect } from 'react';
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
import { Loader2Icon, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthState } from '@/lib/useAuth';
import { generateCertificateDocId, saveToFirestore } from '@/lib/firestoreHelpers';
import { collection, getFirestore, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

export default function CertificateForm() {
    const { user } = useAuthState();
    const [generating, setGenerating] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const [loadingArchive, setLoadingArchive] = useState(true);

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

    // Fetch archive data in real-time and sort numerically by studentNumber (newest/highest first)
    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onSnapshot(collection(db, 'fêrname'), (snapshot) => {
            const certData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort numerically descending (highest/newest number first)
            certData.sort((a, b) => {
                const numA = parseInt(a.studentNumber, 10) || 0;
                const numB = parseInt(b.studentNumber, 10) || 0;
                return numB - numA;
            });

            setCertificates(certData);
            setLoadingArchive(false);
        }, (error) => {
            console.error("Error loading archive records:", error);
            setLoadingArchive(false);
        });

        return () => unsubscribe();
    }, []);

    // NEW EFFECT: Automatically fetch the largest studentNumber + 1 and fill it if the field is empty
    useEffect(() => {
        if (certificates.length > 0 && !form.studentName) {
            // We use form.studentName as a proxy to know if a user started creating a new record.
            // If the field is currently empty, we auto-increment.
            const highestNumber = parseInt(certificates[0].studentNumber, 10);
            if (!isNaN(highestNumber)) {
                setForm(prev => ({
                    ...prev,
                    studentNumber: String(highestNumber + 1)
                }));
            }
        }
    }, [certificates, form.studentName]); // Added form.studentName to dependency array to react to resets cleanly


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

    const handleDeleteCertificate = async (id) => {
        if (!window.confirm("Tu bi rastî dixwazî vê fêrnamê rakî?")) return;

        try {
            const db = getFirestore();
            await deleteDoc(doc(db, 'fêrname', id));
            toast.success('Fêrname bi serkeftî hat rakirin!');
        } catch (err) {
            console.error('Failed to delete record:', err);
            toast.error('Di rakirina fêrnameyê de Şaşitîyek çêbû.');
        }
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

        // Save teacher preferences once when the teacher clicks download
        try {
            saveTeacherPreferences(form);
        } catch (err) {
            // ignore storage errors
        }

        // Store current form state snapshots to reliably use for API call after UI resets
        const submittedForm = { ...form };

        // Save certificate data to Firestore for archival
        try {
            // const docId = generateCertificateDocId(form.certificateDate, form.studentLevel, form.studentName);
            // const payload = {
            //     branchName: form.branchName,
            //     studentLevel: form.studentLevel,
            //     studentName: form.studentName,
            //     studentNumber: Number(form.studentNumber),
            //     studentBirthdate: form.studentBirthdate,
            //     studentBirthplace: form.studentBirthplace,
            //     gradeWriting: form.gradeWriting,
            //     gradeVekitORMijar: form.gradeVekitMijar,
            //     totalScore,
            //     certificateLocation: form.certificateLocation,
            //     certificateDate: form.certificateDate,
            //     teacherName: form.teacherName,
            //     createdBy: user.email
            // };

            // if (showReading) payload.gradeReading = form.gradeReading;

            // CLEAR FORM: Triggers auto-increment logic gracefully because form.studentName becomes falsey
            setForm(prev => ({
                ...prev,
                studentName: "",
                studentNumber: "",
                studentBirthdate: "",
                studentBirthplace: "",
                gradeReading: "",
                gradeWriting: "",
                gradeVekitMijar: "",
            }));

        } catch (err) {
            console.error('Failed to save certificate to DB:', err);
            toast.error('Di qeydkirina fêrnameyê de Şaşitîyek çêbû — ji kerema xwe dubare bikin.');
            return; // Exit out if firestore save fails
        }

        setGenerating(true);

        try {
            const response = await fetch('/api/generate-certificate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    form: submittedForm, // Use snapshot data since active form state is cleared
                    showReading,
                    vekitOrMijar,
                }),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => null);
                const message = errorBody?.error || 'PDF çêkirin nikaribû.';
                throw new Error(message);
            }

            const blob = await response.blob();
            const fileName = `Ast_${submittedForm.studentLevel.replace("Yekem", '1').replace("Duyem", '2').replace("Sêyem", '3')}_${submittedForm.studentName.replace(/\s+/g, '_')}.pdf`;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);



                        const docId = generateCertificateDocId(form.certificateDate, form.studentLevel, form.studentName);
            const payload = {
                branchName: form.branchName,
                studentLevel: form.studentLevel,
                studentName: form.studentName,
                studentNumber: Number(form.studentNumber),
                studentBirthdate: form.studentBirthdate,
                studentBirthplace: form.studentBirthplace,
                gradeWriting: form.gradeWriting,
                gradeVekitORMijar: form.gradeVekitMijar,
                totalScore,
                certificateLocation: form.certificateLocation,
                certificateDate: form.certificateDate,
                teacherName: form.teacherName,
                createdBy: user.email
            };

            if (showReading) payload.gradeReading = form.gradeReading;
            await saveToFirestore('fêrname', docId, payload);
            toast.success('Fêrname bi serkeftî hat amadekirin!');

        } catch (error) {
            console.error('PDF generation failed:', error);
            toast.error('Şaşitîyek çêbû di dema çêkirina PDFê de.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center p-6 mt-[3rem]">
            <div className="w-full max-w-3xl bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-8 mb-6">

                <header className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-semibold text-yellow-200">Forma Fêrnamê</h1>
                </header>

                <form onSubmit={handleGeneratePDF} className="grid gap-5">
                    <h2 className="mt-[-10px] mb-[-10px] text-sm font-semibold text-slate-400 uppercase tracking-wider">Sazî</h2>

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
                            <Label htmlFor="studentName">Navê Xwendekar</Label>
                            <Input type="text" id="studentName" name="studentName" placeholder="Sevîn Omer" value={form.studentName} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="studentNumber">Hejmara Xwendekar</Label>
                            <Input type="number" id="studentNumber" name="studentNumber" placeholder="335" value={form.studentNumber} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Birth Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="studentBirthdate">Dîroka Jidayîkbûnê</Label>
                            <Input type="text" id="studentBirthdate" name="studentBirthdate" placeholder="24.08.2006" value={form.studentBirthdate} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="studentBirthplace">Cihê Jidayîkbûnê</Label>
                            <Input type="text" id="studentBirthplace" name="studentBirthplace" placeholder="Heleb, Sûryê" value={form.studentBirthplace} onChange={handleChange} required />
                        </div>
                    </div>

                    <hr className="border-slate-700 my-2" />
                    <h2 className="mt-[-10px] mb-[-10px] text-sm font-semibold text-slate-400 uppercase tracking-wider">Pileyên Ezmûnê</h2>

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
                            <Label htmlFor="teacherName">Navê Mamoste</Label>
                            <Input type="text" id="teacherName" name="teacherName" placeholder="Baranê Cûmê" value={form.teacherName} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="certificateLocation">Cihê Mamoste</Label>
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

            {/* Archive List Below Form */}
            <div className="w-full max-w-3xl bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-semibold text-yellow-200 mb-4">Arşîva Fêrnameyan</h2>

                {loadingArchive ? (
                    <div className="flex items-center gap-2 text-slate-400">
                        <Loader2Icon className="animate-spin size-4" />
                    </div>
                ) : certificates.length === 0 ? (
                    <p className="text-slate-400 text-sm">Tu fêrname hîn nehatine qeydkirin.</p>
                ) : (
                    <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar overscroll-contain">
                        {certificates.map((cert) => (
                            <div key={cert.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-950/80 transition-colors">
                                <div className="grid gap-0.5">
                                    <span className="font-medium text-slate-200 text-base">
                                        {cert.studentNumber} - {cert.studentName}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        Asta {cert.studentLevel} - {cert.certificateDate}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-rose-400 hover:text-rose-500 hover:bg-rose-950/30 transition-colors cursor-pointer"
                                    onClick={() => handleDeleteCertificate(cert.id)}
                                >
                                    <Trash2 className="size-5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}