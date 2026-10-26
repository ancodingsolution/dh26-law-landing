import { ImageResponse } from "next/og";
import { company } from "@/lib/content";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export default function Icon() { return new ImageResponse(<div style={{ display: "flex", background: "#0b2440", color: "#e2c595", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{company.brandName[0]}</div>, size); }
