"use client";
// lib/useYields.ts

import { useState, useEffect, useCallback } from "react";
import type { YieldsResponse } from "./types";

export function useYields() {
  const [data, setData]       = useState<YieldsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/yields");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
    const t = setInterval(cargar, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [cargar]);

  return { data, loading, error, reload: cargar };
}
