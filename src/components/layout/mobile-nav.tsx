"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileNav({ items, openLabel, closeLabel, navigationLabel }: { items: { href: string; label: string }[]; openLabel: string; closeLabel: string; navigationLabel: string }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => { setOpen(false); trigger.current?.focus(); };
  return <div className="mobile-nav" onKeyDown={(event) => { if (event.key === "Escape" && open) { event.preventDefault(); close(); } }}>
    <button ref={trigger} type="button" className="menu-trigger" aria-label={open ? closeLabel : openLabel} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
    <nav id="mobile-navigation" aria-label={navigationLabel} hidden={!open} onBlur={(event) => { if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
      {items.map((item) => <Link key={item.href} href={item.href} onClick={close}>{item.label}</Link>)}
    </nav>
  </div>;
}
