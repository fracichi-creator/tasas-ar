"use client";
// app/page.tsx — Home (Breakeven) con tabla bajo cada gráfico

import { useYields } from "@/lib/useYields";
import { C, Spinner } from "@/components/UI";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Senales from "@/components/Senales";
import BreakevenChart from "@/components/BreakevenChart";
import TablaPares from "@/components/TablaPares";
import DevaluacionPanel from "@/components/DevaluacionPanel";
import TablaDevPares from "@/components/TablaDevPares";

export default function HomePage() {
  const { data, loading, error } = useYields();

  return (
    <main style={{ minHeight: "100vh", background: C.bg }}>
      <Header asOf={data?.asOf} />

      <article style={{ maxWidth: 1040, margin: "0 auto", padding: "0 24px 80px" }}>

        <h1 style={{ marginBottom: 12 }}>Tasas del mercado argentino</h1>
        <p style={{ fontSize: 18, color: C.textSoft, fontStyle: "italic", marginBottom: 24 }}>
          La inflación que el mercado está priceando, en criollo y con data en vivo.
        </p>

        <p style={{ marginBottom: 16 }}>
          Argentina tiene varias familias de bonos del Tesoro que se tocan todo el tiempo:
          los de <strong>tasa fija</strong> (LECAPs / BONCAPs), los que <strong>ajustan por inflación</strong> (BONCERs)
          y los que <strong>ajustan por el dólar oficial</strong> (DLKs). Comparar uno contra otro al mismo plazo
          te dice qué espera el mercado para lo que viene: cuánta inflación, cuánta devaluación y qué tasa real.
        </p>

        <details style={{ marginBottom: 28 }}>
          <summary>¿Cómo funciona cada comparación?</summary>
          <div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>
                <strong>Fijo vs CER al mismo plazo = inflación implícita.</strong> Si un bono fijo te paga TEA 27% y un CER al mismo
                vencimiento paga TIR real −5%, el mercado está priceando ~34% de inflación anual.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Fijo vs DLK al mismo plazo = devaluación implícita.</strong> Misma lógica con el dólar oficial.
              </li>
              <li>
                <strong>Forma de la curva = qué piensa el mercado sobre el futuro.</strong> Si las tasas comprimen parejo, hay confianza.
                Si el corto queda arriba del largo (invertida) o hay puntos fuera de la tendencia, hay ruido o arbitrajes.
              </li>
            </ul>
          </div>
        </details>

        {/* SEÑALES */}
        <h2>Señales del mercado</h2>
        <p style={{ fontStyle: "italic", color: C.textMute, marginBottom: 12 }}>
          Cómo se movió la curva hoy y qué bonos se escapan de la tendencia.
        </p>
        {loading && !data && <Spinner label="Cargando señales…" />}
        {error && !data && <ErrorBox msg={error} />}
        {data && <Senales data={data} />}

        {/* INFLACIÓN IMPLÍCITA */}
        <h2>Inflación implícita</h2>
        <p style={{ fontStyle: "italic", color: C.textMute, marginBottom: 12 }}>
          Cuánta inflación espera el mercado a cada plazo.
        </p>
        {loading && !data && <Spinner />}
        {data && (
          <>
            <BreakevenChart data={data} />
            <TablaPares data={data} />
          </>
        )}

        {/* DEVALUACIÓN IMPLÍCITA */}
        <h2>Devaluación implícita</h2>
        <p style={{ fontStyle: "italic", color: C.textMute, marginBottom: 12 }}>
          La misma idea pero con el dólar oficial: lo que el mercado descuenta que va a devaluarse el peso.
        </p>
        {loading && !data && <Spinner label="Cargando…" />}
        {data && (
          <>
            <DevaluacionPanel data={data} />
            <TablaDevPares data={data} />
          </>
        )}

        <Footer />
      </article>
    </main>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{
      background: `${C.red}10`, border: `1px solid ${C.red}40`,
      borderRadius: 6, padding: "12px 16px", marginTop: 8,
      color: C.red, fontSize: 13, fontFamily: "var(--sans)",
    }}>
      <strong>Error:</strong> {msg}
    </div>
  );
}
