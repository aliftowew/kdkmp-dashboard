import { persen, rupiahRingkas } from "@/lib/format.ts";

/**
 * Grafik digambar tangan sebagai HTML/SVG dengan warna token, bukan pustaka
 * grafik: tidak ada yang dimuat dari luar, dan tema terang/gelap ikut sendiri.
 *
 * Identitas tidak pernah hanya lewat warna — setiap seri berlabel teks di
 * legenda, dan setiap batang punya angka yang tercetak di sebelahnya.
 */

export type Segmen = { label: string; nilai: number; warna: string };

/** Batang tumpuk mendatar — komposisi satu total. Celah 2px antarsegmen. */
export function BatangTumpuk({ segmen, judulAria }: { segmen: Segmen[]; judulAria: string }) {
  const total = segmen.reduce((a, b) => a + Math.max(0, b.nilai), 0);
  return (
    <figure className="flex flex-col gap-3">
      <div role="img" aria-label={judulAria} className="flex h-9 w-full gap-[2px] overflow-hidden rounded-lg bg-surface-2">
        {total > 0 &&
          segmen.map((s) => (
            <div
              key={s.label}
              title={`${s.label}: ${rupiahRingkas(s.nilai)} (${persen(s.nilai / total, 1)})`}
              className="h-full transition-[width] duration-200 first:rounded-l-lg last:rounded-r-lg motion-reduce:transition-none"
              style={{ width: `${(Math.max(0, s.nilai) / total) * 100}%`, background: s.warna }}
            />
          ))}
      </div>
      <figcaption className={`grid gap-x-6 gap-y-2 sm:grid-cols-2 ${segmen.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {segmen.map((s) => (
          <div key={s.label} className="flex items-start gap-2">
            <span className="mt-1 h-3 w-3 shrink-0 rounded-sm" style={{ background: s.warna }} aria-hidden="true" />
            <span className="flex flex-col">
              <span className="text-xs text-ink-2">{s.label}</span>
              <span className="tnum text-sm font-bold text-ink">
                {rupiahRingkas(s.nilai)}{" "}
                <span className="font-medium text-muted">· {total > 0 ? persen(s.nilai / total, 0) : "—"}</span>
              </span>
            </span>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}

/** Batang mendatar satu seri — membandingkan besaran antarbaris. */
export function BatangDatar({
  baris,
  format = (n) => rupiahRingkas(n),
}: {
  baris: { label: string; nilai: number; catatan?: string }[];
  format?: (n: number) => string;
}) {
  const maks = Math.max(...baris.map((b) => b.nilai), 0);
  return (
    <ul className="flex flex-col gap-2.5">
      {baris.map((b) => (
        <li key={b.label} className="grid grid-cols-[minmax(7rem,11rem)_1fr_auto] items-center gap-3 text-sm">
          <span className="truncate text-ink-2" title={b.label}>
            {b.label}
          </span>
          <span className="h-3 overflow-hidden rounded-r bg-surface-2">
            <span
              className="block h-full rounded-r bg-seri-1 transition-[width] duration-200 motion-reduce:transition-none"
              style={{ width: maks > 0 ? `${(b.nilai / maks) * 100}%` : "0%" }}
            />
          </span>
          <span className={`tnum w-20 text-right font-semibold ${b.nilai ? "text-ink" : "text-muted"}`}>
            {format(b.nilai)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Meteran cakupan: seberapa jauh nilai menutup sebuah sasaran. Melewati 100%
 * tetap digambar penuh, dan kelebihannya dituliskan sebagai teks "× sasaran".
 */
export function MeteranCakupan({ nilai, sasaran, labelNilai, labelSasaran }: { nilai: number; sasaran: number; labelNilai: string; labelSasaran: string }) {
  const rasio = sasaran > 0 ? nilai / sasaran : 0;
  const lebar = Math.min(1, rasio) * 100;
  return (
    <figure className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={`${labelNilai} ${rupiahRingkas(nilai)} dibanding ${labelSasaran} ${rupiahRingkas(sasaran)}`}
        className="relative h-4 overflow-hidden rounded-full bg-surface-2"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-200 motion-reduce:transition-none ${rasio >= 1 ? "bg-ok" : "bg-accent"}`}
          style={{ width: `${lebar}%` }}
        />
      </div>
      <figcaption className="tnum flex flex-wrap justify-between gap-2 text-xs text-muted">
        <span>
          {labelNilai}: <strong className="text-ink">{rupiahRingkas(nilai)}</strong>
        </span>
        <span>
          {labelSasaran}: <strong className="text-ink">{rupiahRingkas(sasaran)}</strong>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Kurva Lorenz tiga kelompok. Garis 45° adalah pemerataan sempurna; makin
 * jauh kurva dari garis itu, makin timpang. Dua kurva — sebelum (putus-putus,
 * netral) dan sesudah KDKMP (seri-1) — supaya pergeseran terlihat.
 */
export function KurvaLorenz({
  sebelum,
  sesudah,
}: {
  sebelum: { bawah: number; tengah: number };
  sesudah: { bawah: number; tengah: number };
}) {
  const L = 40;
  const U = 300;
  const x = (v: number) => L + v * (U - L - 10);
  const y = (v: number) => U - 30 - v * (U - 50);
  const titik = (s: { bawah: number; tengah: number }) =>
    [
      [0, 0],
      [0.4, s.bawah],
      [0.8, s.bawah + s.tengah],
      [1, 1],
    ] as const;
  const jalur = (s: { bawah: number; tengah: number }) => titik(s).map(([a, b]) => `${x(a)},${y(b)}`).join(" ");

  return (
    <figure className="flex flex-col gap-3">
      <svg viewBox={`0 0 ${U} ${U}`} className="mx-auto w-full max-w-[22rem]" role="img" aria-label="Kurva Lorenz sebelum dan sesudah KDKMP">
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => (
          <g key={v}>
            <line x1={x(0)} x2={x(1)} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth={1} />
            <text x={L - 6} y={y(v) + 3} textAnchor="end" fontSize={9} fill="var(--muted)">
              {Math.round(v * 100)}%
            </text>
          </g>
        ))}
        {[0, 0.4, 0.8, 1].map((v) => (
          <text key={v} x={x(v)} y={U - 14} textAnchor="middle" fontSize={9} fill="var(--muted)">
            {Math.round(v * 100)}%
          </text>
        ))}
        <line x1={x(0)} y1={y(0)} x2={x(1)} y2={y(1)} stroke="var(--line-strong)" strokeWidth={1.5} />
        <polyline points={jalur(sebelum)} fill="none" stroke="var(--muted)" strokeWidth={2} strokeDasharray="5 4" />
        <polyline points={jalur(sesudah)} fill="none" stroke="var(--seri-1)" strokeWidth={2} />
        {titik(sesudah).slice(1, 3).map(([a, b]) => (
          <circle key={a} cx={x(a)} cy={y(b)} r={4} fill="var(--seri-1)" stroke="var(--surface)" strokeWidth={2}>
            <title>{`${Math.round(a * 100)}% penduduk termiskin: ${persen(b, 1)} konsumsi`}</title>
          </circle>
        ))}
        <text x={x(0.55)} y={y(0.62)} fontSize={9} fill="var(--muted)" transform={`rotate(-41 ${x(0.55)} ${y(0.62)})`}>
          pemerataan sempurna
        </text>
      </svg>
      <figcaption className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-ink-2">
        <span className="flex items-center gap-1.5">
          <svg width="22" height="6" aria-hidden="true">
            <line x1="0" y1="3" x2="22" y2="3" stroke="var(--muted)" strokeWidth="2" strokeDasharray="5 4" />
          </svg>
          Sebelum KDKMP
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="22" height="6" aria-hidden="true">
            <line x1="0" y1="3" x2="22" y2="3" stroke="var(--seri-1)" strokeWidth="2" />
          </svg>
          Sesudah KDKMP
        </span>
        <span className="text-muted">Sumbu datar: persentil penduduk · tegak: kumulatif konsumsi</span>
      </figcaption>
    </figure>
  );
}
