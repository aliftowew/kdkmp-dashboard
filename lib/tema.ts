/**
 * Konstanta tema, dipisah dari komponennya.
 *
 * Komponen tombolnya berlabel "use client", dan mengimpor konstanta dari modul
 * klien ke komponen server tidak memberi nilainya — yang sampai hanya rujukan
 * klien. Akibatnya atribut tema gagal terpasang saat render server dan halaman
 * sempat berkedip dengan tema yang salah. Karena itu nilainya tinggal di sini,
 * di modul netral yang boleh dipakai kedua sisi.
 */

export type Tema = "sistem" | "terang" | "gelap";

export const COOKIE_TEMA = "tema";

export const TEMA_SAH: Tema[] = ["sistem", "terang", "gelap"];

/** Nilai atribut pada elemen root; "sistem" berarti tidak ada atribut sama sekali. */
export const ATRIBUT_TEMA: Record<Tema, string | undefined> = {
  sistem: undefined,
  terang: "light",
  gelap: "dark",
};

export function bacaTema(nilai: string | undefined): Tema {
  return nilai && (TEMA_SAH as string[]).includes(nilai) ? (nilai as Tema) : "sistem";
}
