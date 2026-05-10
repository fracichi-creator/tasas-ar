"use client";
// components/UI.tsx

import React from "react";

export const C = {
  bg:          "#f4efe5",
  bgCard:      "#fbf7ee",
  bgSoft:      "#ebe4d4",
  border:      "#d6cdb9",
  borderSoft:  "#e3dcc9",

  text:        "#161311",
  textSoft:    "#3d362e",
  textMute:    "#756c5e",
  textDim:     "#a89e8b",

  blue:        "#2b5fb5",
  orange:      "#d97a3a",
  green:       "#4a8b3a",
  greenBg:     "#d1dfbf",
  greenSoft:   "#e6efd8",
  purple:      "#7a4ba8",
  red:         "#b03a3a",
  yellow:      "#c89a2a",
};

export const TYPE_COLOR: Record<string, string> = {
  LECAP: C.blue, BONCAP: C.blue,
  BONCER: C.orange, LECER: C.orange,
  DLK: C.purple,
};

// "Cómo leer" — desplegable
export function ComoLeer({ children, label = "Cómo leer" }: { children: React.ReactNode; label?: string }) {
  return (
    <details>
      <summary>{label}</summary>
      <div>{children}</div>
    </details>
  );
}

export function Spinner({ label = "Cargando cotizaciones de data912…" }: { label?: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      color: C.textMute, fontSize: 14, padding: "20px 0",
      fontFamily: "var(--sans)",
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: "50%",
        border: `2px solid ${C.borderSoft}`, borderTopColor: C.blue,
        animation: "spin 0.8s linear infinite", flexShrink: 0,
      }} />
      <em>{label}</em>
    </div>
  );
}

// Pill / chip pequeño con color
export function Chip({ label, color, bg }: { label: string; color: string; bg?: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "1px 8px",
      fontSize: 11,
      fontWeight: 700,
      fontFamily: "var(--mono)",
      letterSpacing: "0.05em",
      color,
      background: bg ?? `${color}18`,
      border: `1px solid ${color}33`,
      borderRadius: 3,
    }}>{label}</span>
  );
}
