/*
 * Membangkitkan lib/ikon.ts dari geometri asli Feather Icons.
 *
 * Kuncinya bergaya nama Material supaya pemakaian di halaman terbaca sebagai
 * makna ("savings"), bukan bentuk ("database"). Jalankan: npm run ikon:bangun
 */
const feather = require("feather-icons");
const fs = require("fs");

const PETA = {
  account_balance: "shield",
  agriculture: "sun",
  arrow_forward: "arrow-right",
  book: "book-open",
  check_circle: "check-circle",
  chevron_right: "chevron-right",
  close: "x",
  copy: "copy",
  dark_mode: "moon",
  dashboard: "layout",
  description: "file-text",
  factory: "tool",
  groups: "users",
  help_outline: "help-circle",
  hub: "share-2",
  info: "info",
  insights: "bar-chart-2",
  layers: "layers",
  light_mode: "sun",
  link: "link",
  local_shipping: "truck",
  menu: "menu",
  payments: "dollar-sign",
  percent: "percent",
  pie_chart: "pie-chart",
  public: "globe",
  refresh: "rotate-ccw",
  savings: "archive",
  scale: "activity",
  storefront: "shopping-bag",
  trending_down: "trending-down",
  trending_up: "trending-up",
  tune: "sliders",
  warning: "alert-triangle",
  where_to_vote: "map-pin",
  work: "briefcase",
};

const hilang = Object.entries(PETA).filter(([, f]) => !feather.icons[f]);
if (hilang.length) {
  console.error("nama Feather tidak ada:", hilang);
  process.exit(1);
}

const baris = Object.entries(PETA)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([kunci, nama]) => {
    const isi = feather.icons[nama].contents.replace(/\s+/g, " ").trim();
    return `  ${kunci}: ${JSON.stringify(isi)},`;
  });

fs.writeFileSync(
  "lib/ikon.ts",
  `/**
 * Ikon Feather, ditanam sebagai SVG — tidak ada permintaan jaringan yang bisa
 * gagal sampai. Dibangkitkan oleh tools/buat_ikon.cjs; jangan disunting tangan.
 */
export const IKON: Record<string, string> = {
${baris.join("\n")}
};
`,
  "utf8",
);
console.log(`lib/ikon.ts: ${baris.length} ikon Feather ditanam`);
