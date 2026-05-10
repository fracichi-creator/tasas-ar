"use client";
// components/Senales.tsx — replica del bloque "Señales del mercado"

import { useMemo } from "react";
import type { YieldsResponse } from "@/lib/types";
import { C } from "./UI";

interface Props { data: YieldsResponse; }

interface SenalChip {
  ticker: string;
  tipo: "tasa fija" | "CER" | "DLK";
  pp: number;       // movimiento en pp (puntos porcentuales)
}

const TIPO_LABEL = {
  lecap:  "tasa fija", boncap: "tasa fija", bonte: "tasa fija",
  lecer:  "CER",       boncer: "CER",
  dlk:    "DLK",
} as const;

export default function Senales({ data }: Props) {
  const { instruments, cerYields, dlkYields } = data;

  // Movimiento promedio TEA hoy: promedio de teaDelta (en pp = decimal * 100)
  const movPromedio = useMemo(() => {
    const deltas = instruments
      .map(i => i.teaDelta)
      .filter((v): v is number => v != null);
    if (!deltas.length) return null;
    const avg = deltas.reduce((s, v) => s + v, 0) / deltas.length;
    return avg * 100; // pp
  }, [instruments]);

  // Top 3 movimientos absolutos (mayores cambios en TEA hoy)
  const movs = useMemo<SenalChip[]>(() => {
    return instruments
      .filter(i => i.teaDelta != null)
      .map(i => ({
        ticker: i.ticker,
        tipo: TIPO_LABEL[i.tipo] as SenalChip["tipo"],
        pp: (i.teaDelta as number) * 100,
      }))
      .sort((a, b) => Math.abs(b.pp) - Math.abs(a.pp))
      .slice(0, 3);
  }, [instruments]);

  // Arbitraje: bonos cheap/expensive
  const arbitrajes = useMemo(() => {
    const all: { ticker: string; tipo: SenalChip["tipo"]; flag: "cheap" | "expensive"; residual: number; metric: number }[] = [];

    instruments.forEach(i => {
      if (i.arbFlag !== "normal") {
        all.push({
          ticker: i.ticker,
          tipo: "tasa fija",
          flag: i.arbFlag,
          residual: i.residual,
          metric: i.residual,
        });
      }
    });
    cerYields.forEach(c => {
      if (c.arbFlag !== "normal") {
        all.push({
          ticker: c.ticker,
          tipo: "CER",
          flag: c.arbFlag,
          residual: c.residual,
          metric: c.residual,
        });
      }
    });
    dlkYields.forEach(d => {
      if (d.arbFlag !== "normal") {
        all.push({
          ticker: d.ticker,
          tipo: "DLK",
          flag: d.arbFlag,
          residual: d.residual,
          metric: d.residual,
        });
      }
    });

    return {
      baratos: all.filter(x => x.flag === "cheap").sort((a, b) => Math.abs(b.residual) - Math.abs(a.residual)),
      caros:   all.filter(x => x.flag === "expensive").sort((a, b) => Math.abs(b.residual) - Math.abs(a.residual)),
    };
  }, [instruments, cerYields, dlkYields]);

  // Etiqueta del título de la card izquierda según movimiento
  const tituloMov =
    movPromedio == null ? "SIN DATOS" :
    movPromedio < -0.5 ? "LA CURVA COMPRIME" :
    movPromedio > 0.5  ? "LA CURVA SE EXPANDE" :
                         "CURVA ESTABLE";

  const subTituloMov =
    movPromedio == null ? "" :
    movPromedio < 0
      ? "Los precios subieron y los rendimientos bajaron — el mercado está pagando más por la misma tasa."
      : "Los precios bajaron y los rendimientos subieron — el mercado está pidiendo más rendimiento.";

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14,
      marginTop: 8,
    }}>
      {/* IZQUIERDA: Movimiento de la curva */}
      <div style={{
        background: C.bgCard, border: `1px solid ${C.border}`,
        borderRadius: 6, padding: 18,
      }}>
        <ChipTitulo color={C.green}>{tituloMov}</ChipTitulo>
        <h3 style={{
          fontSize: 15, fontWeight: 700, color: C.text,
          margin: "12px 0 8px", fontFamily: "var(--serif)",
        }}>
          Movimiento promedio TEA hoy: {movPromedio != null ? `${movPromedio > 0 ? "+" : ""}${movPromedio.toFixed(2)}pp` : "—"}
        </h3>
        <p style={{
          fontSize: 13, color: C.textMute, lineHeight: 1.55, margin: "0 0 14px",
          fontFamily: "var(--sans)",
        }}>
          {subTituloMov}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {movs.map(m => (
            <TickerChip key={m.ticker} ticker={m.ticker} tipo="" valor={`${m.pp > 0 ? "+" : ""}${m.pp.toFixed(2)}pp`} bg={C.greenSoft} fg={C.green} />
          ))}
        </div>
      </div>

      {/* DERECHA: Señales de arbitraje */}
      <div style={{
        background: C.bgCard, border: `1px solid ${C.border}`,
        borderRadius: 6, padding: 18,
      }}>
        <h3 style={{
          fontSize: 15, fontWeight: 700, color: C.text,
          margin: "0 0 14px", fontFamily: "var(--serif)",
        }}>
          Señales de arbitraje — bonos fuera de la tendencia
        </h3>

        {/* Baratos */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <ChipTitulo color={C.green}>BARATOS</ChipTitulo>
            <span style={{ color: C.textMute, fontSize: 12, fontFamily: "var(--sans)", fontStyle: "italic" }}>
              (rinden más de lo que debería por la curva — oportunidad de compra)
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {arbitrajes.baratos.map(b => (
              <TickerChip
                key={b.ticker}
                ticker={b.ticker} tipo={b.tipo}
                valor={`+${Math.abs(b.residual).toFixed(1)}%`}
                bg={C.greenSoft} fg={C.green}
              />
            ))}
            {arbitrajes.baratos.length === 0 && (
              <span style={{ color: C.textDim, fontSize: 12, fontStyle: "italic" }}>Sin señales hoy.</span>
            )}
          </div>
        </div>

        {/* Caros */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <ChipTitulo color={C.red}>CAROS</ChipTitulo>
            <span style={{ color: C.textMute, fontSize: 12, fontFamily: "var(--sans)", fontStyle: "italic" }}>
              (rinden menos que la curva — evitar o aprovechar para vender)
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {arbitrajes.caros.map(c => (
              <TickerChip
                key={c.ticker}
                ticker={c.ticker} tipo={c.tipo}
                valor={`${c.residual > 0 ? "+" : ""}${c.residual.toFixed(1)}%`}
                bg={`${C.red}18`} fg={C.red}
              />
            ))}
            {arbitrajes.caros.length === 0 && (
              <span style={{ color: C.textDim, fontSize: 12, fontStyle: "italic" }}>Sin señales hoy.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChipTitulo({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 9px",
      fontSize: 10.5,
      fontWeight: 800,
      fontFamily: "var(--sans)",
      letterSpacing: "0.08em",
      color, background: `${color}22`,
      border: `1px solid ${color}55`, borderRadius: 3,
    }}>{children}</span>
  );
}

function TickerChip({ ticker, tipo, valor, bg, fg }: { ticker: string; tipo: string; valor: string; bg: string; fg: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 8px 3px 8px",
      borderRadius: 3, background: bg,
      border: `1px solid ${fg}40`,
      fontFamily: "var(--sans)", fontSize: 12,
    }}>
      <strong style={{ fontFamily: "var(--mono)", color: fg, fontWeight: 700 }}>{ticker}</strong>
      {tipo && <span style={{ color: C.textMute, fontSize: 11 }}>{tipo}</span>}
      <span style={{ color: fg, fontWeight: 600 }}>{valor}</span>
    </span>
  );
}
