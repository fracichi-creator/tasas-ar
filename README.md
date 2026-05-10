# Tasas AR — Tu herramienta de bonos argentinos

Replica de breakeven.ar con datos reales de data912.com.

---

## Cómo publicarlo en internet (GitHub + Vercel)

### Paso 1 — Crear cuenta en GitHub
1. Entrá a https://github.com y creá tu cuenta (gratis)

### Paso 2 — Crear un repositorio nuevo
1. En GitHub, hacé clic en el botón verde **"New"** (arriba a la izquierda)
2. Nombre del repo: `tasas-ar` (o el que quieras)
3. Dejalo en **Public**
4. Hacé clic en **"Create repository"**

### Paso 3 — Subir los archivos
En la página del repo vacío que se abre:
1. Hacé clic en **"uploading an existing file"**
2. Arrastrá TODOS los archivos de esta carpeta al área que aparece
3. Hacé clic en **"Commit changes"**

### Paso 4 — Conectar con Vercel
1. Entrá a https://vercel.com
2. Hacé clic en **"Sign up"** → **"Continue with GitHub"** (usás la misma cuenta)
3. En el dashboard de Vercel, hacé clic en **"Add New Project"**
4. Buscá el repo `tasas-ar` y hacé clic en **"Import"**
5. Dejá todo como está y hacé clic en **"Deploy"**
6. En ~1 minuto Vercel te da tu URL pública 🎉

---

## Para hacer cambios después

Cualquier cambio que hagas en GitHub → Vercel lo detecta y redespliega automáticamente.

---

## Stack técnico
- Next.js 14 (App Router)
- TypeScript
- Recharts (gráficos)
- data912.com (fuente de precios, fetch del lado del servidor)
- dolarapi.com (tipo de cambio)

## Estructura
```
tasas-ar/
├── app/
│   ├── api/
│   │   ├── bonos/route.ts    ← proxy a data912 (server-side)
│   │   └── dolar/route.ts    ← proxy a dolarapi
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Dashboard.tsx         ← UI principal
│   ├── CurvaChart.tsx        ← gráfico de curva
│   ├── TablaBonos.tsx        ← tabla de instrumentos
│   └── UI.tsx                ← componentes base
├── lib/
│   ├── calculos.ts           ← lógica financiera (TIR, breakeven)
│   └── data912.ts            ← fetch a APIs externas
└── package.json
```
