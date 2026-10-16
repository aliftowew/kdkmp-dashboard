"use client";

import Link from "next/link";
import { Fragment } from "react";

import { useParameter } from "@/components/parameter.tsx";
import { Catatan, KepalaHalaman, Lencana, Panel, Rumus, Td, Th } from "@/components/ui.tsx";
import { angka } from "@/lib/format.ts";
import { AWAL } from "@/lib/model.ts";
import { KELOMPOK_VARIABEL } from "@/lib/variabel.ts";

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

const ALUR = [
  { no: "①", judul: "Penghematan harga", rumus: "S = Pop × E_food × s × d × 12", hasil: "ΔY_hemat = S × k" },
  { no: "②", judul: "Nilai tertahan di desa", rumus: "Retained = Pop × E_food × s × 12 × margin × bagian desa", hasil: "ΔY_tertahan = Retained × k" },
  { no: "③", judul: "Lapangan kerja", rumus: "Gaji = pekerja/KDKMP × desa × upah × 12", hasil: "ΔY_kerja = Gaji × k" },
  { no: "⑥", judul: "Skala nasional", rumus: "skala = KDKMP nasional ÷ desa Bantul", hasil: "ΔY_desa = ΔY_Bantul × skala" },
  { no: "⑦", judul: "Substitusi impor", rumus: "Σ (nilai impor × % digantikan)", hasil: "ΔY_impor = Σ × k" },
  { no: "K", judul: "Poverty gap", rumus: "N miskin × (P1 ÷ P0) × GK × 12", hasil: "vs ΔC = (SHU anggota + diskon) × skala" },
  { no: "G", judul: "Rasio Gini", rumus: "G′ = 1 − 2A (trapesium Lorenz 3 kelompok)", hasil: "G = G′_baru × (Gini resmi ÷ G′_lama)" },
];

export function HalamanAsumsi() {
  const { p, h, alamat } = useParameter();
  const qs = alamat ? `?${alamat}` : "";

  return (
    <>
      <KepalaHalaman
        kicker="Rujukan"
        judul="Metode & sumber"
        keterangan="Bagaimana setiap angka dihitung, dan dari mana data dasarnya berasal."
        aksi={
          <Link
            href={`/variabel${qs}`}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent shadow-kartu hover:opacity-90"
          >
            Ubah variabel
          </Link>
        }
      />

      <div className="mt-8">
        <Panel judul="Alur hitung">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Langkah</Th>
                <Th>Rumus</Th>
                <Th>Hasil</Th>
              </tr>
            </thead>
            <tbody>
              {ALUR.map((a) => (
                <tr key={a.judul} className="align-top hover:bg-surface-2">
                  <Td className="font-semibold whitespace-nowrap text-ink">
                    {a.no} {a.judul}
                  </Td>
                  <Td className="min-w-[16rem] font-mono text-[0.78rem]">{a.rumus}</Td>
                  <Td className="min-w-[14rem] font-mono text-[0.78rem]">{a.hasil}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel judul="Angka pengganda (multiplier effect)" kanan={<span className="tnum text-sm font-bold text-accent-ink">k = {angka(h.k, 4)}</span>}>
          <div className="flex flex-col gap-3 p-5 text-sm text-ink-2">
            <p className="max-w-[76ch]">
              Uang hemat dan SHU tidak berhenti di satu dompet. Ia dibelanjakan ke pedagang sayur, ojek, dan penjahit,
              lalu mereka membelanjakannya lagi ke petani, SPBU, dan pabrik — berputar beberapa kali sebelum bocor ke
              pajak dan impor.
            </p>
            <Rumus>Y = C + I + G + (X − M) = c(1 − t)Y + I + G + X − mY</Rumus>
            <Rumus>k = 1 ÷ (1 − c(1 − t) + m)</Rumus>
            <Rumus>
              = 1 ÷ (1 − {angka(p.mpc, 3)} × (1 − {angka(p.pajak, 3)}) + {angka(p.impor, 4)}) = {angka(h.k, 4)}
            </Rumus>
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel judul="Data dasar dan sumbernya">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Variabel</Th>
                <Th kanan>Dipakai</Th>
                <Th>Sumber</Th>
              </tr>
            </thead>
            <tbody>
              {KELOMPOK_VARIABEL.map((k) => (
                <Fragment key={k.id}>
                  <tr>
                    <td colSpan={3} className="border-t border-line bg-surface-2 px-5 py-2 text-[0.68rem] font-bold tracking-[0.06em] text-muted uppercase">
                      {k.judul}
                    </td>
                  </tr>
                  {k.butir.map((v) => {
                    const berubah = p[v.kunci] !== AWAL[v.kunci];
                    return (
                      <tr key={v.kunci} className="hover:bg-surface-2">
                        <Td className="text-ink">
                          {v.label}
                          {v.simbol && <span className="ml-1.5 font-mono text-xs text-muted">{v.simbol}</span>}
                        </Td>
                        <Td kanan className="whitespace-nowrap">
                          <span className="inline-flex items-center gap-2">
                            {berubah && <Lencana>diubah</Lencana>}
                            <span className={berubah ? "font-semibold text-ink" : ""}>
                              {p[v.kunci].toLocaleString("id-ID")} {v.satuan}
                            </span>
                          </span>
                        </Td>
                        <Td className="min-w-[14rem] text-ink-2">{v.sumber}</Td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
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
