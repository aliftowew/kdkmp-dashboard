import Link from "next/link";

import { Ikon } from "@/components/ui.tsx";

export const metadata = { title: "Halaman tidak ditemukan" };

const TUJUAN = [
  { href: "/", label: "Ringkasan", ikon: "dashboard" },
  { href: "/bantul", label: "PDRB Bantul", ikon: "where_to_vote" },
  { href: "/nasional", label: "PDB Nasional", ikon: "public" },
];

export default function TidakAda() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface px-6 py-14 text-center shadow-kartu">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-surface-2 text-2xl text-muted">
        <Ikon nama="warning" />
      </span>
      <h1 className="text-lg font-bold tracking-[-0.01em]">Halaman ini tidak ada</h1>
      <p className="max-w-[48ch] text-sm text-ink-2">
        Kemungkinan alamatnya salah salin. Pilih salah satu halaman di bawah untuk melanjutkan.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {TUJUAN.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-ink-2 hover:bg-surface-2"
          >
            <Ikon nama={t.ikon} className="text-[1.1rem]" />
            {t.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
