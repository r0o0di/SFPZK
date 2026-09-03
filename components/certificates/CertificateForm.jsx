import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2Icon, Download, SquarePen, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthState } from '@/lib/useAuth';
import { generateCertificateDocId, saveToFirestore } from '@/lib/firestoreHelpers';
import { collection, getDocs, getFirestore, doc, deleteDoc, limit, orderBy, query, startAfter, writeBatch } from 'firebase/firestore';
import CertificateFields from '@/components/certificates/CertificateFields';
import CertificateArchive from '@/components/certificates/CertificateArchive';

const CERTIFICATE_CACHE_TTL = 60 * 1000;
const CERTIFICATE_PAGE_SIZE = 5;
let certificateCache = null;
let certificateRequest = null;

function sortCertificates(certData) {
    return certData.sort((a, b) => {
        const numA = parseInt(a.studentNumber, 10) || 0;
        const numB = parseInt(b.studentNumber, 10) || 0;
        return numB - numA;
    });
}

export default function CertificateForm() {
    const { user } = useAuthState();
    const [generating, setGenerating] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const [loadingArchive, setLoadingArchive] = useState(true);
    const [archiveError, setArchiveError] = useState(null);
    const [loadingMoreArchive, setLoadingMoreArchive] = useState(false);
    const [hasMoreArchive, setHasMoreArchive] = useState(true);
    const [downloadingCertId, setDownloadingCertId] = useState(null);
    const [editingCertificateId, setEditingCertificateId] = useState(null);
    const [editingCertificate, setEditingCertificate] = useState(null);
    const [archiveMenuId, setArchiveMenuId] = useState(null);
    const archiveMenuRef = useRef(null);
    const archiveListRef = useRef(null);
    const archiveCursorRef = useRef(null);

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

    const SAVED_FORM_KEY = 'certificateFormPreferences';
    const SAVED_FORM_DURATION = 48 * 60 * 60 * 1000;

    const getSavedPreferences = () => {
        if (typeof window === 'undefined') {
            return null;
        }

        try {
            const saved = localStorage.getItem(SAVED_FORM_KEY);

            if (!saved) {
                return null;
            }

            const parsed = JSON.parse(saved);

            if (!parsed.expiresAt || Date.now() >= parsed.expiresAt) {
                localStorage.removeItem(SAVED_FORM_KEY);
                return null;
            }

            return {
                branchName: parsed.branchName || '',
                studentLevel: parsed.studentLevel || '',
                teacherName: parsed.teacherName || '',
                certificateLocation: parsed.certificateLocation || '',
            };
        } catch (error) {
            console.error('Failed to load certificate preferences:', error);
            localStorage.removeItem(SAVED_FORM_KEY);
            return null;
        }
    };


    const [form, setForm] = useState(() => {
        const savedPreferences = getSavedPreferences();

        return {
            branchName: savedPreferences?.branchName || "",
            studentLevel: savedPreferences?.studentLevel || "",
            studentName: "",
            studentNumber: "",
            studentBirthdate: "",
            studentBirthplace: "",
            gradeReading: "",
            gradeReadingMax: "20",
            gradeWriting: "",
            gradeWritingMax: "60",
            gradeVekitMijar: "",
            gradeVekitMijarMax: "20",
            certificateLocation: savedPreferences?.certificateLocation || "",
            certificateDate: getTodayDate(),
            teacherName: savedPreferences?.teacherName || "",
        };
    });

    useEffect(() => {
        const preferences = {
            branchName: form.branchName,
            studentLevel: form.studentLevel,
            teacherName: form.teacherName,
            certificateLocation: form.certificateLocation,
            expiresAt: Date.now() + SAVED_FORM_DURATION,
        };

        localStorage.setItem(
            SAVED_FORM_KEY,
            JSON.stringify(preferences)
        );
    }, [
        form.branchName,
        form.studentLevel,
        form.teacherName,
        form.certificateLocation,
    ]);



    async function fetchCertificates({ force = false, loadMore = false } = {}) {
        if (!loadMore && !force && certificateCache && Date.now() - certificateCache.cachedAt < CERTIFICATE_CACHE_TTL) {
            setCertificates(certificateCache.certificates);
            archiveCursorRef.current = certificateCache.cursor;
            setHasMoreArchive(certificateCache.hasMore);
            setArchiveError(null);
            setLoadingArchive(false);
            return certificateCache.certificates;
        }

        if (certificateRequest) return certificateRequest;

        if (loadMore) setLoadingMoreArchive(true);
        else setLoadingArchive(true);
        setArchiveError(null);
        const certificatesQuery = query(
            collection(getFirestore(), 'fêrname'),
            orderBy('studentNumber', 'desc'),
            ...(loadMore && archiveCursorRef.current ? [startAfter(archiveCursorRef.current)] : []),
            limit(CERTIFICATE_PAGE_SIZE),
        );
        certificateRequest = getDocs(certificatesQuery)
            .then((snapshot) => {
                const certData = sortCertificates(snapshot.docs.map(certDoc => ({
                    id: certDoc.id,
                    ...certDoc.data()
                })));
                const hasMore = snapshot.docs.length === CERTIFICATE_PAGE_SIZE;
                archiveCursorRef.current = snapshot.docs[snapshot.docs.length - 1] || archiveCursorRef.current;
                setHasMoreArchive(hasMore);
                setCertificates((previous) => {
                    const nextCertificates = loadMore ? [...previous, ...certData] : certData;
                    if (!loadMore) {
                        certificateCache = {
                            certificates: nextCertificates,
                            cursor: archiveCursorRef.current,
                            hasMore,
                            cachedAt: Date.now(),
                        };
                    }
                    return nextCertificates;
                });
                return certData;
            })
            .catch((error) => {
                console.error('Error loading archive records:', error);
                setArchiveError('Di barkirina arşîvê de şaşîtîyek çêbû.');
                throw error;
            })
            .finally(() => {
                certificateRequest = null;
                setLoadingArchive(false);
                setLoadingMoreArchive(false);
            });

        return certificateRequest;
    }

    useEffect(() => {
        fetchCertificates().catch(() => {});
    }, []);

    useEffect(() => {
        const archiveList = archiveListRef.current;
        if (!archiveList || !hasMoreArchive || loadingArchive || loadingMoreArchive || archiveError) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) fetchCertificates({ loadMore: true }).catch(() => {});
        }, { root: archiveList, rootMargin: '120px' });

        const sentinel = archiveList.querySelector('[data-archive-load-more]');
        if (sentinel) observer.observe(sentinel);
        return () => observer.disconnect();
    }, [certificates.length, hasMoreArchive, loadingArchive, loadingMoreArchive, archiveError]);

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
        const handleArchiveMenuClick = (event) => {
            if (archiveMenuRef.current && !archiveMenuRef.current.contains(event.target)) {
                setArchiveMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleArchiveMenuClick);
        return () => document.removeEventListener('mousedown', handleArchiveMenuClick);
    }, []);


    useEffect(() => {
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
            const max = name === 'gradeReading'
                ? (cfg.readingMax || 0)
                : name === 'gradeWriting'
                    ? (cfg.writingMax || 0)
                    : (cfg.vekitMax || 0);

            if (value === '') {
                // keep empty
            } else {
                const num = Number(value);

                if (Number.isNaN(num)) {
                    value = '';
                } else if (max && num > max) {
                    value = String(max);
                } else {
                    value = String(Math.max(0, Math.floor(num)));
                }
            }
        }

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLevelChange = (val) => {
        const cfg = AST_CONFIG[val] || {};

        setVekitOrMijar(cfg.vekitOrMijar || 'Vekît');
        setShowReading(!!cfg.showReading);

        setForm(prev => ({
            ...prev,
            studentLevel: val,
            gradeReading: cfg.showReading ? prev.gradeReading : '',
            gradeReadingMax: cfg.readingMax ? String(cfg.readingMax) : '',
            gradeWritingMax: cfg.writingMax
                ? String(cfg.writingMax)
                : prev.gradeWritingMax,
            gradeVekitMijarMax: cfg.vekitMax
                ? String(cfg.vekitMax)
                : prev.gradeVekitMijarMax,
        }));
    };

    const handleDeleteCertificate = async (id) => {
        if (!window.confirm("Tu bi rastî dixwazî vê fêrnamê rakî?")) return;

        try {
            const db = getFirestore();
            await deleteDoc(doc(db, 'fêrname', id));
            certificateCache = null;
            await fetchCertificates({ force: true });
            toast.success('Fêrname bi serkeftî hat rakirin!');
        } catch (err) {
            console.error('Failed to delete record:', err);
            toast.error('Di rakirina fêrnameyê de Şaşitîyek çêbû.');
        }
    };

    const handleEditCertificate = (cert) => {
        const cfg = AST_CONFIG[cert.studentLevel] || AST_CONFIG.Yekem;

        setEditingCertificateId(cert.id);
        setEditingCertificate(cert);
        setShowReading(cfg.showReading);
        setVekitOrMijar(cfg.vekitOrMijar);
        setForm({
            branchName: cert.branchName || '',
            studentLevel: cert.studentLevel || '',
            studentName: cert.studentName || '',
            studentNumber: String(cert.studentNumber ?? ''),
            studentBirthdate: cert.studentBirthdate || '',
            studentBirthplace: cert.studentBirthplace || '',
            gradeReading: cert.gradeReading ?? '',
            gradeReadingMax: String(cfg.readingMax || ''),
            gradeWriting: cert.gradeWriting ?? '',
            gradeWritingMax: String(cfg.writingMax || ''),
            gradeVekitMijar: cert.gradeVekitORMijar ?? cert.gradeVekitMijar ?? '',
            gradeVekitMijarMax: String(cfg.vekitMax || ''),
            certificateLocation: cert.certificateLocation || '',
            certificateDate: cert.certificateDate || getTodayDate(),
            teacherName: cert.teacherName || '',
        });
        setArchiveMenuId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelCertificateEdit = () => {
        setEditingCertificateId(null);
        setEditingCertificate(null);
        setForm((prev) => ({
            ...prev,
            studentName: '',
            studentNumber: '',
            studentBirthdate: '',
            studentBirthplace: '',
            gradeReading: '',
            gradeWriting: '',
            gradeVekitMijar: '',
        }));
    };

    const triggerCertificateDownload = async ({ formData, showReadingValue, vekitLabel }) => {
        const response = await fetch('/api/generate-certificate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                form: formData,
                showReading: showReadingValue,
                vekitOrMijar: vekitLabel,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            const message = errorBody?.error || 'PDF daxistin nikaribû.';
            throw new Error(message);
        }

        const blob = await response.blob();
        const fileName = `Ast_${formData.studentLevel.replace("Yekem", '1').replace("Duyem", '2').replace("Sêyem", '3')}_${formData.studentName.replace(/\s+/g, '_')}.pdf`;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    const handleDownloadCertificate = async (cert) => {
        if (!cert) return;

        const cfg = AST_CONFIG[cert.studentLevel] || AST_CONFIG['Yekem'];
        const showReadingArchive = !!cfg.showReading && cert.gradeReading !== undefined && cert.gradeReading !== null && cert.gradeReading !== '';
        const archiveForm = {
            branchName: cert.branchName || '',
            studentLevel: cert.studentLevel || '',
            studentName: cert.studentName || '',
            studentNumber: String(cert.studentNumber ?? ''),
            studentBirthdate: cert.studentBirthdate || '',
            studentBirthplace: cert.studentBirthplace || '',
            gradeReading: cert.gradeReading ?? '',
            gradeReadingMax: String(cfg.readingMax || 20),
            gradeWriting: cert.gradeWriting ?? '',
            gradeWritingMax: String(cfg.writingMax || 60),
            gradeVekitMijar: cert.gradeVekitORMijar ?? cert.gradeVekitMijar ?? '',
            gradeVekitMijarMax: String(cfg.vekitMax || 20),
            certificateLocation: cert.certificateLocation || '',
            certificateDate: cert.certificateDate || getTodayDate(),
            teacherName: cert.teacherName || '',
        };

        setDownloadingCertId(cert.id);

        try {
            await triggerCertificateDownload({
                formData: archiveForm,
                showReadingValue: showReadingArchive,
                vekitLabel: cfg.vekitOrMijar || 'Vekît',
            });
            toast.success('Fêrname bi serkeftî hat daxistin!');
        } catch (error) {
            console.error('Archive PDF download failed:', error);
            toast.error('Di daxistina fêrnameyê de Şaşitîyek çêbû.');
        } finally {
            setDownloadingCertId(null);
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

        const isEditing = Boolean(editingCertificateId);
        const submittedForm = { ...form };

        // Save certificate data to Firestore for archival
        try {
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
                createdBy: editingCertificate?.createdBy || user?.email || ''
            };

            if (showReading) payload.gradeReading = form.gradeReading;

            if (isEditing) {
                const db = getFirestore();
                const batch = writeBatch(db);
                batch.set(doc(db, 'fêrname', docId), payload);

                if (editingCertificateId !== docId) {
                    batch.delete(doc(db, 'fêrname', editingCertificateId));
                }

                await batch.commit();
            } else {
                await saveToFirestore('fêrname', docId, payload);
            }

            certificateCache = null;
            await fetchCertificates({ force: true });

            if (isEditing) {
                cancelCertificateEdit();
                toast.success('Fêrnameyê hate sererastkirin!');
                return;
            }

            cancelCertificateEdit();

        } catch (err) {
            console.error('Failed to save certificate to DB:', err);
            toast.error('Di qeydkirina fêrnameyê de Şaşitîyek çêbû');
            return; // Exit out if firestore save fails
        }

        setGenerating(true);

        try {
            await triggerCertificateDownload({
                formData: submittedForm,
                showReadingValue: showReading,
                vekitLabel: vekitOrMijar,
            });
            toast.success('Fêrname bi serkeftî hat amadekirin!');
        } catch (error) {
            console.error('PDF generation failed:', error);
            toast.error('Şaşitîyek çêbû di dema çêkirina PDFê de.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center p-2 mt-[4rem]">
            <div className="w-full max-w-4xl bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-6 mb-6">

                <header className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-semibold text-yellow-200">
                        {editingCertificateId ? 'Sererastkirina fêrnamê' : 'Forma Fêrnamê'}
                    </h1>
                    {editingCertificateId && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="ml-auto text-slate-400 hover:text-slate-200 cursor-pointer"
                            onClick={cancelCertificateEdit}
                            title="Sererastkirin betal bike"
                        >
                            <X className="size-5" />
                        </Button>
                    )}
                </header>

                <form onSubmit={handleGeneratePDF} className="grid gap-5">
                    <CertificateFields
                        form={form}
                        showReading={showReading}
                        vekitOrMijar={vekitOrMijar}
                        astConfig={AST_CONFIG}
                        onChange={handleChange}
                        onLevelChange={handleLevelChange}
                    />

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
                                    {editingCertificateId ? (
                                        <>
                                            <SquarePen strokeWidth={2.5} className="h-auto size-6" />
                                            Sererast bike
                                        </>
                                    ) : (
                                        <>
                                            <Download strokeWidth={2.5} className="h-auto size-6" />
                                            Fêrnamê wek PDF daxîne
                                        </>
                                    )}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>



            <CertificateArchive
                certificates={certificates}
                loading={loadingArchive}
                loadingMore={loadingMoreArchive}
                error={archiveError}
                onRetry={() => fetchCertificates({ force: true }).catch(() => {})}
                hasMore={hasMoreArchive}
                listRef={archiveListRef}
                menuId={archiveMenuId}
                onMenuToggle={(id) => setArchiveMenuId((currentId) => currentId === id ? null : id)}
                onDownload={(cert) => handleDownloadCertificate(cert).finally(() => setArchiveMenuId(null))}
                onEdit={handleEditCertificate}
                onDelete={(id) => {
                    setArchiveMenuId(null);
                    handleDeleteCertificate(id);
                }}
                downloadingId={downloadingCertId}
                menuRef={archiveMenuRef}
            />
        </div>
    );
}