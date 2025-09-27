import React from 'react';
import Link from 'next/link';
import { Home, Leaf } from 'lucide-react'; // ← lucide icons

const FooterBar: React.FC = () => (
  <footer className="mx-auto w-full max-w-7xl px-6 pb-8">
    <div className="flex items-center justify-between rounded-2xl bg-emerald-950/70 px-5 py-4 ring-1 ring-white/10 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/20 text-white">
          <Leaf className="h-4 w-4" />
        </span>
        <span className="text-sm text-white/90">
          Pakistan Air Quality Initiative
        </span>
      </div>

      <Link
        href="/"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
        aria-label="Go to home"
      >
        <Home className="h-6 w-6" />
      </Link>
    </div>
  </footer>
);

export default FooterBar;
