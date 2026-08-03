"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  MessageSquare,
  FileText,
  Images,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  HelpCircle,
  Mail,
  Layers,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentAdminRole, type AdminRole } from "@/lib/admin";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/admin/leads", icon: Users },
  { name: "Properties", href: "/admin/properties", icon: Building2 },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Visitor Feedback", href: "/admin/visitor-feedback", icon: MessageSquare },
  { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Media", href: "/admin/media", icon: Images },
  { name: "Hero Banner", href: "/admin/hero-management", icon: FileText },
  { name: "Home Content", href: "/admin/home-content", icon: FileText },
  { name: "CMS Pages", href: "/admin/cms-pages", icon: FileText },
  { name: "Menus", href: "/admin/menus", icon: Layers },
  { name: "Redirects", href: "/admin/redirects", icon: ArrowRightLeft },
  { name: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { name: "SEO Settings", href: "/admin/seo", icon: Search },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<AdminRole>("editor");
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user && !isLoginPage) {
        router.replace("/admin/login");
        return;
      }
      setUserEmail(data.user?.email || null);
      
      if (data.user) {
        const { data: profile } = await supabase
          .from("admin_profiles")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();
        setAdminRole((profile?.role as AdminRole) || "editor");
      } else {
        setAdminRole("editor");
      }
      
      setAuthChecked(true);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !isLoginPage) {
        router.replace("/admin/login");
      }
    });
    return () => subscription.unsubscribe();
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (isLoginPage) return <>{children}</>;
  if (!authChecked) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-700 text-white p-2 rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-gray-900 text-white w-64 z-40 transform transition-transform duration-300 ease-in-out flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 border-b border-gray-800 shrink-0">
          <h2 className="text-xl font-bold">
            Vyom <span className="text-green-400">Regency</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 shrink-0 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold leading-none">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userEmail || "Admin"}</p>
              <p className="text-xs text-gray-400 capitalize">{adminRole}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white transition" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setSidebarOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition",
                  isActive ? "bg-green-700 text-white" : "text-gray-300 hover:bg-gray-800"
                )}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}