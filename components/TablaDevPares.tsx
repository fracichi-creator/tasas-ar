"use client";
// components/TablaDevPares.tsx — tabla de devaluación implícita

import type { YieldsResponse } from "@/lib/types";
import { C } from "./UI";

interface Props { data: YieldsResponse; }

const headers = [
  { label: "Fijo",                  key: "fijo" },
  { label: "DLK",                   key: "dlk" },
  { label: "Duration",              key: "dur" },
  { label: "TNA fijo",              key: "tna" },
  { label: "TEA fijo",              key: "tea" },
  { label: "TIR USD DLK",           key: "tirUsd" },
  { label: "Anual (del par)",       key: "anualPar",  highlight: true },
  { label: "Anual (encadenada)",    key: "anualEnc",  highlight: true },
  { label: "Mensual",               key: "mensual",   highlight: true },
];

export default function TablaDevPares({ data }: Props) {
  const { devPairs } = data;
  if (!devPairs.length) return null;

  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.border}`,
      borderRadius: 6, marginTop: 14, overflowX: "auto",
    }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "var(--sans)" }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h.key} style={{
                padding: "10px 14px", textAlign: "left",
                fontSize: 12, fontWeight: 700,
                color: h.highlight ? C.green : C.text,
                borderBottom: `2px solid ${C.border}`,
              }}>
                {h.label} <span style={{ color: C.textDim, marginLeft: 2 }}>ⓘ</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {devPairs.map((p, i) => (
            <tr key={i} style={{
              background: i % 2 === 0 ? "transparent" : `${C.bgSoft}40`,
              borderBottom: `1px solid ${C.borderSoft}`,
            }}>
              <td style={{ padding: "9px 14px", fontFamily: "var(--mono)", fontWeight: 700, color: C.blue }}>
                {p.fijo.ticker}
              </td>
              <td style={{ padding: "9px 14px", fontFamily: "var(--mono)", fontWeight: 700, color: C.purple }}>
                {p.dlk.ticker}
              </td>
              <td style={{ padding: "9px 14px", color: C.textSoft, fontFamily: "var(--mono)" }}>
                {p.duration.toFixed(2)}
              </td>
              <td style={{ padding: "9px 14px", color: C.textSoft, fontFamily: "var(--mono)" }}>
                {(p.fijo.tirTna * 100).toFixed(2)}%
              </td>
              <td style={{ padding: "9px 14px", color: C.textSoft, fontFamily: "var(--mono)" }}>
                {(p.fijo.tirTea * 100).toFixed(2)}%
              </td>
              <td style={{
                padding: "9px 14px", fontFamily: "var(--mono)",
                color: p.dlk.tirUsd < -0.001 ? C.red : p.dlk.tirUsd > 0.001 ? C.green : C.textDim,
              }}>
                {(p.dlk.tirUsd * 100).toFixed(2)}%
              </td>
              <td style={{ padding: "9px 14px", fontFamily: "var(--mono)", fontWeight: 700, color: C.green }}>
                {(p.devaluacionAnualDirecta * 100).toFixed(2)}%
              </td>
              <td style={{ padding: "9px 14px", fontFamily: "var(--mono)", fontWeight: 700, color: C.green }}>
                {(p.devaluacionAnual * 100).toFixed(2)}%
              </td>
              <td style={{ padding: "9px 14px", fontFamily: "var(--mono)", fontWeight: 700, color: C.green }}>
                {(p.devaluacionMensual * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
