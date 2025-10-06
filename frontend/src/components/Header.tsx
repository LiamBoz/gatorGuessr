import React, { useState, useRef, useEffect } from 'react';
import AccountDropdown from './AccountDropdown';
import JoinFriends from './JoinFriends';
import SubmitDropdown from './SubmitDropdown';
import LeaderboardDropdown from './LeaderboardDropdown';

export default function Header() {
  return (
    <header className="w-full bg-black text-white border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 flex items-center justify-center" aria-hidden="true">
            {/* Simple alligator SVG icon (original shapes) */}
            <svg width="52.5" height="52.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="1" y="9" width="14" height="6" rx="2" fill="#2F8F2F" />
              <path d="M15 12c0-1.1 1-2 2-2h4v4h-4c-1 0-2-.9-2-2z" fill="#2F8F2F" />
              <path d="M5 9c0-1.1.9-2 2-2h1v8H6c-1.1 0-2-1-2-2V9z" fill="#2F8F2F" />
              <circle cx="8" cy="11" r="0.9" fill="#0b3b0b" />
              <path d="M6 12c1 0 1.5 1 2.5 1s1.2-1 2.5-1" stroke="#0b3b0b" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 11l1-1 1 1 1-1 1 1" stroke="#0b3b0b" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm font-semibold">
            <span className="uf-blue">gator</span>
            <span className="uf-orange">Guessr</span>
          </span>
        </div>
        <nav className="flex items-center gap-4 relative">
          <JoinFriends />
          <LeaderboardControl />
          <SubmitControl />

          <AccountButton />
        </nav>
      </div>
    </header>
  );
}

function AccountButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Account"
        onClick={() => setOpen((s) => !s)}
        className="ml-2 w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="20" height="18" rx="3" fill="#1f2937" />
          <circle cx="12" cy="10" r="2.6" fill="#9ca3af" />
          <path d="M6 18c0-2.2 3-3.5 6-3.5s6 1.3 6 3.5" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <AccountDropdown onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

function SubmitControl() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((s) => !s)} className="text-sm text-gray-300 hover:text-white">Submit</button>
      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <SubmitDropdown onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

function LeaderboardControl() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((s) => !s)} className="text-sm text-gray-300 hover:text-white">Leaderboards</button>
      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <LeaderboardDropdown />
        </div>
      )}
    </div>
  );
}
