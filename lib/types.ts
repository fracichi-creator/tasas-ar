// lib/types.ts
// Tipos basados exactamente en la respuesta de /api/yields

export interface Instrument {
  ticker: string;
  nombre: string;
  tipo: "lecap" | "boncap" | "bonte";
  fechaVencimiento: string;
  dtm: number;            // días al vencimiento
  precio: number;
  vnFinal: number;
  tirTem: number;         // tasa efectiva mensual
  tirTea: number;         // tasa efectiva anual
  tirTna: number;         // tasa nominal anual
  modifiedDuration: number;
  pctChange: number;
  teaDelta?: number;
  residual: number;
  arbFlag: "cheap" | "normal" | "expensive";
}

export interface CerYield {
  ticker: string;
  nombre: string;
  tipo: "lecer" | "boncer";
  fechaVencimiento: string;
  dtm: number;
  precio: number;
  vnAjustado: number;
  tirReal: number;
  tirRealProyectado: number;
  modifiedDuration: number;
  pctChange: number;
  residual: number;
  arbFlag: "cheap" | "normal" | "expensive";
}

export interface DlkYield {
  ticker: string;
  nombre: string;
  tipo: "dlk";
  fechaVencimiento: string;
  dtm: number;
  precio: number;
  precioUsd: number;
  tirUsd: number;
  modifiedDuration: number;
  pctChange: number;
  residual: number;
  arbFlag: "cheap" | "normal" | "expensive";
}

export interface Pair {
  fijo: Instrument;
  cer: CerYield;
  durationGap: number;
  duration: number;
  inflacionAnual: number;
  inflacionAnualDirecta: number;
  inflacionMensual: number;
}

export interface DevPair {
  fijo: Instrument;
  dlk: DlkYield;
  durationGap: number;
  duration: number;
  devaluacionAnual: number;
  devaluacionAnualDirecta: number;
  devaluacionMensual: number;
}

export interface FitPoint {
  x: number;
  y: number;
}

export interface RemPoint {
  duration: number;
  label: string;
  annualRate: number;
}

export interface YieldsResponse {
  asOf: string;
  cerToday: number;
  cerAsOf: string;
  cerProjected: number;
  cerLagDays: number;
  cerMonthlyInflation: number;
  tcToday: number;
  tcAsOf: string;
  instruments: Instrument[];
  cerYields: CerYield[];
  dlkYields: DlkYield[];
  pairs: Pair[];
  devPairs: DevPair[];
  fitLog: FitPoint[];
  fitLogBreakeven: FitPoint[];
  rem: {
    publishedAt: string;
    label: string;
    points: RemPoint[];
  };
}
