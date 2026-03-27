"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, MapPin, Heart, User } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/map", label: "Map", icon: MapPin },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-forest-700/60 bg-forest-900/95 backdrop-blur-md safe-bottom">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]",
                active
                  ? "text-pine"
                  : "text-forest-300 hover:text-forest-100"
              )}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={clsx("transition-all", active && "drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]")}
              />
              <span className={clsx("text-[10px] font-medium tracking-wide", active ? "text-pine" : "text-forest-400")}>
                {label}
              </span>
              {active && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-pine" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
