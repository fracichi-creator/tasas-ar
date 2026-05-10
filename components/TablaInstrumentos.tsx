"use client";
// components/TablaInstrumentos.tsx — tablas para curvas

import type { YieldsResponse } from "@/lib/types";
import { C } from "./UI";

interface Props {
  data: YieldsResponse;
  familia: "fija" | "cer";
}

const TIPO_CHIP_COLOR: Record<string, string> = {
  LECAP: C.blue, BONCAP: "#5288d4", BONTE: "#7baef0", LECER: C.orange, BONCER: "#c98c5a",
};

const fmtFecha = (s: string) => {
  const d = new Date(s);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export default function TablaInstrumentos({ data, familia }: Props) {
  if (familia === "fija") {
    const rows = [...data.instruments].sort((a, b) => a.dtm - b.dtm);
    return (
      <div style={{
        background: C.bgCard, border: `1px solid ${C.border}`,
        borderRadius: 6, marginTop: 12, overflowX: "auto",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "var(--sans)" }}>
          <thead>
            <tr>
              {[
                "Ticker", "Precio", "Pago final", "Duration",
                "Días", "Vencimiento", "TNA", "TEM", "TIR"
              ].map(h => (
                <th key={h} style={{
                  padding: "10px 14px", textAlign: "left",
                  fontSize: 12, fontWeight: 700,
                  color: h === "TIR" ? C.blue : C.text,
                  borderBottom: `2px solid ${C.border}`,
                }}>
                  {h} <span style={{ color: C.textDim, marginLeft: 2, fontWeight: 400 }}>ⓘ</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const tipoUpper = r.tipo.toUpperCase();
              const chipColor = TIPO_CHIP_COLOR[tipoUpper] || C.blue;
              return (
                <tr key={r.ticker} style={{
                  background: i % 2 === 0 ? "transparent" : `${C.bgSoft}40`,
                  borderBottom: `1px solid ${C.borderSoft}`,
                }}>
                  <td style={{ padding: "9px 14px" }}>
                    <span style={{ fontFamily: "var(--mono)", fontWeight: 700, color: C.blue, marginRight: 7 }}>
                      {r.ticker}
                    </span>
                    <span style={{
                      display: "inline-block", padding: "1px 7px",
                      fontFamily: "var(--mono)", fontSize: 9.5, fontWeight: 700,
                      letterSpacing: "0.05em",
                      background: `${chipColor}20`, color: chipColor,
                      border: `1px solid ${chipColor}55`, borderRadius: 2,
                    }}>{tipoUpper}</span>
                  </td>
                  <td style={{ padding: "9px 14px", color: C.textSoft, fontFamily: "var(--mono)" }}>
                    {r.precio.toFixed(2).replace(".", ",")}
                  </td>
                  <td style={{ padding: "9px 14px", color: C.textSoft, fontFamily: "var(--mono)" }}>
                    {r.vnFinal.toFixed(2).replace(".", ",")}
                  </td>
                  <td style={{ padding: "9px 14px", color: C.textSoft, fontFamily: "var(--mono)" }}>
                    {r.modifiedDuration.toFixed(2)}
                  </td>
                  <td style={{ padding: "9px 14px", color: C.textSoft, fontFamily: "var(--mono)" }}>
                    {r.dtm}
                  </td>
                  <td style={{ padding: "9px 14px", color: C.textSoft, fontFamily: "var(--mono)" }}>
                    {fmtFecha(r.fechaVencimiento)}
                  </td>
                  <td style={{ padding: "9px 14px", color: C.textSoft, fontFamily: "var(--mono)" }}>
                    {(r.tirTna * 100).toFixed(2)}%
                  </td>
                  <td style={{ padding: "9px 14px", color: C.textSoft, fontFamily: "var(--mono)" }}>
                    {(r.tirTem * 100).toFixed(2)}%
                  </td>
                  <td style={{ padding: "9px 14px", color: C.blue, fontFamily: "var(--mono)", fontWeight: 700 }}>
                    {(r.tirTea * 100).toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // CER
  const rows = [...data.cerYields].sort((a, b) => a.dtm - b.dtm);
  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.border}`,
      borderRadius: 6, marginTop: 12, overflowX: "auto",
    }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "var(--sans)" }}>
        <thead>
          <tr>
            {["Ticker", "Precio", "Duration", "Días", "Vencimiento", "TIR real"].map(h => (
              <th key={h} style={{
                padding: "10px 14px", textAlign: "left",
                fontSize: 12, fontWeight: 700,
                color: h === "TIR real" ? C.orange : C.text,
                borderBottom: `2px solid ${C.border}`,
              }}>
                {h} <span style={{ color: C.textDim, marginLeft: 2, fontWeight: 400 }}>ⓘ</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.ticker} style={{
              background: i % 2 === 0 ? "transparent" : `${C.bgSoft}40`,
              borderBottom: `1px solid ${C.borderSoft}`,
            }}>
              <td style={{ padding: "9px 14px", fontFamily: "var(--mono)", fontWeight: 700, color: C.orange }}>
                {r.ticker}
              </td>
              <td style={{ padding: "9px 14px", color: C.textSoft, fontFamily: "var(--mono)" }}>
                {r.precio.toFixed(2).replace(".", ",")}
              </td>
              <td style={{ padding: "9px 14px", color: C.textSoft, fontFamily: "var(--mono)" }}>
                {r.modifiedDuration.toFixed(2)}
              </td>
              <td style={{ padding: "9px 14px", color: C.textSoft, fontFamily: "var(--mono)" }}>
                {r.dtm}
              </td>
              <td style={{ padding: "9px 14px", color: C.textSoft, fontFamily: "var(--mono)" }}>
                {fmtFecha(r.fechaVencimiento)}
              </td>
              <td style={{
                padding: "9px 14px", fontFamily: "var(--mono)", fontWeight: 700,
                color: r.tirReal < 0 ? C.red : C.green,
              }}>
                {(r.tirReal * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
