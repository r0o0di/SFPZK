import { Languages } from "lucide-react";
import { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'de', name: 'Deutsch', dir: 'ltr' },
  { code: 'en', name: 'English', dir: 'ltr' },
];

export default function TranslateMenu({ onTranslate }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex gap-[8px] w-full text-left px-3 py-2 hover:bg-gray-700 transition text-sm items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Languages strokeWidth={1.5} />
        <span>Übersetzen</span>
      </button>

      {isOpen && (
        <div 
          className="absolute left-[-3%] top-[8%] transform -translate-x-full -translate-y-1 z-50"
        >
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-32 py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onTranslate(lang.code);
                  setIsOpen(false);
                }}
                className="flex w-full px-3 py-2 hover:bg-gray-700 transition text-sm text-left"
                dir={lang.dir}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}