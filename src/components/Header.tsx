"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMenuItems, DEFAULT_HEADER_LINKS, type ResolvedMenuItem } from "@/lib/menu";

const DEFAULT_LINKS: ResolvedMenuItem[] = DEFAULT_HEADER_LINKS.map((link, i) => ({
  id: -(i + 1),
  label: link.label,
  href: link.route,
  external: false,
  openInNewTab: false,
}));

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-[9999] transition-all duration-500 ease-in-out",
        "bg-white",
        scrolled && "bg-white/95 backdrop-blur-md shadow-md"
      )}
    >
      <nav className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center" onClick={closeMenu}>
          <Image
            src="/vyom-regency-logo.jpg"
            alt="Vyom Regency Pvt Ltd - Your Gateway to Nature"
            width={1717}
            height={259}
            priority
            className="h-9 md:h-11 w-auto"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks onClick={closeMenu} />
          <a
            href="tel:+918955311031"
            className="bg-green-700 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Phone size={18} />
            Call Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile menu */}
        <div
          className={cn(
            "fixed inset-0 bg-white z-[-1] md:hidden transition-all duration-500 ease-in-out transform",
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          )}
          style={{ top: "0", height: "100vh" }}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-6 pt-20">
            <NavLinks mobile onClick={closeMenu} />
            <div className="w-full pt-6 border-t border-gray-100 flex flex-col gap-4">
              <a
                href="tel:+918955311031"
                className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-center shadow-lg flex items-center justify-center gap-3"
                onClick={closeMenu}
              >
                <Phone size={20} />
                Call +91 89553 11031
              </a>
              <Link
                href="/contact"
                className="w-full border-2 border-green-700 text-green-700 py-4 rounded-xl font-bold text-center"
                onClick={closeMenu}
              >
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

/* Navigation links – same component used for desktop & mobile. Falls back to a hardcoded
 * nav if no menu_items rows exist so the header never renders empty during rollout. */
function NavLinks({ mobile, onClick }: { mobile?: boolean; onClick?: () => void }) {
  const [links, setLinks] = useState<ResolvedMenuItem[]>(DEFAULT_LINKS);

  useEffect(() => {
    getMenuItems("header").then((items) => {
      if (items.length > 0) setLinks(items);
    });
  }, []);

  return (
    <>
      {links.map((link) => {
        const className = cn(
          "transition-all duration-200 font-semibold",
          mobile
            ? "text-2xl text-gray-800 hover:text-green-700 py-2"
            : "text-gray-600 hover:text-green-700 text-sm lg:text-base"
        );

        if (link.external) {
          return (
            <a
              key={link.id}
              href={link.href}
              onClick={onClick}
              target={link.openInNewTab ? "_blank" : undefined}
              rel={link.openInNewTab ? "noopener noreferrer" : undefined}
              className={className}
            >
              {link.label}
            </a>
          );
        }

        return (
          <Link key={link.id} href={link.href} onClick={onClick} className={className}>
            {link.label}
          </Link>
        );
      })}
    </>
  );
}