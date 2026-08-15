// this page uses dynamic routing 
// because otherwise it would not be able to handle 
// special characters like ç, î, ê in the URL
"use client"

import React from 'react';
import { notFound } from 'next/navigation';
import DisplayEntries from '@/components/DisplayEntries';
import CourseForm from '@/components/CourseForm';
import CertificateForm from '@/components/CertificateForm';
import KontaktForm from '@/components/KontaktForm';
import { useAdminState } from '@/lib/useAuth';
import { Loader2Icon } from 'lucide-react';

export default function customPage({ params }) {
  const { customPage } = React.use(params);
  const param = decodeURIComponent(customPage);
  const { user, authLoading, isAdmin } = useAdminState();

  if (param === 'çalakî') {
    return (
      <>
        {/* <SearchEntries /> */}
        <div className="py-8 px-2">

          <DisplayEntries />
        </div>
      </>
    );
  }

  if (param === 'fêrbûn') {
    return <CourseForm />;
  }



  if (param === 'têklî') {
    return <KontaktForm />;
  }


  if (param === 'fêrname') {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-8">
          <div className=" p-8 text-center">
            <Loader2Icon className="animate-spin inline size-10" />
          </div>
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-8">
          <div className="max-w-md rounded-3xl border border-red-600/40 bg-slate-900/90 p-8 text-center">
            <h1 className="text-2xl font-semibold text-red-300 mb-4">Tu ne adminî</h1>
            <p className="text-slate-300">Tenê admin dikarin vê rûpelê bibînin.</p>
          </div>
        </div>
      );
    }

    return <CertificateForm />;
  }

  notFound();
}