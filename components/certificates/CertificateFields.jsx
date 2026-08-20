import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function CertificateFields({ form, showReading, vekitOrMijar, astConfig, onChange, onLevelChange }) {
    return (
        <>
            <h2 className="mt-[-10px] mb-[-10px] text-sm font-semibold text-slate-400 uppercase tracking-wider">Sazî</h2>

            <div className="grid xs:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="branchName">Şax</Label>
                    <Select value={form.branchName} onValueChange={(value) => onChange({ target: { name: 'branchName', value } })}>
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
                    <Select value={form.studentLevel} onValueChange={onLevelChange}>
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

            <div className="grid xs:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="studentName">Navê Xwendekar</Label>
                    <Input type="text" id="studentName" name="studentName" placeholder="Sevîn Omer" value={form.studentName} onChange={onChange} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="studentNumber">Hejmara Xwendekar</Label>
                    <Input type="number" id="studentNumber" name="studentNumber" placeholder="335" value={form.studentNumber} onChange={onChange} required />
                </div>
            </div>

            <div className="grid xs:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="studentBirthdate">Dîroka Jidayîkbûnê</Label>
                    <Input type="text" id="studentBirthdate" name="studentBirthdate" placeholder="24.08.2006" value={form.studentBirthdate} onChange={onChange} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="studentBirthplace">Cihê Jidayîkbûnê</Label>
                    <Input type="text" id="studentBirthplace" name="studentBirthplace" placeholder="Heleb, Sûryê" value={form.studentBirthplace} onChange={onChange} required />
                </div>
            </div>

            <hr className="border-slate-700 my-2" />
            <h2 className="mt-[-10px] mb-[-10px] text-sm font-semibold text-slate-400 uppercase tracking-wider">Pileyên Ezmûnê</h2>

            <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="gradeReading">Xwendin</Label>
                    {showReading ? (
                        <Input type="number" id="gradeReading" name="gradeReading" placeholder="05" value={form.gradeReading} onChange={onChange} max={astConfig[form.studentLevel]?.readingMax || astConfig.Yekem.readingMax} required />
                    ) : <div className="text-slate-400">-</div>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="gradeWriting">Nivîsandin</Label>
                    <Input type="number" id="gradeWriting" name="gradeWriting" placeholder="15" value={form.gradeWriting} onChange={onChange} max={astConfig[form.studentLevel]?.writingMax || astConfig.Yekem.writingMax} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="gradeVekitMijar">{vekitOrMijar}</Label>
                    <Input type="number" id="gradeVekitMijar" name="gradeVekitMijar" placeholder="40" value={form.gradeVekitMijar} onChange={onChange} max={astConfig[form.studentLevel]?.vekitMax || astConfig.Yekem.vekitMax} required />
                </div>
            </div>

            <hr className="border-slate-700 my-2" />
            <h2 className="mt-[-10px] mb-[-10px] text-sm font-semibold text-slate-400 uppercase tracking-wider">Mamoste</h2>

            <div className="grid xs:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="teacherName">Navê Mamoste</Label>
                    <Input type="text" id="teacherName" name="teacherName" placeholder="Baranê Cûmê" value={form.teacherName} onChange={onChange} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="certificateLocation">Cihê Mamoste</Label>
                    <Input type="text" id="certificateLocation" name="certificateLocation" placeholder="Bremen, Almanya" value={form.certificateLocation} onChange={onChange} required />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="certificateDate">Dîroka Fêrnamê</Label>
                <Input type="text" id="certificateDate" name="certificateDate" placeholder="08.06.2026" value={form.certificateDate} onChange={onChange} required />
            </div>
        </>
    );
}
