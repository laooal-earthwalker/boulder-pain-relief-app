"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
  { href: "/courses", label: "Courses" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/booking", label: "Booking" },
];

const painMapLinks = [
  { href: "/painmap",          label: "Map Your Pain" },
  { href: "/painmap/history",  label: "Session History" },
  { href: "/painmap/patterns", label: "Pattern Analysis" },
];

const BOOKING_URL =
  "https://app.acuityscheduling.com/schedule.php?owner=38155939";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [painMapOpen, setPainMapOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchRole(userId: string) {
      const { data } = await supabase
        .from("client_profiles")
        .select("role")
        .eq("id", userId)
        .single();
      setRole(data?.role ?? null);
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchRole(user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
      else setRole(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const isPractitioner = role === "practitioner";

  return (
    <header className="sticky top-0 z-50 border-b border-teal-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-teal-900 hover:text-teal-700"
        >
          <Image
            src="/logo.png"
            alt="Boulder Pain Relief Massage logo"
            width={72}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <span className="text-base font-semibold leading-tight tracking-tight">
            Boulder Pain Relief
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="/about"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-700"
          >
            About
          </Link>

          {/* PainMap dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-teal-700">
              PainMap
              <svg
                className="h-3 w-3 transition-transform duration-150 group-hover:rotate-180"
                viewBox="0 0 12 12"
                fill="currentColor"
                aria-hidden
              >
                <path d="M6 8.5 1 3.5h10z" />
              </svg>
            </button>
            {/* Dropdown panel — pt-1 creates seamless hover bridge */}
            <div className="pointer-events-none absolute left-1/2 top-full z-50 -translate-x-1/2 pt-1 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="w-44 overflow-hidden rounded-xl bg-teal-950 py-1.5 shadow-xl ring-1 ring-white/10">
                {painMapLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-teal-100 transition-colors hover:bg-teal-800 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {navLinks.filter((l) => l.href !== "/about").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href={isPractitioner ? "/practitioner" : "/dashboard"}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-700"
              >
                {isPractitioner ? "Practitioner" : "My History"}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-700"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-700"
            >
              Log in
            </Link>
          )}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Book Now
          </a>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="flex flex-col gap-[5px] rounded p-1.5 md:hidden"
        >
          <span
            className={`block h-0.5 w-5 bg-slate-700 transition-transform duration-200 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-slate-700 transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-slate-700 transition-transform duration-200 ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-teal-100 bg-white px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-teal-50 hover:text-teal-800"
            >
              About
            </Link>

            {/* PainMap expandable section */}
            <button
              onClick={() => setPainMapOpen((v) => !v)}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-teal-50 hover:text-teal-800"
            >
              PainMap
              <svg
                className={`h-3 w-3 transition-transform duration-150 ${painMapOpen ? "rotate-180" : ""}`}
                viewBox="0 0 12 12"
                fill="currentColor"
                aria-hidden
              >
                <path d="M6 8.5 1 3.5h10z" />
              </svg>
            </button>
            {painMapOpen && (
              <div className="ml-3 flex flex-col gap-0.5 rounded-lg bg-teal-950 py-1.5">
                {painMapLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setOpen(false); setPainMapOpen(false); }}
                    className="block px-4 py-2 text-sm text-teal-100 transition-colors hover:bg-teal-800 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {navLinks.filter((l) => l.href !== "/about").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-teal-50 hover:text-teal-800"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href={isPractitioner ? "/practitioner" : "/dashboard"}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-teal-700 transition hover:bg-teal-50"
                >
                  {isPractitioner ? "Practitioner Dashboard" : "My History"}
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition hover:bg-slate-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-teal-700 transition hover:bg-teal-50"
              >
                Log in
              </Link>
            )}
          </nav>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-4 flex items-center justify-center rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Book Now
          </a>
        </div>
      )}
    </header>
  );
}
