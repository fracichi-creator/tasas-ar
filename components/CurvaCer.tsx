"use client";
// components/CurvaCer.tsx — replica fiel de "Curva de rendimientos — CER (tasa real)"

import { useState, useMemo } from "react";
import {
  Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ComposedChart, Line,
} from "recharts";
import type { YieldsResponse } from "@/lib/types";
import { C } from "./UI";

interface Props { data: YieldsResponse; }

const SERIES = [
  { key: "boncer",    label: "BONCER / LECER", color: C.orange, shape: "square" as const },
  { key: "tendencia", label: "Tendencia",      color: C.purple, shape: "line-dashed" as const },
];

const Y_TO_DAYS = 365;

// Regresión cuadrática simple para ajustar la tendencia visible en el screenshot
function fitQuadratic(points: { x: number; y: number }[]) {
  const n = points.length;
  if (n < 3) return null;
  // y = a + bx + cx^2 — least squares
  let sX = 0, sY = 0, sXY = 0, sXX = 0, sX3 = 0, sX4 = 0, sX2Y = 0;
  for (const p of points) {
    sX += p.x; sY += p.y;
    sXY += p.x * p.y; sXX += p.x * p.x;
    sX3 += p.x ** 3; sX4 += p.x ** 4;
    sX2Y += p.x * p.x * p.y;
  }
  // sistema 3x3 — solver simple por Cramer
  const det = (a: number[][]) =>
    a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1])
    - a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0])
    + a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0]);
  const A: number[][] = [[n, sX, sXX], [sX, sXX, sX3], [sXX, sX3, sX4]];
  const D = det(A);
  if (Math.abs(D) < 1e-9) return null;
  const Da = det([[sY, sX, sXX], [sXY, sXX, sX3], [sX2Y, sX3, sX4]]);
  const Db = det([[n, sY, sXX], [sX, sXY, sX3], [sXX, sX2Y, sX4]]);
  const Dc = det([[n, sX, sY], [sX, sXX, sXY], [sXX, sX3, sX2Y]]);
  return { a: Da / D, b: Db / D, c: Dc / D };
}

export default function CurvaCer({ data }: Props) {
  const { cerYields, asOf } = data;

  const [active, setActive] = useState<Record<string, boolean>>({
    boncer: true, tendencia: true,
  });
  const toggle = (k: string) => setActive(a => ({ ...a, [k]: !a[k] }));

  const puntos = useMemo(() => cerYields.map(c => ({
    x: c.dtm,
    y: parseFloat((c.tirReal * 100).toFixed(2)),
    ticker: c.ticker, nombre: c.nombre, tipo: c.tipo, flag: c.arbFlag,
  })), [cerYields]);

  // Tendencia cuadrática sobre los puntos (las funciones del backend son lineares; mejor cuadrática para curva real)
  const trend = useMemo(() => {
    const fit = fitQuadratic(puntos);
    if (!fit) return [];
    const xMin = Math.max(0, Math.min(...puntos.map(p => p.x)));
    const xMax = Math.max(...puntos.map(p => p.x));
    const N = 60;
    const out: { x: number; trend: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const x = xMin + (xMax - xMin) * (i / N);
      out.push({ x, trend: fit.a + fit.b * x + fit.c * x * x });
    }
    return out;
  }, [puntos]);

  const tickerLabel = (props: { x?: number; y?: number; index?: number }) => {
    if (props.x == null || props.y == null) return <g />;
    const p = puntos[props.index ?? -1];
    if (!p) return <g />;
    const above = p.y > -10;
    return (
      <text x={props.x} y={props.y + (above ? -8 : 16)} fill={p.flag === "cheap" ? C.green : p.flag === "expensive" ? C.red : C.orange}
        textAnchor="middle" fontSize={9.5} fontFamily="var(--mono)" fontWeight={700}>
        {p.ticker}
      </text>
    );
  };

  function CustomTooltip({ active: act, payload }: { active?: boolean; payload?: { payload: typeof puntos[0] }[] }) {
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
        <div style={{ color: C.textMute, fontSize: 11, marginBottom: 4 }}>{d.nombre}</div>
        <div style={{ color: C.orange }}>TIR real: <strong>{d.y}%</strong></div>
        <div style={{ color: C.textMute }}>Días al venc.: {d.x}</div>
        {d.flag !== "normal" && (
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
          Curva de rendimientos — CER (tasa real)
        </h3>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: C.textMute }}>
          {formatDateTime(asOf)}
        </span>
      </div>

      <Toggles series={SERIES} active={active} onToggle={toggle} />

      <ResponsiveContainer width="100%" height={420}>
        <ComposedChart margin={{ top: 24, right: 28, left: 0, bottom: 28 }}>
          <CartesianGrid stroke={C.borderSoft} strokeDasharray="2 4" />
          <XAxis
            type="number" dataKey="x"
            domain={[0, "dataMax + 50"]}
            tick={{ fill: C.textMute, fontSize: 11, fontFamily: "var(--sans)" }}
            tickFormatter={v => Math.round(v).toString()}
            axisLine={{ stroke: C.border }} tickLine={{ stroke: C.border }}
            label={{ value: "Días al vencimiento", position: "insideBottom", offset: -14, fill: C.textMute, fontSize: 11, fontFamily: "var(--sans)" }}
          />
          <YAxis
            type="number"
            tickFormatter={v => `${v.toFixed(0)}%`}
            tick={{ fill: C.textMute, fontSize: 11, fontFamily: "var(--sans)" }}
            axisLine={{ stroke: C.border }} tickLine={{ stroke: C.border }}
            width={56}
            label={{ value: "TIR real (%)", angle: -90, position: "insideLeft", offset: 14, fill: C.textMute, fontSize: 11, fontFamily: "var(--sans)" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: C.borderSoft }} />

          {active.tendencia && trend.length > 0 && (
            <Line
              data={trend} dataKey="trend" name="Tendencia"
              stroke={C.purple} strokeWidth={1.5} strokeDasharray="5 4"
              dot={false} activeDot={false}
              isAnimationActive={false}
            />
          )}

          {active.boncer && (
            <Scatter
              data={puntos} name="BONCER / LECER" shape="square"
              isAnimationActive={false}
              label={tickerLabel}
            >
              {puntos.map((p, i) => (
                <Cell key={i} fill={p.flag === "cheap" ? C.green : p.flag === "expensive" ? C.red : C.orange} />
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
