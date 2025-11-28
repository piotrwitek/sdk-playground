import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "../../lib/utils";

interface NavigationItem {
  href: string;
  label: string;
}

const navigationItems: NavigationItem[] = [
  { href: "/", label: "Vaults" },
  { href: "/cross-chain", label: "Cross-chain" },
  { href: "/positions", label: "Positions" },
  { href: "/position-activity", label: "Position Activity" },
  { href: "/merkl", label: "Merkl Rewards" },
  { href: "/rewards", label: "Rewards" },
];

export function Navigation() {
  const router = useRouter();

  return (
    <nav className="flex space-x-6">
      {navigationItems.map((item) => {
        const isActive = router.pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors",
              "hover:bg-slate-100 hover:text-slate-900",
              isActive
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
