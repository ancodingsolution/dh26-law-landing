import { z } from "zod";
import copy from "@/data/contact.json";
export const contactSchema = z.strictObject({
  name: z.string().trim().min(2, copy.nameError).max(100, copy.nameError).regex(/^[^\u0000-\u001f\u007f]+$/, copy.nameError),
  phone: z.string().trim().max(30, copy.phoneError).transform((phone) => phone.replace(/[\s.()-]/g, "")).refine((phone) => /^(?:0|\+84)(?:[35789]\d{8}|2\d{9})$/.test(phone), copy.phoneError),
  email: z.string().trim().max(254, copy.emailError).pipe(z.email(copy.emailError)),
  message: z.string().trim().min(20, copy.messageError).max(2000, copy.messageError),
  consent: z.boolean().refine((consent) => consent, copy.consentError),
  turnstileToken: z.string().max(2048).default(""),
  website: z.string().max(0).default(""),
});
export type ContactInput = z.input<typeof contactSchema>;
export type ContactPayload = z.output<typeof contactSchema>;
