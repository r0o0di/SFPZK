import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <div style={{ padding: 20 }}>
        <h1>All Entries</h1>
        <Link href="/new-entry">Add New</Link><br /><br />
        <Link href="/çalakî">çalakî</Link><br /><br />
        <Link href="/fêrbûn">fêrbûn</Link><br /><br />
      </div>
    </>
  );
}