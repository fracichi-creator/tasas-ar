"use client";
// app/curvas/page.tsx

import { useYields } from "@/lib/useYields";
import { C, Spinner } from "@/components/UI";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CurvaFija from "@/components/CurvaFija";
import CurvaCer from "@/components/CurvaCer";
import TablaInstrumentos from "@/components/TablaInstrumentos";
import Link from "next/link";

export default function CurvasPage() {
  const { data, loading, error } = useYields();

  return (
    <main style={{ minHeight: "100vh", background: C.bg }}>
      <Header asOf={data?.asOf} />

      <article style={{ maxWidth: 1040, margin: "0 auto", padding: "0 24px 80px" }}>

        <h1 style={{ marginBottom: 12 }}>Curvas por familia</h1>
        <p style={{ fontSize: 18, color: C.textSoft, fontStyle: "italic", marginBottom: 24 }}>
          Qué rinde cada bono por separado, sin pares implícitos en la mezcla.
        </p>

        <p style={{ marginBottom: 28 }}>
          Dos curvas, una por cada familia de bonos del Tesoro en pesos:{" "}
          <strong style={{ color: C.blue }}>tasa fija</strong> (LECAP/BONCAP) y{" "}
          <strong style={{ color: C.orange }}>CER</strong> (BONCER/LECER). Usá esta vista para ver el shape de cada curva,
          identificar bonos fuera de la tendencia y comparar tickers individuales. Para los breakevens implícitos entre familias,{" "}
          <Link href="/" style={{ color: C.blue }}>volvé al home</Link>.
        </p>

        <h2>Curva de tasa fija</h2>
        <p style={{ fontStyle: "italic", color: C.textMute, marginBottom: 12 }}>
          Qué rinde cada LECAP y BONCAP por separado, sin CER ni dólar en la mezcla.
        </p>
        <details style={{ marginBottom: 8 }}>
          <summary>¿Cómo leer este gráfico?</summary>
          <div>
            Cada punto es una letra o bono a tasa fija. Eje X = días al vencimiento. Eje Y = TIR (TEA) que deja el precio de hoy.
            La línea naranja punteada es la tendencia logarítmica — los puntos arriba están más altos que la curva (rinden más),
            los de abajo más bajos. Los <strong style={{ color: C.green }}>verdes</strong> son baratos según el modelo,
            los <strong style={{ color: C.red }}>rojos</strong> caros.
          </div>
        </details>
        {loading && !data && <Spinner />}
        {error && !data && <ErrorBox msg={error} />}
        {data && (
          <>
            <CurvaFija data={data} />
            <TablaInstrumentos data={data} familia="fija" />
          </>
        )}

        <h2>Curva de tasa real (CER)</h2>
        <p style={{ fontStyle: "italic", color: C.textMute, marginBottom: 12 }}>
          Cuánto paga cada BONCER por encima de la inflación.
        </p>
        <details style={{ marginBottom: 8 }}>
          <summary>¿Cómo leer este gráfico?</summary>
          <div>
            Cada cuadrado es un BONCER o LECER. Eje X = días al vencimiento. Eje Y = TIR real (TEA por encima de la inflación).
            Cuando la TIR real es negativa, el mercado está pagando caro la cobertura contra la inflación. La línea violeta
            punteada muestra la tendencia ajustada.
          </div>
        </details>
        {loading && !data && <Spinner label="Cargando cotizaciones…" />}
        {data && (
          <>
            <CurvaCer data={data} />
            <TablaInstrumentos data={data} familia="cer" />
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
      color: C.red, fontSize: 13,
    }}>
      <strong>Error:</strong> {msg}
    </div>
  );
}
