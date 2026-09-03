import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2Icon, Download, RefreshCw, Trash2, SquarePen, MoreVertical } from 'lucide-react';

export default function CertificateArchive({
    certificates,
    loading,
    loadingMore,
    error,
    onRetry,
    hasMore,
    listRef,
    menuId,
    onMenuToggle,
    onDownload,
    onEdit,
    onDelete,
    downloadingId,
    menuRef,
}) {
    return (
        <div ref={menuRef} className="w-full max-w-3xl bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-2">
            <h2 className="text-xl font-semibold text-yellow-200 mb-4">Arşîva Fêrnameyan</h2>

            {loading ? (
                <div className="flex items-center gap-2 text-slate-400">
                    <Loader2Icon className="animate-spin size-4" />
                </div>
            ) : error ? (
                <div className="grid gap-3 text-sm text-red-300">
                    <p>{error}</p>
                    <Button type="button" onClick={onRetry} className="w-fit cursor-pointer bg-red-700 hover:bg-red-600">
                        <RefreshCw className="size-4" />
                        Dîsa biceribîne
                    </Button>
                </div>
            ) : certificates.length === 0 ? (
                <p className="text-slate-400 text-sm">Tu fêrname hîn nehatine qeydkirin.</p>
            ) : (
                <div ref={listRef} className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 pt-2 custom-scrollbar overscroll-contain">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="relative flex items-center justify-between p-4 pt-5 rounded-xl border border-slate-700 bg-slate-950/40 hover:bg-slate-950/80 transition-colors">
                            <span className="absolute -top-2.5 left-4 px-2 text-[11px] text-slate-400 bg-slate-900/70">
                                {cert.certificateDate}
                            </span>

                            <div className="grid gap-0.5">
                                <span className="font-medium text-slate-200 text-base">
                                    {cert.studentNumber} - {cert.studentName}
                                </span>
                                <span className="text-xs text-slate-400">
                                    Asta {cert.studentLevel} - {cert.teacherName}
                                </span>
                            </div>

                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
                                    onClick={() => onMenuToggle(cert.id)}
                                    aria-label="Vebijarkanên fêrnameyê vekin"
                                    title="Vebijarkan"
                                >
                                    <MoreVertical className="size-5" />
                                </Button>

                                <div className={`absolute right-0 top-full mt-1 z-20 min-w-44 rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-xl transition-all ${menuId === cert.id ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    <button type="button" className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800 cursor-pointer" onClick={() => onDownload(cert)} disabled={downloadingId === cert.id}>
                                        {downloadingId === cert.id ? <Loader2Icon className="size-5 animate-spin" /> : <Download className="size-5" />}
                                        PDF daxîne
                                    </button>
                                    <button type="button" className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800 cursor-pointer" onClick={() => onEdit(cert)}>
                                        <SquarePen className="size-5" />
                                        Sererast bike
                                    </button>
                                    <button type="button" className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-rose-400 hover:bg-slate-800 cursor-pointer" onClick={() => onDelete(cert.id)}>
                                        <Trash2 className="size-5" />
                                        Rake
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loadingMore && (
                        <div className="flex items-center justify-center gap-2 py-3 text-sm text-slate-400">
                            <Loader2Icon className="size-4 animate-spin" />
                            Zêdetir fêrname li ser rê ne...
                        </div>
                    )}
                    {hasMore && <div data-archive-load-more className="h-1" aria-hidden="true" />}
                </div>
            )}
        </div>
    );
}
