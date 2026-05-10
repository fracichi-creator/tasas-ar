"use client";
// components/Header.tsx — fiel al de breakeven.ar

import Link from "next/link";
import { usePathname } from "next/navigation";
import { C } from "./UI";

export default function Header({ asOf }: { asOf?: string }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isCurvas = pathname === "/curvas";

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <header style={{
      borderBottom: `1px solid ${C.border}`, padding: "14px 0", marginBottom: 32,
    }}>
      <div style={{
        maxWidth: 760, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/" style={{
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em",
            color: C.textMute, fontWeight: 600, textDecoration: "none",
          }}>
            <strong style={{ color: C.text }}>TASAS</strong>
            <span style={{ color: C.textDim }}> / MERCADO DE BONOS ARGENTINOS</span>
          </Link>
        </div>

        <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Link href="/" style={{
            padding: "6px 14px", borderRadius: 4, fontSize: 13, textDecoration: "none",
            fontFamily: "var(--sans)",
            color: isHome ? C.text : C.textMute,
            background: isHome ? C.bgSoft : "transparent",
            fontWeight: isHome ? 600 : 400,
            border: `1px solid ${isHome ? C.border : "transparent"}`,
            transition: "all 0.13s",
          }}>Breakeven</Link>
          <Link href="/curvas" style={{
            padding: "6px 14px", borderRadius: 4, fontSize: 13, textDecoration: "none",
            fontFamily: "var(--sans)",
            color: isCurvas ? C.text : C.textMute,
            background: isCurvas ? C.bgSoft : "transparent",
            fontWeight: isCurvas ? 600 : 400,
            border: `1px solid ${isCurvas ? C.border : "transparent"}`,
            transition: "all 0.13s",
          }}>Curvas</Link>

          {asOf && (
            <span style={{
              marginLeft: 12, fontFamily: "var(--mono)", fontSize: 10, color: C.textDim,
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", background: C.green,
                boxShadow: `0 0 5px ${C.green}`, display: "inline-block",
              }} />
              {formatTime(asOf)}
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
