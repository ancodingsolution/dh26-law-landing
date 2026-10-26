"use client";
import Script from "next/script";
import { useEffect, useRef } from "react";
import copy from "@/data/contact.json";
type TurnstileApi = {
  render: (container: HTMLElement, options: { sitekey: string; action: string; theme: string; size: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: TurnstileApi } }
export function TurnstileInput({ siteKey, onToken, onError, resetKey }: { siteKey: string; onToken: (token: string) => void; onError: () => void; resetKey: number }) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  useEffect(() => { if (widget.current) window.turnstile?.reset(widget.current); }, [resetKey]);
  useEffect(() => () => { if (widget.current) window.turnstile?.remove(widget.current); }, []);
  return <><Script id="turnstile-script" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => {
    if (!container.current || widget.current || !window.turnstile) return;
    widget.current = window.turnstile.render(container.current, { sitekey: siteKey, action: "contact", theme: "light", size: "flexible", callback: onToken, "expired-callback": () => onToken(""), "error-callback": () => { onToken(""); onError(); } });
  }} onError={onError} /><div className="turnstile-container" aria-label={copy.verificationLabel} ref={container} /></>;
}
