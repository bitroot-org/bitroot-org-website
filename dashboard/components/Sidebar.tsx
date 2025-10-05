"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  HomeIcon,
  FolderIcon,
  ClockIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";

interface SidebarProps {
  isBkcStudent: boolean;
  userEmail: string;
  userRole: string;
}

export default function Sidebar({ isBkcStudent, userEmail, userRole }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = userRole === "admin";

  useEffect(() => {
    console.log("Sidebar mounted with:", { isBkcStudent, userEmail, userRole, pathname });
  }, [isBkcStudent, userEmail, userRole, pathname]);

  // Admin navigation
  const adminNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Students", href: "/dashboard/admin/students", icon: AcademicCapIcon },
    { name: "Projects", href: "/dashboard/admin/projects", icon: FolderIcon },
    { name: "Interviews", href: "/dashboard/admin/interviews", icon: ClockIcon },
    { name: "Universities", href: "/dashboard/admin/universities", icon: ChartBarIcon },
    { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
  ];

  // Student navigation - base items
  const studentBaseNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Projects", href: "/dashboard/projects", icon: FolderIcon },
    { name: "Timeline", href: "/dashboard/timeline", icon: ClockIcon },
  ];

  // Additional items for BKC students only
  const bkcOnlyNavigation = [
    { name: "Submissions", href: "/dashboard/submissions", icon: ChartBarIcon },
    { name: "Resources", href: "/dashboard/resources", icon: AcademicCapIcon },
    { name: "Profile", href: "/dashboard/profile", icon: Cog6ToothIcon },
  ];

  // Determine navigation based on role
  let navigation;
  if (isAdmin) {
    navigation = adminNavigation;
  } else if (isBkcStudent) {
    navigation = [...studentBaseNavigation, ...bkcOnlyNavigation];
  } else {
    navigation = [...studentBaseNavigation, { name: "Profile", href: "/dashboard/profile", icon: Cog6ToothIcon }];
  }

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
      {/* Logo/Brand with Orange Gradient Background */}
      <div className="relative h-24 overflow-hidden">
        {/* Orange Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600"></div>

        {/* Grid Lines Overlay */}
        <div
          className="absolute inset-0 opacity-12"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        ></div>

        {/* CC Logo */}
        <div className="relative h-full flex items-center justify-center">
          <img
            src="/cc-logo.svg"
            alt="CC Logo"
            className="h-16 w-auto"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {userEmail.split("@")[0]}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {isAdmin ? "Admin" : isBkcStudent ? "BKC Student" : "Student"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}