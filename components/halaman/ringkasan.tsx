"use client";

import Link from "next/link";

import { BatangTumpuk } from "@/components/grafik.tsx";
import { RingkasanVariabel, TombolBagikan, useParameter } from "@/components/parameter.tsx";
import { Catatan, KepalaHalaman, Lencana, Panel, Rumus, Statistik, Td, Th } from "@/components/ui.tsx";
import { angka, bulat, persen, rupiahRingkas } from "@/lib/format.ts";
import { type IdSkenario, SKENARIO, hitung, skenarioAktif } from "@/lib/model.ts";

export function HalamanRingkasan() {
  const { p, h, alamat } = useParameter();
  const aktif = skenarioAktif(p);
  const turunGini = h.ketimpangan.giniLama - h.ketimpangan.giniBaru;
  const qs = alamat ? `?${alamat}` : "";

  return (
    <>
      <KepalaHalaman
        kicker="Ikhtisar"
        judul="Dampak KDKMP dalam satu layar"
        keterangan={
          <>
            Berapa persen Koperasi Desa/Kelurahan Merah Putih bisa menyumbang ke PDB, menutup poverty gap, dan
            menurunkan ketimpangan? Angka dasarnya diatur di menu Variabel.
          </>
        }
        aksi={
          <TombolBagikan />
        }
      />

      <RingkasanVariabel
        butir={[
          { label: "Pangsa", nilai: `${angka(p.pangsa, 0)}%` },
          { label: "Diskon", nilai: `${angka(p.diskon, 1)}%` },
          { label: "Margin", nilai: `${angka(p.margin, 1)}%` },
          { label: "KDKMP", nilai: bulat(p.jumlahKdkmp) },
          { label: "k", nilai: angka(h.k, 3) },
        ]}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Statistik
          ikon="trending_up"
          nilai={rupiahRingkas(h.nasional.dYTotal)}
          label="Tambahan PDB nasional / tahun"
          catatan={`${bulat(p.jumlahKdkmp)} KDKMP + substitusi impor`}
        />
        <Statistik
          ikon="percent"
          nilai={persen(h.nasional.persenPdb)}
          label="Terhadap PDB 2025"
          catatan={`PDB ADHB Rp ${angka(p.pdbTriliun, 1)} T`}
          nada="baik"
        />
        <Statistik
          ikon="groups"
          nilai={`${angka(h.kemiskinan.cakupanGap, 1)}×`}
          label="Daya beli baru vs poverty gap"
          catatan={`${rupiahRingkas(h.kemiskinan.dayaBeliNasional)} vs ${rupiahRingkas(h.kemiskinan.povertyGap)}`}
          nada={h.kemiskinan.cakupanGap >= 1 ? "baik" : "awas"}
        />
        <Statistik
          ikon="scale"
          nilai={angka(h.ketimpangan.giniBaru, 3)}
          label="Rasio Gini sesudah KDKMP"
          catatan={`dari ${angka(p.gini, 2)} · turun ${angka(turunGini, 3)}`}
          nada={turunGini > 0 ? "baik" : "netral"}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Panel judul="Dari mana tambahan PDB nasional berasal" kanan={<span className="tnum text-xs text-muted">k = {angka(h.k, 3)}</span>}>
          <div className="p-5">
            <BatangTumpuk
              judulAria="Komposisi tambahan PDB nasional"
              segmen={[
                { label: "Penghematan harga", nilai: h.bantul.dY.hemat * h.skala, warna: "var(--seri-1)" },
                { label: "Nilai tertahan di desa", nilai: h.bantul.dY.tertahan * h.skala, warna: "var(--seri-2)" },
                { label: "Upah pekerja KDKMP", nilai: h.bantul.dY.kerja * h.skala, warna: "var(--seri-3)" },
                { label: "Substitusi impor", nilai: h.nasional.dYImpor, warna: "var(--seri-4)" },
              ]}
            />
            <p className="mt-4 text-xs text-muted">
              Tiga jalur pertama dihitung di Bantul lalu dikalikan {angka(h.skala, 1)} (jumlah KDKMP nasional ÷ desa
              Bantul). Semua jalur sudah dikalikan angka pengganda k.
            </p>
          </div>
        </Panel>

        <Panel
          judul="Sampel: Kabupaten Bantul"
          kanan={
            <Link href={`/bantul${qs}`} className="flex items-center gap-1 text-sm font-medium text-accent-ink hover:underline">
              Rincian <span aria-hidden="true">→</span>
            </Link>
          }
        >
          <dl className="grid grid-cols-2 gap-px bg-line">
            {[
              ["Omzet KDKMP", rupiahRingkas(h.bantul.omzet)],
              ["Tambahan PDRB", rupiahRingkas(h.bantul.dYTotal)],
              ["Terhadap PDRB", persen(h.bantul.persenPdrb)],
              ["Lapangan kerja", `${bulat(h.bantul.pekerja)} orang`],
            ].map(([l, n]) => (
              <div key={l} className="bg-surface px-5 py-4">
                <dt className="font-mono text-[0.62rem] tracking-[0.1em] text-muted uppercase">{l}</dt>
                <dd className="tnum mt-1 text-xl font-bold tracking-[-0.02em]">{n}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel judul="Dari mana angka-angka di atas">
          <div className="grid gap-px bg-line md:grid-cols-2">
            {[
              {
                judul: "Tambahan PDB nasional",
                hasil: rupiahRingkas(h.nasional.dYTotal),
                rumus: "ΔY = (ΔY hemat + ΔY tertahan + ΔY kerja)_Bantul × skala + substitusi impor × k",
                isi: `= ${rupiahRingkas(h.bantul.dYTotal)} × ${angka(h.skala, 1)} + ${rupiahRingkas(h.nasional.substitusi)} × ${angka(h.k, 3)}`,
                href: "/nasional",
              },
              {
                judul: "Terhadap PDB 2025",
                hasil: persen(h.nasional.persenPdb),
                rumus: "% PDB = ΔY nasional ÷ PDB ADHB 2025",
                isi: `= ${rupiahRingkas(h.nasional.dYTotal)} ÷ Rp ${angka(p.pdbTriliun, 1)} T`,
                href: "/nasional",
              },
              {
                judul: "Daya beli baru vs poverty gap",
                hasil: `${angka(h.kemiskinan.cakupanGap, 1)}×`,
                rumus: "(SHU anggota + diskon) × skala ÷ (N miskin × P1/P0 × GK × 12)",
                isi: `= ${rupiahRingkas(h.kemiskinan.dayaBeliNasional)} ÷ ${rupiahRingkas(h.kemiskinan.povertyGap)}`,
                href: "/kemiskinan",
              },
              {
                judul: "Rasio Gini sesudah KDKMP",
                hasil: angka(h.ketimpangan.giniBaru, 3),
                rumus: "G = (1 − 2A) × koreksi, A = luas di bawah kurva Lorenz sesudah manfaat dibagi",
                isi: `= ${angka(h.ketimpangan.giniBaru / h.ketimpangan.koreksi, 4)} × ${angka(h.ketimpangan.koreksi, 3)}`,
                href: "/ketimpangan",
              },
            ].map((r) => (
              <div key={r.judul} className="flex flex-col gap-2 bg-surface px-5 py-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-sm font-semibold text-ink">{r.judul}</h3>
                  <span className="tnum text-lg font-extrabold tracking-[-0.02em]">{r.hasil}</span>
                </div>
                <Rumus>
                  {r.rumus}
                  <br />
                  {r.isi}
                </Rumus>
                <Link href={`${r.href}${qs}`} className="self-start text-xs font-medium text-accent-ink hover:underline">
                  Lihat langkah lengkap →
                </Link>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel judul="Perbandingan tiga skenario" kanan={<span className="text-xs text-muted">Variabel lain mengikuti menu Variabel</span>}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Skenario</Th>
                <Th kanan>Tambahan PDRB Bantul</Th>
                <Th kanan>% PDRB</Th>
                <Th kanan>Tambahan PDB</Th>
                <Th kanan>% PDB</Th>
                <Th kanan>Daya beli baru</Th>
                <Th kanan>Gini</Th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(SKENARIO) as IdSkenario[]).map((id) => {
                const s = SKENARIO[id];
                const r = hitung({ ...p, pangsa: s.pangsa, diskon: s.diskon, margin: s.margin });
                return (
                  <tr key={id} className={aktif === id ? "bg-accent-soft/60" : "hover:bg-surface-2"}>
                    <Td className="min-w-[15rem]">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-ink">{s.label}</span>
                        {aktif === id && <Lencana ikon="check_circle">Dipakai</Lencana>}
                      </span>
                      <span className="text-xs text-muted">{s.keterangan}</span>
                    </Td>
                    <Td kanan>{rupiahRingkas(r.bantul.dYTotal)}</Td>
                    <Td kanan>{persen(r.bantul.persenPdrb)}</Td>
                    <Td kanan>{rupiahRingkas(r.nasional.dYTotal)}</Td>
                    <Td kanan className="font-semibold text-ink">
                      {persen(r.nasional.persenPdb)}
                    </Td>
                    <Td kanan>{rupiahRingkas(r.kemiskinan.dayaBeliNasional)}</Td>
                    <Td kanan>{angka(r.ketimpangan.giniBaru, 3)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </div>

      <div className="mt-6">
        <Catatan ikon="info">
          Ini simulasi potensi dengan asumsi bahwa seluruh {bulat(p.jumlahKdkmp)} KDKMP berkinerja seperti rata-rata
          Bantul, dan bahwa penghematan serta SHU dibelanjakan kembali di dalam negeri. Hasilnya batas atas yang masuk
          akal, bukan ramalan. Lihat{" "}
          <Link href={`/asumsi${qs}`} className="font-medium text-accent-ink hover:underline">
            metode & sumber data
          </Link>
          .
        </Catatan>
      </div>
    </>
  );
}
