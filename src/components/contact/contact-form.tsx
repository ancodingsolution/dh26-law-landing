"use client";

import Link from "next/link";
import { useCallback, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle, Mail, MessageSquareText, Phone, UserRound } from "lucide-react";
import copy from "@/data/contact.json";
import { Button } from "@/components/ui/button";
import { contactSchema, type ContactInput, type ContactPayload } from "@/schemas/contact.schema";
import { TurnstileInput } from "./turnstile-input";

export function ContactForm({ siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY, compact = false }: { siteKey?: string; compact?: boolean }) {
  const id = useId();
  const busy = useRef(false);
  const [feedback, setFeedback] = useState<{ state: "success" | "error"; message: string } | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const { register, handleSubmit, setValue, setError, clearErrors, reset, formState: { errors, isSubmitting } } = useForm<ContactInput, unknown, ContactPayload>({ resolver: zodResolver(contactSchema), defaultValues: { name: "", phone: "", email: "", message: "", consent: false, turnstileToken: "", website: "" } });
  const onToken = useCallback((token: string) => { setValue("turnstileToken", token); if (token) clearErrors("turnstileToken"); }, [setValue, clearErrors]);
  const onVerificationError = useCallback(() => setError("turnstileToken", { message: copy.spamError }), [setError]);
  const submit = async (input: ContactPayload) => {
    if (busy.current) return;
    if (!siteKey) { setFeedback({ state: "error", message: copy.unavailable }); return; }
    if (!input.turnstileToken) { onVerificationError(); return; }
    busy.current = true;
    setFeedback(null);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input), signal: AbortSignal.timeout(25_000) });
      const result: unknown = await response.json();
      if (!response.ok || typeof result !== "object" || result === null || !("success" in result) || result.success !== true) {
        setFeedback({ state: "error", message: response.status === 503 ? copy.unavailable : response.status === 429 ? copy.rateLimited : copy.error });
        return;
      }
      setFeedback({ state: "success", message: copy.success });
      reset();
    } catch { setFeedback({ state: "error", message: copy.error }); }
    finally { onToken(""); setResetKey((key) => key + 1); busy.current = false; }
  };
  const errorFor = (name: keyof ContactInput) => errors[name]?.message ? <p className="field-error" id={`${id}-${name}-error`}>{String(errors[name]?.message)}</p> : null;
  const fieldProps = (name: keyof ContactInput) => ({ id: `${id}-${name}`, "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined });
  return <form className={`contact-form${compact ? " contact-form-compact" : ""}`} noValidate onSubmit={(event) => void handleSubmit(submit)(event)} aria-busy={isSubmitting}>
    <p className="form-note">{copy.requiredNote}</p><div className="form-grid">
      <div className="field"><label htmlFor={`${id}-name`}>{copy.name} *</label><div className="field-control"><UserRound className="field-icon" size={17} aria-hidden="true" /><input {...register("name")} {...fieldProps("name")} autoComplete="name" maxLength={100} placeholder={copy.namePlaceholder} required /></div>{errorFor("name")}</div>
      <div className="field"><label htmlFor={`${id}-phone`}>{copy.phone} *</label><div className="field-control"><Phone className="field-icon" size={17} aria-hidden="true" /><input {...register("phone")} {...fieldProps("phone")} type="tel" autoComplete="tel" maxLength={30} placeholder={copy.phonePlaceholder} required /></div>{errorFor("phone")}</div>
      <div className="field field-wide"><label htmlFor={`${id}-email`}>{copy.email} *</label><div className="field-control"><Mail className="field-icon" size={17} aria-hidden="true" /><input {...register("email")} {...fieldProps("email")} type="email" autoComplete="email" maxLength={254} placeholder={copy.emailPlaceholder} required /></div>{errorFor("email")}</div>
      <div className="field field-wide"><label htmlFor={`${id}-message`}>{copy.message} *</label><div className="field-control"><MessageSquareText className="field-icon" size={17} aria-hidden="true" /><textarea {...register("message")} {...fieldProps("message")} rows={4} maxLength={2000} placeholder={copy.messagePlaceholder} required /></div>{errorFor("message")}</div>
    </div><label className="consent-label" htmlFor={`${id}-consent`}><input {...register("consent")} {...fieldProps("consent")} type="checkbox" required /><span>{copy.consent} <Link href="/chinh-sach-bao-mat">{copy.privacyLink}</Link> {copy.consentSuffix}</span></label>{errorFor("consent")}
    <div hidden aria-hidden="true"><label htmlFor={`${id}-website`}>Website</label><input {...register("website")} id={`${id}-website`} tabIndex={-1} autoComplete="off" /></div><input type="hidden" {...register("turnstileToken")} />
    {siteKey && <TurnstileInput siteKey={siteKey} onToken={onToken} onError={onVerificationError} resetKey={resetKey} />}{errorFor("turnstileToken")}
    <p className="form-note">{copy.notice}</p>
    {!siteKey && <p className="form-feedback" role="status">{copy.unavailable}</p>}
    {feedback && <p className="form-feedback" data-state={feedback.state} role="status" aria-live="polite">{feedback.message}</p>}
    <Button type="submit" disabled={isSubmitting || !siteKey}>{isSubmitting ? <><LoaderCircle size={17} className="loading-spinner" aria-hidden="true" />{copy.submitting}</> : <>{copy.submit}<ArrowRight size={17} aria-hidden="true" /></>}</Button>
  </form>;
}
