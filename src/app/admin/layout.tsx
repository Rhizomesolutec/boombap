"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "@/src/components/ui/Icon";

const NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    href: "/admin/tickets",
    label: "Tickets",
    icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z",
  },
  // {
  //   href: "/admin/attendees",
  //   label: "Attendees",
  //   icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  // },
  {
    href: "/admin/events",
    label: "Events",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  // {
  //   href: "/admin/analytics",
  //   label: "Analytics",
  //   icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  // },
  // {
  //   href: "/admin/settings",
  //   label: "Settings",
  //   icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  // },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<string>("Admin");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("custom-cursor-mode");
    document.documentElement.classList.add("normal-cursor-mode");

    if (pathname !== "/admin/login") {
      setLoggingOut(false);
      // Fetch session info
      fetch("/api/admin/me")
        .then((r) => r.json())
        .then((d) => {
          if (d.username) {
            setAdminUser(d.username);
          } else {
            setAdminUser("Admin");
          }
        })
        .catch(() => {
          setAdminUser("Admin");
        });
    }

    return () => {
      document.documentElement.classList.remove("normal-cursor-mode");
    };
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="normal-cursor-scope min-h-screen bg-[#080808] text-white flex admin-layout">
      {/* ── Mobile overlay ─────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 flex flex-col
          bg-[#0d0d0d] border-r border-white/6
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center px-6 py-6 border-b border-white/6">
          <Image
            src="/bmbp-green-logo.png"
            alt="BOOMBAP Logo"
            width={72}
            height={72}
            className="h-26 w-32 object-contain"
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/25">Main Menu</p>
          <ul className="space-y-0.5 select-none">
            {NAV_ITEMS.slice(0, 5).map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href} className="cursor-pointer">
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
  flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium
  transition-all duration-150
  cursor-pointer! select-none
  ${active
    ? "bg-primary/10 text-primary border-l-2 border-primary pl-[10px]"
    : "text-white/50 hover:text-white hover:bg-white/4 border-l-2 border-transparent pl-[10px]"
  }
`}
                  >
                    <span className="shrink-0"><Icon d={item.icon} /></span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* <p className="px-3 mt-6 mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/25">Insights</p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.slice(5).map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium
                      transition-all duration-150
                      ${active
                        ? "bg-[#A0EF46]/10 text-[#A0EF46] border-l-2 border-[#A0EF46] pl-[10px]"
                        : "text-white/50 hover:text-white hover:bg-white/[0.04] border-l-2 border-transparent pl-[10px]"
                      }
                    `}
                  >
                    <span className="shrink-0"><Icon d={item.icon} /></span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul> */}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/6 space-y-1">
          <Link
            href="/"
            className="flex items-center cursor-pointer! gap-2 px-3 py-2 text-xs text-white/30 hover:text-white/60 transition-colors rounded-sm hover:bg-white/3"
          >
            <Icon d="M10 19l-7-7m0 0l7-7m-7 7h18" size={14} />
            Back to Site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/6 transition-colors rounded-sm cursor-pointer!"
          >
            <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={14} />
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 md:px-6 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/6">
          {/* Hamburger */}
          <button
            id="admin-sidebar-toggle"
            type="button"
            className="lg:hidden flex items-center justify-center h-8 w-8 text-white/50 hover:text-white transition-colors"
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label="Toggle sidebar"
          >
            <Icon d="M4 6h16M4 12h16M4 18h16" />
          </button>

          {/* Page breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-white/30">
            <span>Admin</span>
            <span>/</span>
            <span className="text-white/60 capitalize">
              {pathname.split("/").filter(Boolean).slice(1).join(" / ")}
            </span>
          </div>

          {/* Right controls */}
          <div className="ml-auto flex items-center gap-2">
            {/* Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/8">
              <div className="h-7 w-7 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-black text-black">
                {adminUser.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:block text-xs text-white/50">{adminUser}</span>
            </div>
            {/* Logout shortcut */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign out"
              className="hidden md:flex items-center justify-center h-7 w-7 text-white/25 hover:text-red-400 transition-colors cursor-pointer!"
            >
              <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={15} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
