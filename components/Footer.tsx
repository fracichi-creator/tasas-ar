// components/Footer.tsx
import { C } from "./UI";

export default function Footer() {
  return (
    <>
      <hr style={{ border: 0, borderTop: `1px solid ${C.border}`, margin: "60px 0 28px" }} />
      <footer style={{ fontSize: 14, color: C.textMute, lineHeight: 1.7 }}>
        <p style={{ marginBottom: 12 }}>
          Precios en vivo obtenidos de <a href="https://data912.com" target="_blank" rel="noopener noreferrer">data912.com</a>.
          Los cálculos de TIR, duration e inflación implícita son estimaciones propias a partir de precios de mercado y
          metadata pública de cada instrumento.
        </p>
        <p style={{ color: C.textDim, fontSize: 13, marginBottom: 20 }}>
          Este sitio es solo para fines educativos y de investigación. No constituye asesoramiento financiero ni
          recomendación de inversión. Los precios pueden tener hasta 20 minutos de demora.
        </p>
        <p style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>
          Desarrollado por Franco Cichi
        </p>
      </footer>
    </>
  );
}
