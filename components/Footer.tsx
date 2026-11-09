"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto py-6 px-4 border-t border-forest/20 bg-white">
      <div className="max-w-md mx-auto text-center">
        <p className="text-sm text-gray-600 mb-3">
          A Gen Z NDC community project
        </p>
        <div className="flex justify-center gap-6">
          <Link href="/about" className="text-sm text-forest hover:underline">About</Link>
          <Link href="/privacy" className="text-sm text-forest hover:underline">Privacy</Link>
          <Link href="/takedown" className="text-sm text-forest hover:underline">Takedown</Link>
        </div>
      </div>
    </footer>
  );
}