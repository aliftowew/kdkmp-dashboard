"use client";

import { KurvaLorenz } from "@/components/grafik.tsx";
import { IsianAngka, PemilihSkenario, Penggeser, TombolBagikan, useParameter } from "@/components/parameter.tsx";
import { Catatan, Kartu, KepalaHalaman, Panel, Rumus, Statistik, Td, Th } from "@/components/ui.tsx";
import { angka, persen, rupiahRingkas } from "@/lib/format.ts";
import { AWAL } from "@/lib/model.ts";

export function HalamanKetimpangan() {
  const { p, h, ubah } = useParameter();
  const g = h.ketimpangan;
  const turun = g.giniLama - g.giniBaru;
  const jumlahBagian = p.bawah40 + p.tengah40 + p.atas20;

  const kelompok = [
    { nama: "40% terbawah", serap: p.serapBawah, lama: g.lama.bawah, baru: g.baru.bawah, bLama: g.bagianLama.bawah, bBaru: g.bagianBaru.bawah },
    { nama: "40% tengah", serap: p.serapTengah, lama: g.lama.tengah, baru: g.baru.tengah, bLama: g.bagianLama.tengah, bBaru: g.bagianBaru.tengah },
    { nama: "20% teratas", serap: g.serapAtas, lama: g.lama.atas, baru: g.baru.atas, bLama: g.bagianLama.atas, bBaru: g.bagianBaru.atas },
  ];

  return (
    <>
      <KepalaHalaman
        kicker="Dampak sosial"
        judul="Rasio Gini"
        keterangan="Bila sebagian besar manfaat KDKMP diserap kelompok berpengeluaran rendah, bagian konsumsi mereka naik dan ketimpangan turun."
        aksi={<TombolBagikan />}
      />

      <Kartu className="mt-8 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[0.95rem] font-bold tracking-[-0.01em]">Siapa yang menyerap manfaat</h2>
          <PemilihSkenario />
        </div>
        <div className="mt-5 grid gap-x-8 gap-y-5 md:grid-cols-3">
          <Penggeser
            label="Diserap 40% terbawah"
            nilai={p.serapBawah}
            ubah={(v) => ubah({ serapBawah: v })}
            min={0}
            max={100 - p.serapTengah}
          />
          <Penggeser
            label="Diserap 40% tengah"
            nilai={p.serapTengah}
            ubah={(v) => ubah({ serapTengah: v })}
            min={0}
            max={100 - p.serapBawah}
          />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-ink">Diserap 20% teratas</p>
            <p className="tnum rounded-xl bg-surface-2 px-3 py-2 text-sm font-semibold">{angka(g.serapAtas, 0)}%</p>
            <p className="text-xs text-muted">Sisa otomatis: 100% − dua penggeser di kiri</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2 xl:grid-cols-4">
          <IsianAngka label="Gini resmi" nilai={p.gini} bawaan={AWAL.gini} ubah={(v) => ubah({ gini: v })} langkah={0.001} sumber="BPS, 2025" />
          <IsianAngka label="Bagian 40% terbawah" nilai={p.bawah40} bawaan={AWAL.bawah40} ubah={(v) => ubah({ bawah40: v })} satuan="%" sumber="BPS, kota+desa 2025" />
          <IsianAngka label="Bagian 40% tengah" nilai={p.tengah40} bawaan={AWAL.tengah40} ubah={(v) => ubah({ tengah40: v })} satuan="%" sumber="BPS, kota+desa 2025" />
          <IsianAngka label="Bagian 20% teratas" nilai={p.atas20} bawaan={AWAL.atas20} ubah={(v) => ubah({ atas20: v })} satuan="%" sumber="BPS, kota+desa 2025" />
        </div>
        {Math.abs(jumlahBagian - 100) > 0.05 && (
          <div className="mt-4">
            <Catatan nada="awas" ikon="warning">
              Ketiga bagian berjumlah {angka(jumlahBagian, 2)}%, bukan 100%. Hitungan tetap jalan dengan menormalkan
              ketiganya, tapi periksa lagi angkanya.
            </Catatan>
          </div>
        )}
      </Kartu>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Statistik ikon="scale" nilai={angka(g.giniLama, 3)} label="Gini sekarang" nada="netral" catatan="BPS 2025" />
        <Statistik ikon="trending_down" nilai={angka(g.giniBaru, 3)} label="Gini sesudah KDKMP" nada={turun > 0 ? "baik" : "netral"} catatan={`turun ${angka(turun, 3)} poin`} />
        <Statistik ikon="savings" nilai={rupiahRingkas(h.kemiskinan.dayaBeliNasional)} label="Manfaat yang dibagi" catatan="ΔC nasional (C KDKMP)" />
        <Statistik ikon="pie_chart" nilai={persen(g.bagianBaru.bawah, 1)} label="Bagian konsumsi 40% terbawah" catatan={`dari ${persen(g.bagianLama.bawah, 1)}`} nada="netral" />
      </div>

      <div className="mt-6 grid gap-6 2xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Panel judul="Kurva Lorenz">
          <div className="p-5">
            <KurvaLorenz
              sebelum={{ bawah: g.bagianLama.bawah, tengah: g.bagianLama.tengah }}
              sesudah={{ bawah: g.bagianBaru.bawah, tengah: g.bagianBaru.tengah }}
            />
          </div>
        </Panel>

        <Panel judul="Konsumsi per kelompok" kanan={<span className="tnum text-xs text-muted">C = {rupiahRingkas(g.konsumsi)}</span>}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Kelompok</Th>
                <Th kanan>Konsumsi kini</Th>
                <Th kanan>+ manfaat</Th>
                <Th kanan>Konsumsi baru</Th>
                <Th kanan>Bagian</Th>
              </tr>
            </thead>
            <tbody>
              {kelompok.map((k) => (
                <tr key={k.nama} className="hover:bg-surface-2">
                  <Td className="font-semibold whitespace-nowrap text-ink">{k.nama}</Td>
                  <Td kanan>{rupiahRingkas(k.lama)}</Td>
                  <Td kanan className="whitespace-nowrap">
                    {rupiahRingkas(k.baru - k.lama)}
                    <span className="block text-xs text-muted">{angka(k.serap, 0)}%</span>
                  </Td>
                  <Td kanan className="font-semibold text-ink">
                    {rupiahRingkas(k.baru)}
                  </Td>
                  <Td kanan className="whitespace-nowrap">
                    {persen(k.bLama, 2)} → <strong className="text-ink">{persen(k.bBaru, 2)}</strong>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel judul="Metode">
          <div className="grid gap-5 p-5 text-sm text-ink-2 lg:grid-cols-3">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-ink">1. Konsumsi rumah tangga</p>
              <Rumus>
                C = {angka(p.porsiKonsumsi, 2)}% × PDB = {rupiahRingkas(g.konsumsi)}
              </Rumus>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-ink">2. Gini dari luas di bawah kurva Lorenz</p>
              <Rumus>A = Σ (yᵢ + yᵢ₋₁)/2 × (xᵢ − xᵢ₋₁) · G′ = 1 − 2A</Rumus>
              <p className="text-xs">
                Gini pendekatan 2025: G′ = {angka(g.giniPendekatan, 4)}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-ink">3. Koreksi ke Gini resmi</p>
              <Rumus>
                koreksi = {angka(p.gini, 3)} ÷ {angka(g.giniPendekatan, 4)} = {angka(g.koreksi, 3)}
              </Rumus>
              <p className="text-xs">
                Tiga titik membuat kurva jadi garis patah sehingga ketimpangan diremehkan; G′ sesudah KDKMP dikalikan
                faktor ini.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
