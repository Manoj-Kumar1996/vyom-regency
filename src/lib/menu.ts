import { supabase } from "@/integrations/supabase/client";

export interface MenuItemRow {
  id: number;
  location: "header" | "footer";
  label: string;
  link_type: "route" | "cms_page" | "external";
  route: string | null;
  cms_page_id: string | null;
  external_url: string | null;
  open_in_new_tab: boolean;
  sort_order: number;
  is_active: boolean;
}

export interface ResolvedMenuItem {
  id: number;
  label: string;
  href: string;
  external: boolean;
  openInNewTab: boolean;
}

/** The nav rendered by Header.tsx/Footer.tsx when menu_items is empty. Also used to seed the
 * admin Menus editor so "add one more item" adds to what's actually live instead of starting
 * from a blank slate that would wipe out the fallback nav on save. */
export const DEFAULT_HEADER_LINKS: { label: string; route: string }[] = [
  { label: "Home", route: "/" },
  { label: "Estates", route: "/estates" },
  { label: "Gallery", route: "/gallery" },
  { label: "About", route: "/about" },
  { label: "Founder", route: "/founder" },
  { label: "Blog", route: "/blog" },
  { label: "Contact", route: "/contact" },
];

export const DEFAULT_FOOTER_LINKS: { label: string; route: string }[] = [
  { label: "Home", route: "/" },
  { label: "About Us", route: "/about" },
  { label: "Our Estates", route: "/estates" },
  { label: "Founder", route: "/founder" },
  { label: "Blog", route: "/blog" },
  { label: "Privacy Policy", route: "/privacy-policy" },
];

/** Resolves each active menu row (for the given location) to a final href, joining cms_pages
 * for link_type = "cms_page" rows. Returns [] if the table is empty or unreachable so callers
 * can fall back to a hardcoded nav rather than rendering an empty menu. */
export async function getMenuItems(location: "header" | "footer"): Promise<ResolvedMenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, cms_pages(slug)")
    .eq("location", location)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return [];

  return (data as (MenuItemRow & { cms_pages: { slug: string } | null })[])
    .map((row) => {
      let href = "/";
      if (row.link_type === "route" && row.route) {
        href = row.route;
      } else if (row.link_type === "cms_page" && row.cms_pages?.slug) {
        href = `/${row.cms_pages.slug}`;
      } else if (row.link_type === "external" && row.external_url) {
        href = row.external_url;
      } else {
        return null;
      }

      return {
        id: row.id,
        label: row.label,
        href,
        external: row.link_type === "external",
        openInNewTab: row.open_in_new_tab,
      };
    })
    .filter((item): item is ResolvedMenuItem => item !== null);
}
