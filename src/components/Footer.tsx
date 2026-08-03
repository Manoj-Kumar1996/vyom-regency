"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SOCIAL_PLATFORM_LINKS } from "@/components/SocialSidebar";
import { getLatestProperties, type Property } from "@/lib/properties";
import { getMenuItems, DEFAULT_FOOTER_LINKS as DEFAULT_FOOTER_ROUTES, type ResolvedMenuItem } from "@/lib/menu";

const DEFAULT_FOOTER_LINKS: ResolvedMenuItem[] = DEFAULT_FOOTER_ROUTES.map((link, i) => ({
  id: -(i + 1),
  label: link.label,
  href: link.route,
  external: false,
  openInNewTab: false,
}));

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  available: { label: "Available", color: "text-green-400" },
  limited: { label: "Limited", color: "text-amber-400" },
  sold: { label: "Sold Out", color: "text-gray-500" },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [latestProjects, setLatestProjects] = useState<Property[]>([]);
  const [footerLinks, setFooterLinks] = useState<ResolvedMenuItem[]>(DEFAULT_FOOTER_LINKS);

  useEffect(() => {
    getLatestProperties(100).then(setLatestProjects);
    getMenuItems("footer").then((items) => {
      if (items.length > 0) setFooterLinks(items);
    });
  }, []);

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        
        {/* Main Grid - 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Brand */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-2">
              <span className="text-green-400">Vyom</span>
              <span className="text-amber-400"> Regency</span>
            </h3>
            <p className="text-gray-400 text-sm mb-3">Pvt Ltd | Est. 2017</p>
            <p className="text-gray-500 text-xs leading-relaxed mb-4">
              Premium agriculture land and farmhouse plots in Rajasthan.
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_PLATFORM_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`${social.bg} text-white w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 hover:brightness-110 transition`}
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-md font-semibold text-gray-300 mb-3">Quick Links</h4>
            <ul className="space-y-1.5">
              {footerLinks.map((item) => (
                <li key={item.id}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                      className="text-gray-500 hover:text-green-400 text-sm transition"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="text-gray-500 hover:text-green-400 text-sm transition">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Projects */}
          <div>
            <h4 className="text-md font-semibold text-gray-300 mb-3">Our Projects</h4>
            <ul className="space-y-1.5">
              {latestProjects.map((project) => {
                const status = STATUS_LABELS[project.status] || { label: project.status, color: "text-gray-500" };
                return (
                  <li key={project.id}>
                    <Link href={`/estates/${project.slug}`} className="text-gray-500 hover:text-green-400 text-sm transition">
                      {project.name} <span className={`${status.color} text-xs ml-1`}>{status.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-md font-semibold text-gray-300 mb-3">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="tel:+918955311031" className="text-gray-500 hover:text-green-400 text-sm transition flex items-center gap-2">
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  +91 89553 11031
                </a>
              </li>
              <li>
                <a href="https://wa.me/918955311031" target="_blank" className="text-gray-500 hover:text-green-400 text-sm transition flex items-center gap-2">
                  <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.298-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.298-.765.967-.938 1.165-.173.198-.347.223-.645.074-.298-.149-1.259-.464-2.399-1.48-.887-.79-1.486-1.766-1.66-2.064-.173-.298-.019-.459.13-.607.134-.134.297-.347.446-.521.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.241-.579-.487-.5-.669-.51-.173-.01-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.478 0 1.462 1.065 2.874 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413z"/></svg>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:info@vyomregency.com" className="text-gray-500 hover:text-green-400 text-sm transition flex items-center gap-2">
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  info@vyomregency.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6"></div>

        {/* Bottom Section - Centered */}
        <div className="text-center">
          <p className="text-gray-500 text-xs">
            © {currentYear} Vyom Regency Pvt Ltd. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center items-center gap-4">
            <Link href="/login" className="text-gray-700 hover:text-gray-500 text-[10px] underline">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}