import React from 'react';

type Player = { name: string; accuracy: number };

const SAMPLE_TOP: Player[] = [
  { name: 'alexa', accuracy: 94.2 },
  { name: 'jax', accuracy: 92.1 },
  { name: 'maddy', accuracy: 90.5 },
  { name: 'omar', accuracy: 89.9 },
  { name: 'zoe', accuracy: 88.7 },
];

export default function LeaderboardDropdown() {
  // Placeholder UI - real data will be wired later
  return (
    <div className="leaderboard-drop bg-white text-slate-900 rounded-md shadow-lg p-3 w-56">
      <div className="text-sm font-semibold mb-2">Top Players</div>
      <ol className="space-y-2 text-sm">
        {SAMPLE_TOP.map((p, i) => (
          <li key={p.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">{i + 1}</div>
              <div className="truncate">{p.name}</div>
            </div>
            <div className="text-xs text-slate-600">{p.accuracy.toFixed(1)}%</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
