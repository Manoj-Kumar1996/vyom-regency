"use client";

import { usePathname } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function GlobalWhatsAppButton() {
  const pathname = usePathname();
  const hide = pathname?.startsWith("/admin") || pathname === "/login";

  if (hide) return null;

  return <WhatsAppButton />;
}
