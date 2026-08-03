"use client";

import { usePathname } from "next/navigation";
import { Instagram, Facebook, Linkedin, Youtube, Twitter, Phone } from "lucide-react";

const PHONE_NUMBER = "918955311031";
const WHATSAPP_MESSAGE = "Hi, I'm interested in Vyom Regency farmhouse plots. Please share more details.";

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.298-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.298-.765.967-.938 1.165-.173.198-.347.223-.645.074-.298-.149-1.259-.464-2.399-1.48-.887-.79-1.486-1.766-1.66-2.064-.173-.298-.019-.459.13-.607.134-.134.297-.347.446-.521.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.241-.579-.487-.5-.669-.51-.173-.01-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.478 0 1.462 1.065 2.874 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413z" />
    </svg>
  );
}

export const SOCIAL_PLATFORM_LINKS = [
  { name: "Instagram", href: "https://www.instagram.com/vyomregency/", icon: Instagram, bg: "bg-gradient-to-br from-purple-600 via-pink-600 to-amber-500" },
  { name: "Facebook", href: "https://www.facebook.com/VyomRegencyPvtLtd", icon: Facebook, bg: "bg-[#1877F2]" },
  { name: "X", href: "https://x.com/VyomRegency", icon: Twitter, bg: "bg-black" },
  { name: "LinkedIn", href: "https://in.linkedin.com/company/vyomregency", icon: Linkedin, bg: "bg-[#0A66C2]" },
  { name: "YouTube", href: "https://www.youtube.com/@VyomRegency", icon: Youtube, bg: "bg-[#FF0000]" },
];

const SOCIAL_LINKS = [
  ...SOCIAL_PLATFORM_LINKS,
  {
    name: "WhatsApp",
    href: `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
    icon: WhatsAppIcon,
    bg: "bg-[#25D366]",
  },
  { name: "Call Us", href: `tel:+${PHONE_NUMBER}`, icon: Phone, bg: "bg-green-700" },
];

export default function SocialSidebar() {
  const pathname = usePathname();
  const hide = pathname?.startsWith("/admin") || pathname === "/login";
  if (hide) return null;

  return (
    <div className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 w-11 flex-col shadow-lg rounded-l-xl overflow-hidden">
      {SOCIAL_LINKS.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.href}
            target={social.href.startsWith("http") ? "_blank" : undefined}
            rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={social.name}
            className={`${social.bg} text-white w-11 h-11 flex items-center justify-center hover:scale-110 hover:brightness-110 transition-all duration-200`}
          >
            <Icon size={18} />
          </a>
        );
      })}
    </div>
  );
}
