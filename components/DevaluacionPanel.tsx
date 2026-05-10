"use client";
// components/DevaluacionPanel.tsx — replica del bloque "Devaluación implícita"

import { useState, useMemo } from "react";
import {
  ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import type { YieldsResponse } from "@/lib/types";
import { C } from "./UI";

interface Props { data: YieldsResponse; }

const SERIES = [
  { key: "encadenada", label: "Devaluación (encadenada)", color: C.green,  shape: "line-dot" as const },
  { key: "delPar",     label: "Devaluación (del par)",    color: C.green,  shape: "line-dashed" as const },
  { key: "tasaFija",   label: "Tasa fija",                color: C.blue,   shape: "dot" as const },
  { key: "dlk",        label: "DLK (USD)",                color: C.orange, shape: "square" as const },
];

export default function DevaluacionPanel({ data }: Props) {
  const { instruments, dlkYields, devPairs, asOf, tcToday, tcAsOf } = data;

  const [active, setActive] = useState<Record<string, boolean>>({
    encadenada: true, delPar: true, tasaFija: false, dlk: false,
  });
  const toggle = (k: string) => setActive(a => ({ ...a, [k]: !a[k] }));

  const teaSeries = useMemo(() => instruments.map(i => ({
    x: i.modifiedDuration, y: parseFloat((i.tirTea * 100).toFixed(2)), ticker: i.ticker,
  })).sort((a, b) => a.x - b.x), [instruments]);

  const dlkSeries = useMemo(() => dlkYields.map(d => ({
    x: d.modifiedDuration, y: parseFloat((d.tirUsd * 100).toFixed(2)), ticker: d.ticker,
  })), [dlkYields]);

  const encadenadaSeries = useMemo(() => devPairs.map(p => ({
    x: p.duration, y: parseFloat((p.devaluacionAnual * 100).toFixed(1)),
  })).sort((a, b) => a.x - b.x), [devPairs]);

  const delParSeries = useMemo(() => devPairs.map(p => ({
    x: p.duration, y: parseFloat((p.devaluacionAnualDirecta * 100).toFixed(1)),
  })).sort((a, b) => a.x - b.x), [devPairs]);

  const encadenadaLabel = (props: { x?: number; y?: number; index?: number }) => {
    if (!active.encadenada || props.x == null || props.y == null) return <g />;
    const p = encadenadaSeries[props.index ?? -1];
    if (!p) return <g />;
    return (
      <text x={props.x} y={props.y - 7} fill={C.green} textAnchor="middle"
        fontSize={10} fontFamily="var(--mono)" fontWeight={700}>
        {p.y.toFixed(1)}%
      </text>
    );
  };

  function CustomTooltip({ active: act, payload }: { active?: boolean; payload?: { payload: { x: number; y: number; ticker?: string }; name?: string }[] }) {
    if (!act || !payload?.length) return null;
    const items = payload.filter(p => p.payload?.y != null);
    if (!items.length) return null;
    return (
      <div style={{
        background: C.bgCard, border: `1px solid ${C.border}`,
        borderRadius: 4, padding: "10px 14px",
        fontFamily: "var(--sans)", fontSize: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}>
        <div style={{ color: C.textMute, marginBottom: 6, fontFamily: "var(--mono)", fontSize: 10 }}>
          Duration: {items[0].payload.x.toFixed(2)}y
        </div>
        {items.map((p, i) => (
          <div key={i} style={{ marginBottom: 2 }}>
            <span style={{ color: C.textMute }}>{p.name}: </span>
            <strong>{p.payload.y}%</strong>
            {p.payload.ticker && <span style={{ color: C.textDim, fontSize: 11, marginLeft: 6, fontFamily: "var(--mono)" }}>{p.payload.ticker}</span>}
          </div>
        ))}
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
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        marginBottom: 12, flexWrap: "wrap", gap: 8,
      }}>
        <h3 style={{
          fontSize: 17, fontWeight: 700, color: C.text,
          margin: 0, fontFamily: "var(--serif)",
        }}>
          Breakeven de devaluación implícita
        </h3>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 11, color: C.textMute,
        }}>
          {formatDateTime(asOf)} · TC mayorista {tcToday.toFixed(2)} ({tcAsOf})
        </span>
      </div>

      <Toggles series={SERIES} active={active} onToggle={toggle} />

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart margin={{ top: 24, right: 28, left: 0, bottom: 28 }}>
          <CartesianGrid stroke={C.borderSoft} strokeDasharray="2 4" />
          <XAxis
            type="number" dataKey="x"
            domain={["dataMin - 0.05", "dataMax + 0.05"]}
            tick={{ fill: C.textMute, fontSize: 11, fontFamily: "var(--sans)" }}
            tickFormatter={v => v.toFixed(2)}
            axisLine={{ stroke: C.border }} tickLine={{ stroke: C.border }}
            label={{ value: "Duration (años)", position: "insideBottom", offset: -14, fill: C.textMute, fontSize: 11, fontFamily: "var(--sans)" }}
          />
          <YAxis
            type="number" dataKey="y"
            tickFormatter={v => `${v}%`}
            tick={{ fill: C.textMute, fontSize: 11, fontFamily: "var(--sans)" }}
            axisLine={{ stroke: C.border }} tickLine={{ stroke: C.border }}
            width={50}
            label={{ value: "Tasa (%)", angle: -90, position: "insideLeft", offset: 14, fill: C.textMute, fontSize: 11, fontFamily: "var(--sans)" }}
          />
          <Tooltip content={<CustomTooltip />} />

          {active.dlk && (
            <Scatter
              data={dlkSeries} name="DLK"
              fill={C.orange} shape="square"
              isAnimationActive={false}
            />
          )}

          {active.tasaFija && (
            <Line
              data={teaSeries} dataKey="y" name="Tasa fija"
              stroke={C.blue} strokeWidth={1.5}
              dot={{ r: 4, fill: C.blue, stroke: C.bgCard, strokeWidth: 1 }}
              activeDot={{ r: 6 }}
              type="monotone" connectNulls isAnimationActive={false}
            />
          )}

          {active.delPar && (
            <Line
              data={delParSeries} dataKey="y" name="Devaluación (del par)"
              stroke={C.green} strokeWidth={1.5} strokeDasharray="5 4"
              dot={false} activeDot={false}
              type="monotone" connectNulls isAnimationActive={false}
            />
          )}

          {active.encadenada && (
            <Line
              data={encadenadaSeries} dataKey="y" name="Devaluación (encadenada)"
              stroke={C.green} strokeWidth={2.5}
              dot={{ r: 4, fill: C.green, stroke: C.bgCard, strokeWidth: 1 }}
              activeDot={{ r: 6 }}
              type="monotone" connectNulls isAnimationActive={false}
              label={encadenadaLabel}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      <div style={{
        display: "flex", justifyContent: "center", gap: 24, marginTop: 8,
        fontSize: 11, color: C.textMute, fontFamily: "var(--sans)",
      }}>
        <span>0,25 ≈ 3 meses</span>
        <span>·</span>
        <span>0,5 ≈ 6 meses</span>
        <span>·</span>
        <span>1,0 ≈ 1 año</span>
        <span>·</span>
        <span>2,0 ≈ 2 años</span>
      </div>
    </div>
  );
}

function Toggles({ series, active, onToggle }: {
  series: typeof SERIES; active: Record<string, boolean>; onToggle: (k: string) => void
}) {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center",
      marginBottom: 8, fontFamily: "var(--sans)", fontSize: 12,
    }}>
      {series.map(s => {
        const on = active[s.key];
        return (
          <button
            key={s.key}
            onClick={() => onToggle(s.key)}
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
  if (shape === "line-dot") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 0 }}>
        <span style={{ width: 7, height: 2, background: color }} />
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block" }} />
        <span style={{ width: 7, height: 2, background: color }} />
      </span>
    );
  }
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
