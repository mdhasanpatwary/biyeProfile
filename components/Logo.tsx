import React from "react";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 group transition-opacity hover:opacity-80 ${className}`}>
      <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center border border-black/10">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
        >
          <path
            d="M12 21L10.55 19.705C5.4 15.03 2 11.95 2 8.125C2 5.045 4.42 2.625 7.5 2.625C9.24 2.625 10.91 3.435 12 4.715C13.09 3.435 14.76 2.625 16.5 2.625C19.58 2.625 22 5.045 22 8.125C22 11.95 18.6 15.03 13.45 19.715L12 21Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 13C12 13 11.5 11 10.5 11C9.5 11 9 12 9 12M12 13C12 13 12.5 11 13.5 11C14.5 11 15 12 15 12"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="13.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <span className="text-xl font-black tracking-tighter text-black uppercase">
        Biye<span className="text-black/30">Profile</span>
      </span>
    </Link>
  );
}
