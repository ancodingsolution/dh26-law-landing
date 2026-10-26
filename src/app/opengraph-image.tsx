import { ImageResponse } from "next/og";
import { company, homepage } from "@/lib/content";
export const alt = company.brandName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#0b2440", color: "#ffffff", padding: "76px 88px", borderBottom: "12px solid #c8a46b" }}><div style={{ fontSize: 38, color: "#e2c595", marginBottom: 50, letterSpacing: 6 }}>{company.brandName}</div><div style={{ fontSize: 62, lineHeight: 1.35, maxWidth: 950 }}>{homepage.hero.heading}</div><div style={{ color: "#c6d1dc", fontSize: 24, marginTop: 40 }}>{company.tradeName}</div></div>, size);
}
