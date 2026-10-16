"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Ikon } from "@/components/ui.tsx";
import {
  AWAL,
  type Hasil,
  type IdSkenario,
  type Parameter,
  SKENARIO,
  dariAlamat,
  hitung,
  keAlamat,
  skenarioAktif,
} from "@/lib/model.ts";

/**
 * Satu sumber kebenaran untuk seluruh asumsi kalkulator.
 *
 * Disimpan di alamat (query string), bukan di localStorage: hasil hitungan
 * bisa ditandai, dibagikan lewat WhatsApp, dan dibuka orang lain dengan angka
 * yang persis sama. Muat ulang halaman juga mengembalikan keadaan yang sama.
 *
 * Alamat ditulis lewat history.replaceState, bukan router.replace — penggeser
 * memicu puluhan perubahan per detik, dan setiap router.replace memicu render
 * server baru. replaceState tetap disinkronkan Next ke useSearchParams.
 */

type Konteks = {
  p: Parameter;
  h: Hasil;
  ubah: (perubahan: Partial<Parameter>) => void;
  pakaiSkenario: (id: IdSkenario) => void;
  kembalikan: () => void;
  alamat: string;
};

const KonteksParameter = createContext<Konteks | null>(null);

export function PenyediaParameter({ children }: { children: React.ReactNode }) {
  const sp = useSearchParams();
  const [p, setP] = useState<Parameter>(() => dariAlamat(sp));

  const alamat = useMemo(() => keAlamat(p), [p]);

  useEffect(() => {
    const tujuan = `${window.location.pathname}${alamat ? `?${alamat}` : ""}`;
    if (tujuan !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(window.history.state, "", tujuan);
    }
  }, [alamat]);

  const ubah = useCallback((perubahan: Partial<Parameter>) => setP((lama) => ({ ...lama, ...perubahan })), []);
  const pakaiSkenario = useCallback((id: IdSkenario) => {
    const s = SKENARIO[id];
    setP((lama) => ({ ...lama, pangsa: s.pangsa, diskon: s.diskon, margin: s.margin }));
  }, []);
  const kembalikan = useCallback(() => setP({ ...AWAL, substitusi: { ...AWAL.substitusi } }), []);

  const h = useMemo(() => hitung(p), [p]);

  return (
    <KonteksParameter.Provider value={{ p, h, ubah, pakaiSkenario, kembalikan, alamat }}>
      {children}
    </KonteksParameter.Provider>
  );
}

export function useParameter(): Konteks {
  const k = useContext(KonteksParameter);
  if (!k) throw new Error("useParameter harus dipakai di dalam PenyediaParameter");
  return k;
}

/* ------------------------------------------------------------- kendali */

/** Chip skenario. "Kustom" muncul aktif sendiri begitu penggeser digeser. */
export function PemilihSkenario() {
  const { p, pakaiSkenario } = useParameter();
  const aktif = skenarioAktif(p);
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Pilih skenario">
      {(Object.keys(SKENARIO) as IdSkenario[]).map((id) => {
        const on = aktif === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => pakaiSkenario(id)}
            aria-pressed={on}
            title={SKENARIO[id].keterangan}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              on
                ? "bg-accent font-semibold text-on-accent"
                : "border border-line bg-surface font-medium text-ink-2 hover:bg-surface-2"
            }`}
          >
            {SKENARIO[id].label}
          </button>
        );
      })}
      <span
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm ${
          aktif === null ? "bg-accent-soft font-semibold text-accent-ink" : "text-muted"
        }`}
        aria-live="polite"
      >
        <Ikon nama="tune" className="text-[0.95rem]" />
        Kustom
      </span>
    </div>
  );
}

/**
 * Penggeser bertabel angka. Angkanya juga bisa diketik: menggeser ke 37,5%
 * dengan jempol hampir mustahil, mengetiknya mudah.
 */
export function Penggeser({
  label,
  nilai,
  ubah,
  min,
  max,
  langkah = 1,
  satuan = "%",
  keterangan,
}: {
  label: string;
  nilai: number;
  ubah: (n: number) => void;
  min: number;
  max: number;
  langkah?: number;
  satuan?: string;
  keterangan?: React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
        <span className="flex items-center gap-1">
          <input
            type="number"
            aria-label={`${label} (angka)`}
            value={nilai}
            min={min}
            max={max}
            step={langkah}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n)) ubah(n);
            }}
            className="tnum w-20 rounded-lg border border-line bg-surface px-2 py-1 text-right text-sm font-semibold focus-visible:border-accent"
          />
          <span className="w-6 text-xs text-muted">{satuan}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={langkah}
        value={Math.min(max, Math.max(min, nilai))}
        onChange={(e) => ubah(Number(e.target.value))}
        className="w-full"
      />
      <div className="tnum flex justify-between text-[0.7rem] text-muted">
        <span>
          {min}
          {satuan}
        </span>
        {keterangan && <span className="text-center">{keterangan}</span>}
        <span>
          {max}
          {satuan}
        </span>
      </div>
    </div>
  );
}

/** Isian angka berlabel mono, untuk asumsi dasar yang jarang diubah. */
export function IsianAngka({
  label,
  nilai,
  ubah,
  langkah = "any",
  satuan,
  sumber,
  bawaan,
}: {
  label: string;
  nilai: number;
  ubah: (n: number) => void;
  langkah?: number | "any";
  satuan?: string;
  sumber?: string;
  bawaan: number;
}) {
  const id = useId();
  const berubah = nilai !== bawaan;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-mono text-[0.62rem] tracking-[0.1em] text-muted uppercase">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          value={nilai}
          step={langkah}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (e.target.value !== "" && Number.isFinite(n)) ubah(n);
          }}
          className={`tnum w-full min-w-0 rounded-xl border bg-surface px-3 py-2 text-sm focus-visible:border-accent ${
            berubah ? "border-accent font-semibold" : "border-line"
          }`}
        />
        {satuan && <span className="shrink-0 text-xs text-muted">{satuan}</span>}
      </div>
      <p className="text-xs text-muted">
        {berubah ? (
          <button type="button" onClick={() => ubah(bawaan)} className="font-medium text-accent-ink hover:underline">
            Kembalikan ke {bawaan.toLocaleString("id-ID")}
          </button>
        ) : (
          sumber
        )}
      </p>
    </div>
  );
}

/** Tombol salin tautan — membagikan skenario persis seperti di layar. */
export function TombolBagikan() {
  const [tersalin, setTersalin] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setTersalin(true);
          window.setTimeout(() => setTersalin(false), 2000);
        } catch {
          // Clipboard bisa ditolak (http, izin). Alamat di bilah peramban tetap bisa disalin tangan.
        }
      }}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-ink-2 transition-colors hover:bg-surface-2 print:hidden"
    >
      <Ikon nama={tersalin ? "check_circle" : "link"} className="text-[1.1rem]" />
      <span aria-live="polite">{tersalin ? "Tautan tersalin" : "Salin tautan skenario"}</span>
    </button>
  );
}

export function TombolKembalikan() {
  const { kembalikan, alamat } = useParameter();
  return (
    <button
      type="button"
      onClick={kembalikan}
      disabled={!alamat}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-ink-2 transition-colors hover:bg-surface-2 disabled:opacity-50 print:hidden"
    >
      <Ikon nama="refresh" className="text-[1.1rem]" />
      Kembalikan asumsi awal
    </button>
  );
}
