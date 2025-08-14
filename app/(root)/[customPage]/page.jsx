// this page uses dynamic routing 
// because otherwise it would not be able to handle 
// special characters like ç, î, ê in the URL
"use client"

import React from 'react';
import { notFound } from 'next/navigation';
import DisplayEntries from '@/components/DisplayEntries';
import SearchEntries from '@/components/SearchEntries';
import CourseForm from '@/components/CourseForm';

export default function customPage({ params }) {
  const { customPage } = React.use(params);
  const param = decodeURIComponent(customPage);

  if (param === 'çalakî') {
    return (
      <>
        <SearchEntries />
        <div style={{ padding: 20, paddingTop: 60 }}>
          <h1>All Entries</h1>
          <a href="/new-entry">Add New</a>
          <br /><br />
          <DisplayEntries />
        </div>
      </>
    );
  }

  if (param === 'fêrbûn') {
    return (
      <div style={{ height: "100vh", alignContent: "center" }}>
        <CourseForm />
      </div>
    );
  }

  notFound();
}