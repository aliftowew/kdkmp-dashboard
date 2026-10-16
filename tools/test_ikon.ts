/** Setiap nama="…" / ikon="…" di app/ dan components/ harus ada di peta ikon. */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { IKON } from "../lib/ikon.ts";
import { MENU } from "../lib/menu.ts";

const berkas = (d: string): string[] =>
  readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? berkas(join(d, f)) : f.endsWith(".tsx") ? [join(d, f)] : []));

const hilang = new Set<string>();
for (const f of [...berkas("app"), ...berkas("components")]) {
  for (const m of readFileSync(f, "utf8").matchAll(/(?:nama|ikon)="([a-z_]+)"/g)) if (!IKON[m[1]]) hilang.add(`${m[1]} (${f})`);
  for (const m of readFileSync(f, "utf8").matchAll(/ikon: "([a-z_]+)"/g)) if (!IKON[m[1]]) hilang.add(`${m[1]} (${f})`);
}
for (const m of MENU) if (!IKON[m.ikon]) hilang.add(`${m.ikon} (menu)`);
if (hilang.size) {
  console.error("ikon tidak ada di lib/ikon.ts:", [...hilang]);
  process.exit(1);
}
console.log("test_ikon: lolos");
