"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Team" },
  { href: "/bluff", label: "Bluff" },
  { href: "/brettski", label: "Brettski" },
  { href: "/ontilt", label: "On Tilt Boys" },
  { href: "/impact", label: "Property impact" },
];

export default function ChannelNav() {
  const pathname = usePathname();
  return (
    <nav className="switcher" aria-label="Report sections">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={pathname === link.href ? "on" : ""}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
