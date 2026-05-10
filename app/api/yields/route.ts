// app/api/yields/route.ts
// Proxy del endpoint público de breakeven.ar — corre del lado del servidor
// para evitar CORS y cachea 5 minutos.

import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
  try {
    const res = await fetch("https://breakeven.ar/api/yields", {
      next: { revalidate: 300 },
      headers: { "Accept": "application/json" },
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Upstream ${res.status}` }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching yields:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
