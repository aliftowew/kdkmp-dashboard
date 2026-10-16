const RUPIAH = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const ANGKA = new Intl.NumberFormat("id-ID");

/**
 * Nilai yang tidak bisa ditampilkan sebagai angka. Intl dengan patuh memformat
 * NaN dan Infinity, jadi tanpa penjagaan ini layar menampilkan "RpNaN" — tanda
 * "—" setidaknya jujur bahwa angkanya tidak ada.
 */
const takBerangka = (n: number | null | undefined): n is null | undefined =>
  n === null || n === undefined || !Number.isFinite(n);

export function rupiah(n: number | null | undefined): string {
  if (takBerangka(n)) return "—";
  return RUPIAH.format(n);
}

export function angka(n: number | null | undefined, digit = 0): string {
  if (takBerangka(n)) return "—";
  return new Intl.NumberFormat("id-ID", { minimumFractionDigits: digit, maximumFractionDigits: digit }).format(n);
}

export function bulat(n: number | null | undefined): string {
  if (takBerangka(n)) return "—";
  return ANGKA.format(Math.round(n));
}

/** Pecahan → persen: 0,0145 → "1,45%". */
export function persen(pecahan: number | null | undefined, digit = 2): string {
  if (takBerangka(pecahan)) return "—";
  return `${angka(pecahan * 100, digit)}%`;
}

/**
 * Rupiah ringkas gaya Indonesia: T = triliun, M = miliar, jt = juta.
 * "M" sengaja miliar, bukan million — ini yang dibaca orang di berita.
 */
export function rupiahRingkas(n: number | null | undefined, digit = 1): string {
  if (takBerangka(n)) return "—";
  const a = Math.abs(n);
  if (a >= 1e12) return `Rp ${angka(n / 1e12, a >= 1e15 ? 0 : digit + (a < 1e13 ? 1 : 0))} T`;
  if (a >= 1e9) return `Rp ${angka(n / 1e9, digit)} M`;
  if (a >= 1e6) return `Rp ${angka(n / 1e6, digit)} jt`;
  return rupiah(n);
}
