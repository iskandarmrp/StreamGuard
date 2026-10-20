"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-6 py-3 rounded-xl font-bold text-sm text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:text-red-300 transition-colors shadow-sm whitespace-nowrap"
    >
      Logout
    </button>
  );
}
