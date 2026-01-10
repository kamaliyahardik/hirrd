"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Home,
  Briefcase,
  User,
  LogOut,
  Search,
  Bookmark,
  BarChart3,
  Users,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface SidebarNavProps {
  userRole?: string;
}

export function SidebarNav({ userRole = "job_seeker" }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const jobSeekerLinks = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/jobs", label: "Browse Jobs", icon: Search },
    { href: "/dashboard/saved-jobs", label: "Saved Jobs", icon: Bookmark },
    {
      href: "/dashboard/applications",
      label: "My Applications",
      icon: Briefcase,
    },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  const recruiterLinks = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/jobs", label: "My Jobs", icon: Briefcase },
    { href: "/dashboard/company", label: "Company", icon: BarChart3 },
    { href: "/dashboard/applicants", label: "Applicants", icon: Users },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  const links = userRole === "recruiter" ? recruiterLinks : jobSeekerLinks;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform md:translate-x-0 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-border">
          <Link href="/" className="text-2xl font-bold text-primary">
            Hirrd
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-2">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-border p-4 space-y-3">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
