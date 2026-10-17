/**
 * Menu dikelompokkan menurut pertanyaan yang ingin dijawab pembaca
 * ("berapa dampak ekonominya?", "apa dampak sosialnya?"), bukan menurut
 * urutan bab di catatan analisis.
 */
export type ButirMenu = { href: string; label: string; ikon: string; grup: Grup };
export type Grup = "Ikhtisar" | "Dampak ekonomi" | "Dampak sosial" | "Pengaturan & rujukan";

export const GRUP: Grup[] = ["Ikhtisar", "Dampak ekonomi", "Dampak sosial", "Pengaturan & rujukan"];

export const MENU: ButirMenu[] = [
  { href: "/", label: "Ringkasan", ikon: "dashboard", grup: "Ikhtisar" },
  { href: "/bantul", label: "PDRB Bantul", ikon: "where_to_vote", grup: "Dampak ekonomi" },
  { href: "/nasional", label: "PDB Nasional", ikon: "public", grup: "Dampak ekonomi" },
  { href: "/kemiskinan", label: "Kemiskinan", ikon: "groups", grup: "Dampak sosial" },
  { href: "/ketimpangan", label: "Rasio Gini", ikon: "scale", grup: "Dampak sosial" },
  { href: "/variabel", label: "Variabel", ikon: "tune", grup: "Pengaturan & rujukan" },
  { href: "/asumsi", label: "Metode & sumber", ikon: "book", grup: "Pengaturan & rujukan" },
];

/** Bukan startsWith(href) saja — "/" akan menyala di semua halaman. */
export function menuAktif(path: string, href: string): boolean {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(href + "/");
}
