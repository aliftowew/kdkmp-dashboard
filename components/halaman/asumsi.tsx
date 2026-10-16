"use client";

import { IsianAngka, TombolBagikan, TombolKembalikan, useParameter } from "@/components/parameter.tsx";
import { Catatan, Kartu, KepalaHalaman, Panel, Rumus, Td, Th } from "@/components/ui.tsx";
import { angka } from "@/lib/format.ts";
import { AWAL, type Parameter } from "@/lib/model.ts";

type Butir = { kunci: Exclude<keyof Parameter, "substitusi">; label: string; satuan?: string; sumber: string; langkah?: number };

const KELOMPOK: { judul: string; butir: Butir[] }[] = [
  {
    judul: "Kabupaten Bantul (sampel)",
    butir: [
      { kunci: "penduduk", label: "Jumlah penduduk", satuan: "jiwa", langkah: 1, sumber: "Dukcapil per 31 Des 2024" },
      { kunci: "eFood", label: "Pengeluaran makanan / kapita / bulan", satuan: "Rp", langkah: 1, sumber: "BPS DIY (Susenas) 2024" },
      { kunci: "pdrbMiliar", label: "PDRB ADHB", satuan: "miliar", sumber: "BPS Kab. Bantul 2024" },
      { kunci: "desa", label: "Jumlah desa", langkah: 1, sumber: "bantulkab.go.id" },
      { kunci: "kerjaPerKdkmp", label: "Pekerja per KDKMP", satuan: "orang", langkah: 1, sumber: "Asumsi analisis" },
      { kunci: "upah", label: "Upah per bulan", satuan: "Rp", langkah: 50000, sumber: "Asumsi analisis" },
    ],
  },
  {
    judul: "Struktur margin (TORA SERA)",
    butir: [
      { kunci: "bagiDesa", label: "Margin tetap di desa", satuan: "%", sumber: "82% anggota + 15% KDKMP/desa" },
      { kunci: "bagiAnggota", label: "Margin jadi SHU anggota", satuan: "%", sumber: "Danantara / Agrinas" },
    ],
  },
  {
    judul: "Nasional",
    butir: [
      { kunci: "jumlahKdkmp", label: "Jumlah KDKMP", langkah: 1, sumber: "Wilayah setingkat desa" },
      { kunci: "pdbTriliun", label: "PDB ADHB 2025", satuan: "triliun", sumber: "BRS BPS 5 Feb 2026" },
      { kunci: "porsiKonsumsi", label: "Porsi konsumsi RT thd PDB", satuan: "%", sumber: "BPS 2025" },
    ],
  },
  {
    judul: "Kemiskinan & ketimpangan",
    butir: [
      { kunci: "p0", label: "P0 · % penduduk miskin", satuan: "%", sumber: "BPS Sep 2025" },
      { kunci: "p1", label: "P1 · indeks kedalaman", sumber: "BPS Sep 2025" },
      { kunci: "gk", label: "Garis kemiskinan", satuan: "Rp/bln", langkah: 1, sumber: "BPS Sep 2025" },
      { kunci: "miskinJuta", label: "Penduduk miskin", satuan: "juta", sumber: "BPS Sep 2025" },
      { kunci: "gini", label: "Rasio Gini", langkah: 0.001, sumber: "BPS 2025" },
    ],
  },
];

const KOREKSI = [
  {
    hal: "Impor (m) di angka pengganda",
    catatan: "0,209",
    dipakai: "0,2039",
    alasan: "Sumber menulis 20,39%. Dengan 0,2039, k = 1,934 — persis angka yang dipakai di seluruh catatan.",
  },
  {
    hal: "Faktor koreksi Gini",
    catatan: "≈ 1,19",
    dipakai: "0,37 ÷ 0,3242 ≈ 1,14",
    alasan: "Hasil akhir catatan (0,3593 dan 0,2859) justru cocok dengan 1,14, jadi 1,19 adalah salah tulis.",
  },
  {
    hal: "ΔY nasional minimum",
    catatan: "Rp 791 T",
    dipakai: "± Rp 742 T",
    alasan: "592,36 T + 148,69 T = 741,05 T. Faktor skala juga dihitung langsung: 83.762 ÷ 75 = 1.116,8 (bukan 1.123,68).",
  },
];

export function HalamanAsumsi() {
  const { p, h, ubah } = useParameter();

  return (
    <>
      <KepalaHalaman
        kicker="Rujukan"
        judul="Asumsi & sumber data"
        keterangan="Semua angka dasar bisa diganti. Isian yang berbeda dari bawaan diberi tepi biru dan tautan untuk mengembalikannya."
        aksi={
          <div className="flex flex-wrap gap-2">
            <TombolKembalikan />
            <TombolBagikan />
          </div>
        }
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        {KELOMPOK.map((k) => (
          <Kartu key={k.judul} className="p-5">
            <h2 className="text-[0.95rem] font-bold tracking-[-0.01em]">{k.judul}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {k.butir.map((b) => (
                <IsianAngka
                  key={b.kunci}
                  label={b.label}
                  nilai={p[b.kunci]}
                  bawaan={AWAL[b.kunci]}
                  ubah={(v) => ubah({ [b.kunci]: v } as Partial<Parameter>)}
                  satuan={b.satuan}
                  sumber={b.sumber}
                  langkah={b.langkah}
                />
              ))}
            </div>
          </Kartu>
        ))}
      </div>

      <div className="mt-6">
        <Panel judul="Angka pengganda (multiplier effect)" kanan={<span className="tnum text-sm font-bold text-accent-ink">k = {angka(h.k, 4)}</span>}>
          <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="flex flex-col gap-3 text-sm text-ink-2">
              <p>
                Uang hemat dan SHU tidak berhenti di satu dompet. Dibelanjakan ke pedagang sayur, ojek, dan penjahit,
                lalu mereka membelanjakannya lagi ke petani, SPBU, dan pabrik — berputar beberapa kali sebelum habis
                bocor ke pajak dan impor.
              </p>
              <Rumus>Y = C + I + G + (X − M) = c(1 − t)Y + I + G + X − mY</Rumus>
              <Rumus>k = 1 ÷ (1 − c(1 − t) + m)</Rumus>
              <Rumus>
                = 1 ÷ (1 − {angka(p.mpc, 3)} × (1 − {angka(p.pajak, 3)}) + {angka(p.impor, 4)}) = {angka(h.k, 4)}
              </Rumus>
            </div>
            <div className="grid gap-4">
              <IsianAngka label="c · kecenderungan konsumsi" nilai={p.mpc} bawaan={AWAL.mpc} ubah={(v) => ubah({ mpc: v })} langkah={0.001} sumber="UKM JEM, tabel I-O 2008" />
              <IsianAngka label="t · rasio pajak thd PDB" nilai={p.pajak} bawaan={AWAL.pajak} ubah={(v) => ubah({ pajak: v })} langkah={0.001} sumber="CEIC, Des 2024 (11,8%)" />
              <IsianAngka label="m · impor thd PDB" nilai={p.impor} bawaan={AWAL.impor} ubah={(v) => ubah({ impor: v })} langkah={0.0001} sumber="Trading Economics / Bank Dunia 2024 (20,39%)" />
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel judul="Catatan pencocokan dengan analisis tulisan tangan">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Bagian</Th>
                <Th>Di catatan</Th>
                <Th>Dipakai di sini</Th>
                <Th>Alasan</Th>
              </tr>
            </thead>
            <tbody>
              {KOREKSI.map((k) => (
                <tr key={k.hal} className="align-top hover:bg-surface-2">
                  <Td className="font-semibold text-ink">{k.hal}</Td>
                  <Td className="tnum whitespace-nowrap">{k.catatan}</Td>
                  <Td className="tnum font-semibold whitespace-nowrap text-ink">{k.dipakai}</Td>
                  <Td className="min-w-[20rem] text-ink-2">{k.alasan}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <div className="mt-6">
        <Catatan ikon="info">
          Selebihnya angka di aplikasi ini cocok dengan catatan analisis: penghematan Bantul Rp 53,2 M, omzet Rp 2,66 T,
          nilai tertahan Rp 180,6 M, poverty gap Rp 36,2 T, dan Gini sesudah KDKMP 0,36 s/d 0,29. Uji otomatisnya ada di{" "}
          <code className="font-mono text-xs">tools/test_model.ts</code>.
        </Catatan>
      </div>
    </>
  );
}
