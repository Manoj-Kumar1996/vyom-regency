import { supabase } from "@/integrations/supabase/client";

export type AdminRole = "admin" | "editor";

export async function getCurrentAdminRole(): Promise<AdminRole> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return "editor";

  const { data } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  return (data?.role as AdminRole) || "editor";
}
