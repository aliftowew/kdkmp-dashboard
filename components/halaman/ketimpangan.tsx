"use client";

import { KurvaLorenz } from "@/components/grafik.tsx";
import { RingkasanVariabel, TombolBagikan, useParameter } from "@/components/parameter.tsx";
import { KepalaHalaman, Panel, Rumus, Statistik, Td, Th } from "@/components/ui.tsx";
import { angka, persen, rupiahRingkas } from "@/lib/format.ts";

export function HalamanKetimpangan() {
  const { p, h } = useParameter();
  const g = h.ketimpangan;
  const turun = g.giniLama - g.giniBaru;

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

      <RingkasanVariabel
        butir={[
          { label: "Gini resmi", nilai: angka(p.gini, 3) },
          { label: "Bagian 40/40/20", nilai: `${angka(p.bawah40, 2)} / ${angka(p.tengah40, 2)} / ${angka(p.atas20, 2)}%` },
          { label: "Manfaat diserap", nilai: `${angka(p.serapBawah, 0)} / ${angka(p.serapTengah, 0)} / ${angka(g.serapAtas, 0)}%` },
        ]}
      />

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
