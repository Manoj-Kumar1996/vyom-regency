import { supabase } from "@/integrations/supabase/client";

export interface Faq {
  id?: number;
  question: string;
  answer: string;
  sort_order: number;
  category_id: number | null;
  page_route: string | null;
  is_active: boolean;
}

export interface FaqCategory {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
}

/** FAQs with page_route null/"global" show on every page (preserves pre-page-association
 * behavior); FAQs with a specific page_route only show there. */
export async function getFaqsForRoute(route: string): Promise<Faq[]> {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .or(`page_route.is.null,page_route.eq.global,page_route.eq.${route}`)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as Faq[];
}

export async function getFaqCategories(): Promise<FaqCategory[]> {
  const { data, error } = await supabase
    .from("faq_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as FaqCategory[];
}
