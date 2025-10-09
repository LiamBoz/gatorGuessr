import React, { useState } from 'react';

export default function AccountDropdown({ onClose }: { onClose?: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Placeholder: hook up authentication later
    console.log('Login attempt', { username, password });
    if (onClose) onClose();
  }

  return (
    <div className="w-64 bg-[#0f0f0f] border border-gray-800 rounded-md shadow-lg p-3 text-sm">
      <form onSubmit={handleSubmit}>
        <label className="block text-gray-300 mb-1">Username</label>
        <input
          className="w-full mb-3 px-2 py-1 bg-transparent border border-gray-700 rounded text-white focus:border-gray-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />

        <label className="block text-gray-300 mb-1">Password</label>
        <div className="relative mb-3">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full px-2 py-1 pr-12 bg-transparent border border-gray-700 rounded text-white focus:border-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 px-1"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8 1.02-2.6 2.72-4.8 4.8-6.24" />
                <path d="M1 1l22 22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button type="submit" className="px-3 py-1 bg-orange-500 text-white rounded text-sm">Sign in</button>
          <button type="button" className="text-xs text-gray-400" onClick={() => { setUsername(''); setPassword(''); if (onClose) onClose(); }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
