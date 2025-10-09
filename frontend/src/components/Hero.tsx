import React from 'react';
import Button from './Button';

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <h2 className="text-5xl font-extrabold leading-tight mb-6">Discover Florida, one photo at a time</h2>
          <p className="text-slate-600 text-lg mb-8">Guess where the photo was taken and earn points. Compete with friends and explore the state.</p>
          <div className="flex items-center gap-4">
            <Button className="shadow">Play now</Button>
            <Button variant="ghost">How it works</Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="w-full h-64 bg-slate-200 rounded-md flex items-center justify-center text-slate-500">Photo preview</div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Location</div>
                  <div className="font-semibold">Gainesville, FL</div>
                </div>
                <div className="text-sm text-slate-400">1.2 mi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
