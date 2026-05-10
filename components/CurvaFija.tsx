"use client";
// components/CurvaFija.tsx — replica fiel de "Curva de rendimientos — Tasa fija"

import { useState, useMemo } from "react";
import {
  ScatterChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart, Cell,
} from "recharts";
import type { YieldsResponse } from "@/lib/types";
import { C } from "./UI";

interface Props { data: YieldsResponse; }

const SERIES = [
  { key: "lecap",     label: "LECAP",     color: C.blue,   shape: "dot" as const },
  { key: "boncap",    label: "BONCAP",    color: C.blue,   shape: "square" as const },
  { key: "tendencia", label: "Tendencia", color: C.orange, shape: "line-dashed" as const },
];

// fitLog viene con x = duration en años; lo convertimos a días
const Y_TO_DAYS = 365;

export default function CurvaFija({ data }: Props) {
  const { instruments, fitLog, asOf } = data;

  const [active, setActive] = useState<Record<string, boolean>>({
    lecap: true, boncap: true, tendencia: true,
  });
  const toggle = (k: string) => setActive(a => ({ ...a, [k]: !a[k] }));

  // LECAPs: círculos azules
  const lecaps = useMemo(() => instruments
    .filter(i => i.tipo === "lecap")
    .map(i => ({
      x: i.dtm,
      y: parseFloat((i.tirTea * 100).toFixed(2)),
      ticker: i.ticker, nombre: i.nombre, tipo: "LECAP",
      flag: i.arbFlag,
    })), [instruments]);

  // BONCAPs (y BONTE): cuadrados azules
  const boncaps = useMemo(() => instruments
    .filter(i => i.tipo === "boncap" || i.tipo === "bonte")
    .map(i => ({
      x: i.dtm,
      y: parseFloat((i.tirTea * 100).toFixed(2)),
      ticker: i.ticker, nombre: i.nombre, tipo: i.tipo.toUpperCase(),
      flag: i.arbFlag,
    })), [instruments]);

  // Tendencia: convertir duration (años) a días
  const trend = useMemo(() => fitLog.map(p => ({
    x: p.x * Y_TO_DAYS, trend: p.y,
  })), [fitLog]);

  // Etiqueta con ticker
  const tickerLabel = (color: string, points: { ticker: string }[]) => (props: { x?: number; y?: number; index?: number }) => {
    if (props.x == null || props.y == null) return <g />;
    const p = points[props.index ?? -1];
    if (!p) return <g />;
    return (
      <text x={props.x} y={props.y - 9} fill={color} textAnchor="middle"
        fontSize={9.5} fontFamily="var(--mono)" fontWeight={700}>
        {p.ticker}
      </text>
    );
  };

  function CustomTooltip({ active: act, payload }: { active?: boolean; payload?: { payload: { ticker?: string; nombre?: string; tipo?: string; x: number; y: number; flag?: string } }[] }) {
    if (!act || !payload?.length) return null;
    const d = payload[0].payload;
    if (!d.ticker) return null;
    return (
      <div style={{
        background: C.bgCard, border: `1px solid ${C.border}`,
        borderRadius: 4, padding: "10px 12px",
        fontFamily: "var(--sans)", fontSize: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}>
        <div style={{ fontFamily: "var(--mono)", fontWeight: 700, color: C.text }}>{d.ticker}</div>
        {d.nombre && <div style={{ color: C.textMute, fontSize: 11, marginBottom: 4 }}>{d.nombre}</div>}
        <div style={{ color: C.text }}>TIR (TEA): <strong>{d.y}%</strong></div>
        <div style={{ color: C.textMute }}>Días al venc.: {d.x}</div>
        {d.flag && d.flag !== "normal" && (
          <div style={{ marginTop: 4, color: d.flag === "cheap" ? C.green : C.red, fontWeight: 600, fontSize: 11 }}>
            {d.flag === "cheap" ? "↑ Por encima de la curva (barato)" : "↓ Por debajo de la curva (caro)"}
          </div>
        )}
      </div>
    );
  }

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("es-AR", {
      day: "numeric", month: "numeric", year: "2-digit",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.border}`,
      borderRadius: 6, padding: "16px 18px 14px", marginTop: 8,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 12, flexWrap: "wrap", gap: 12,
      }}>
        <h3 style={{
          fontSize: 17, fontWeight: 700, color: C.text,
          margin: 0, fontFamily: "var(--serif)",
        }}>
          Curva de rendimientos — Tasa fija
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: C.textMute }}>
            {formatDateTime(asOf)}
          </span>
        </div>
      </div>

      <Toggles series={SERIES} active={active} onToggle={toggle} />

      <ResponsiveContainer width="100%" height={420}>
        <ComposedChart margin={{ top: 24, right: 28, left: 0, bottom: 28 }}>
          <CartesianGrid stroke={C.borderSoft} strokeDasharray="2 4" />
          <XAxis
            type="number" dataKey="x"
            domain={[0, "dataMax + 30"]}
            tick={{ fill: C.textMute, fontSize: 11, fontFamily: "var(--sans)" }}
            tickFormatter={v => Math.round(v).toString()}
            axisLine={{ stroke: C.border }} tickLine={{ stroke: C.border }}
            label={{ value: "Días al vencimiento", position: "insideBottom", offset: -14, fill: C.textMute, fontSize: 11, fontFamily: "var(--sans)" }}
          />
          <YAxis
            type="number"
            tickFormatter={v => `${v.toFixed(1)}%`}
            tick={{ fill: C.textMute, fontSize: 11, fontFamily: "var(--sans)" }}
            axisLine={{ stroke: C.border }} tickLine={{ stroke: C.border }}
            width={56}
            label={{ value: "TIR (%)", angle: -90, position: "insideLeft", offset: 14, fill: C.textMute, fontSize: 11, fontFamily: "var(--sans)" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: C.borderSoft }} />

          {active.tendencia && trend.length > 0 && (
            <Line
              data={trend} dataKey="trend" name="Tendencia"
              stroke={C.orange} strokeWidth={1.5} strokeDasharray="5 4"
              dot={false} activeDot={false}
              isAnimationActive={false}
            />
          )}

          {active.lecap && lecaps.length > 0 && (
            <Scatter
              data={lecaps} name="LECAP" shape="circle"
              fill={C.blue}
              isAnimationActive={false}
              label={tickerLabel(C.blue, lecaps)}
            >
              {lecaps.map((p, i) => (
                <Cell key={i} fill={p.flag === "cheap" ? C.green : p.flag === "expensive" ? C.red : C.blue} />
              ))}
            </Scatter>
          )}

          {active.boncap && boncaps.length > 0 && (
            <Scatter
              data={boncaps} name="BONCAP" shape="square"
              fill={C.blue}
              isAnimationActive={false}
              label={tickerLabel(C.blue, boncaps)}
            >
              {boncaps.map((p, i) => (
                <Cell key={i} fill={p.flag === "cheap" ? C.green : p.flag === "expensive" ? C.red : C.blue} />
              ))}
            </Scatter>
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function Toggles({ series, active, onToggle }: {
  series: typeof SERIES; active: Record<string, boolean>; onToggle: (k: string) => void
}) {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "flex-end",
      marginBottom: 6, fontFamily: "var(--sans)", fontSize: 12,
    }}>
      {series.map(s => {
        const on = active[s.key];
        return (
          <button
            key={s.key} onClick={() => onToggle(s.key)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "none", border: "none", cursor: "pointer",
              padding: "2px 0", opacity: on ? 1 : 0.4,
              color: on ? C.text : C.textMute, transition: "opacity 0.13s",
            }}
          >
            <Glyph shape={s.shape} color={s.color} />
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

function Glyph({ shape, color }: { shape: typeof SERIES[0]["shape"]; color: string }) {
  if (shape === "dot") return <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />;
  if (shape === "square") return <span style={{ width: 10, height: 10, background: color, display: "inline-block" }} />;
  if (shape === "line-dashed") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 1.5 }}>
        <span style={{ width: 5, height: 2, background: color }} />
        <span style={{ width: 5, height: 2, background: color }} />
        <span style={{ width: 5, height: 2, background: color }} />
      </span>
    );
  }
  return <span style={{ width: 14, height: 2, background: color }} />;
}
