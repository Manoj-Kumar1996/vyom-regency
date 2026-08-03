"use client";

import dynamic from "next/dynamic";

const StickyBottomBar = dynamic(() => import("@/components/StickyBottomBar"), {
  ssr: false,
});

export default function ClientComponentsWrapper() {
  return <StickyBottomBar />;
}