import React, { useState, useRef, useEffect } from 'react';

export default function JoinFriends() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
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

  function handleJoin(e?: React.FormEvent) {
    e?.preventDefault();
    const normalized = code.replace(/\D/g, '').slice(0, 6);
    if (normalized.length !== 6) {
      alert('Please enter a 6-digit code');
      return;
    }
    // Placeholder: call backend to join a friend's game
    console.log('Joining friend with code', normalized);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        className="text-sm bg-transparent text-gray-300 hover:text-white px-3 py-1 rounded-md border border-transparent hover:border-gray-700"
        onClick={() => setOpen((s) => !s)}
      >
        Join Friends
      </button>

      {open && (
        <div className="absolute left-0 mt-2 z-50">
          <form onSubmit={handleJoin} className="w-64 bg-[#0f0f0f] border border-gray-800 rounded-md shadow-lg p-3 text-sm">
            <label className="block text-gray-300 mb-1">Enter 6-digit code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full mb-3 px-2 py-1 bg-transparent border border-gray-700 rounded text-white focus:border-gray-500"
              placeholder="123456"
              inputMode="numeric"
              maxLength={6}
            />
            <div className="flex items-center justify-between gap-2">
              <button type="submit" className="px-3 py-1 bg-orange-500 text-white rounded text-sm">Join</button>
              <button type="button" className="text-xs text-gray-400" onClick={() => setOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
