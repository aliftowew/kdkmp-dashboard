import { IKON } from "@/lib/ikon.ts";

/**
 * Bentuk-bentuk dasar antarmuka.
 *
 * Dikumpulkan di satu berkas supaya sudut, bayangan, jarak, dan ukuran ikon
 * hanya diputuskan sekali. Halaman memanggil bentuk ini alih-alih menyusun
 * kelas sendiri, sehingga tidak ada kartu yang sudutnya berbeda dari kartu
 * sebelah hanya karena ditulis di hari lain.
 */

/** Nama yang tidak dikenal jatuh ke tanda tanya — tombol kosong terlihat rusak. */
export function Ikon({ nama, className = "" }: { nama: string; className?: string }) {
  const isi = IKON[nama] ?? IKON.help_outline;
  return (
    <svg
      className={`ikon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: isi }}
    />
  );
}

/* ------------------------------------------------------------------ kepala */

export function KepalaHalaman({
  kicker,
  judul,
  keterangan,
  aksi,
}: {
  kicker: string;
  judul: string;
  keterangan?: React.ReactNode;
  aksi?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-[0.7rem] font-bold tracking-[0.12em] text-accent-ink uppercase">{kicker}</span>
        <h1 className="text-3xl leading-[1.1] font-extrabold tracking-[-0.025em] sm:text-4xl">{judul}</h1>
        {keterangan && <p className="mt-1 max-w-[64ch] text-ink-2">{keterangan}</p>}
      </div>
      {aksi}
    </header>
  );
}

/** Judul bagian di tengah halaman (h2) beserta lede-nya. */
export function JudulBagian({ judul, lede }: { judul: string; lede?: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold tracking-[-0.02em]">{judul}</h2>
      {lede && <p className="mt-2 max-w-[76ch] text-sm text-ink-2">{lede}</p>}
    </div>
  );
}

/* ----------------------------------------------------------------- tombol */

const DASAR_TOMBOL =
  "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-opacity disabled:opacity-50";

export function Tombol({
  children,
  ikon,
  jenis = "utama",
  ...sisa
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { ikon?: string; jenis?: "utama" | "garis" }) {
  const gaya =
    jenis === "utama"
      ? "bg-accent text-on-accent shadow-kartu hover:opacity-90"
      : "border border-line bg-surface text-ink-2 hover:bg-surface-2";
  return (
    <button type="button" {...sisa} className={`${DASAR_TOMBOL} ${gaya} ${sisa.className ?? ""}`}>
      {ikon && <Ikon nama={ikon} className="text-[1.1rem]" />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ wadah */

export function Kartu({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface shadow-kartu ${className}`}>{children}</div>;
}

/** Panel bertajuk. h2, bukan h3: panel adalah bagian tingkat pertama di bawah h1. */
export function Panel({
  judul,
  kanan,
  children,
  className = "",
}: {
  judul: string;
  kanan?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-line bg-surface shadow-kartu ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h2 className="text-[0.95rem] font-bold tracking-[-0.01em]">{judul}</h2>
        {kanan}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

/* --------------------------------------------------------------- statistik */

export type Nada = "netral" | "aksen" | "baik" | "awas" | "buruk";

const NADA: Record<Nada, { kotak: string; angka: string }> = {
  netral: { kotak: "bg-surface-2 text-ink-2", angka: "" },
  aksen: { kotak: "bg-accent-soft text-accent-ink", angka: "" },
  baik: { kotak: "bg-ok-soft text-ok", angka: "text-ok" },
  awas: { kotak: "bg-warn-soft text-warn", angka: "text-warn" },
  buruk: { kotak: "bg-crit-soft text-crit", angka: "text-crit" },
};

export function Statistik({
  ikon,
  nilai,
  label,
  catatan,
  nada = "aksen",
}: {
  ikon: string;
  nilai: string;
  label: string;
  catatan?: React.ReactNode;
  nada?: Nada;
}) {
  const n = NADA[nada];
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-kartu">
      <span className={`grid h-9 w-9 place-items-center rounded-xl text-xl ${n.kotak}`}>
        <Ikon nama={ikon} />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className={`tnum text-[1.7rem] leading-none font-extrabold tracking-[-0.03em] ${n.angka}`}>{nilai}</span>
        <span className="text-sm font-medium text-ink-2">{label}</span>
        {catatan && <span className="mt-0.5 text-xs text-muted">{catatan}</span>}
      </div>
    </div>
  );
}

/** Angka kecil datar — untuk rincian yang tidak butuh ikon. */
export function RekapAngka({ label, nilai, catatan }: { label: string; nilai: string; catatan?: string }) {
  return (
    <div className="min-w-[11rem] flex-1 rounded-2xl border border-line bg-surface px-4 py-3 shadow-kartu">
      <p className="font-mono text-[0.62rem] tracking-[0.1em] text-muted uppercase">{label}</p>
      <p className="tnum mt-1 text-xl font-bold tracking-[-0.02em]">{nilai}</p>
      {catatan && <p className="mt-0.5 text-xs text-muted">{catatan}</p>}
    </div>
  );
}

export function Lencana({ nada = "aksen", ikon, children }: { nada?: Nada; ikon?: string; children: React.ReactNode }) {
  const warna = {
    netral: "bg-surface-2 text-muted",
    aksen: "bg-accent-soft text-accent-ink",
    baik: "bg-ok-soft text-ok",
    awas: "bg-warn-soft text-warn",
    buruk: "bg-crit-soft text-crit",
  }[nada];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.72rem] font-semibold whitespace-nowrap ${warna}`}
    >
      {ikon && <Ikon nama={ikon} className="text-[0.95rem]" />}
      {children}
    </span>
  );
}

/** Pemberitahuan bertepi warna — dipakai untuk penjelasan dan peringatan. */
export function Catatan({
  nada = "aksen",
  ikon,
  children,
}: {
  nada?: "aksen" | "awas" | "buruk";
  ikon?: string;
  children: React.ReactNode;
}) {
  const warna = nada === "awas" ? "border-warn" : nada === "buruk" ? "border-crit" : "border-accent";
  const ikonWarna = nada === "awas" ? "text-warn" : nada === "buruk" ? "text-crit" : "text-accent-ink";
  return (
    <div
      className={`flex gap-3 rounded-2xl rounded-l-lg border border-line border-l-[4px] bg-surface px-4 py-3.5 shadow-kartu ${warna}`}
    >
      {ikon && <Ikon nama={ikon} className={`mt-0.5 shrink-0 text-xl ${ikonWarna}`} />}
      <div className="text-sm text-ink-2">{children}</div>
    </div>
  );
}

/** Rumus ditulis mono supaya terbaca sebagai rumus, bukan kalimat. */
export function Rumus({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl bg-surface-2 px-3 py-2 font-mono text-[0.8rem] leading-relaxed text-ink">{children}</p>
  );
}

/* ------------------------------------------------------------------ tabel */

export function Th({ children, kanan }: { children?: React.ReactNode; kanan?: boolean }) {
  return (
    <th
      scope="col"
      className={
        "sticky top-0 z-10 border-b border-line bg-surface px-5 py-3 text-[0.68rem] font-bold tracking-[0.06em] whitespace-nowrap text-muted uppercase " +
        (kanan ? "text-right" : "text-left")
      }
    >
      {children}
    </th>
  );
}

export function Td({ children, kanan, className = "" }: { children: React.ReactNode; kanan?: boolean; className?: string }) {
  return (
    <td className={"border-t border-line px-5 py-3 align-middle " + (kanan ? "tnum text-right " : "") + className}>
      {children}
    </td>
  );
}

/* --------------------------------------------------------------- kerangka */

/** Kerangka pemuatan yang meniru tata letak halaman supaya isi tidak melompat. */
export function Kerangka({ tiles = 4, baris = 5 }: { tiles?: number; baris?: number }) {
  const denyut = "motion-safe:animate-pulse";
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Memuat data…</span>
      <div className="flex flex-col gap-3">
        <div className={`h-3 w-24 rounded bg-surface-2 ${denyut}`} />
        <div className={`h-9 w-80 max-w-full rounded-lg bg-surface-2 ${denyut}`} />
        <div className={`h-4 w-full max-w-xl rounded bg-surface-2 ${denyut}`} />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: tiles }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-kartu">
            <div className={`h-9 w-9 rounded-xl bg-surface-2 ${denyut}`} />
            <div className={`h-7 w-20 rounded bg-surface-2 ${denyut}`} />
            <div className={`h-3 w-28 rounded bg-surface-2 ${denyut}`} />
          </div>
        ))}
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface shadow-kartu">
        <div className="border-b border-line px-5 py-3.5">
          <div className={`h-4 w-40 rounded bg-surface-2 ${denyut}`} />
        </div>
        {Array.from({ length: baris }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-t border-line px-5 py-3.5">
            <div className={`h-3 w-28 rounded bg-surface-2 ${denyut}`} />
            <div className={`h-3 flex-1 rounded bg-surface-2 ${denyut}`} />
            <div className={`h-3 w-20 rounded bg-surface-2 ${denyut}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
