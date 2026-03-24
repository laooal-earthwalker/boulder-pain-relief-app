"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/pain-tool", label: "Pain Tool" },
  { href: "/resources", label: "Resources" },
  { href: "/courses", label: "Courses" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/booking", label: "Booking" },
];

const BOOKING_URL =
  "https://app.acuityscheduling.com/schedule.php?owner=38155939";

export default function Header() {
  const [open, setOpen] = useState(false);
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
          {navLinks.map((link) => (
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
            {navLinks.map((link) => (
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
