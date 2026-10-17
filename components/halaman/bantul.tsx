"use client";

import { BatangTumpuk } from "@/components/grafik.tsx";
import { RingkasanVariabel, TombolBagikan, useParameter } from "@/components/parameter.tsx";
import { Catatan, KepalaHalaman, Panel, Rumus, Statistik, Td, Th } from "@/components/ui.tsx";
import { angka, bulat, persen, rupiah, rupiahRingkas } from "@/lib/format.ts";
import { hitung } from "@/lib/model.ts";

const PANGSA = [30, 50, 75, 100];
const MARGIN = [7, 10, 12];

export function HalamanBantul() {
  const { p, h } = useParameter();
  const b = h.bantul;
  const k = h.k;

  const jalur = [
    {
      no: "①",
      nama: "Penghematan harga",
      rumus: "S = Pop × E_food × s × d × 12",
      isi: `${bulat(p.penduduk)} × ${bulat(p.eFood)} × ${angka(p.pangsa / 100, 2)} × ${angka(p.diskon / 100, 3)} × 12`,
      langsung: b.hemat,
      dY: b.dY.hemat,
      makna: "Uang sisa belanja warga yang bisa dibelanjakan lagi — tanpa gaji naik, subsidi tunai, atau APBN keluar.",
    },
    {
      no: "②",
      nama: "Nilai tertahan di desa",
      rumus: "Retained = Omzet × margin × bagian desa",
      isi: `${rupiahRingkas(b.omzet)} × ${angka(p.margin, 1)}% × ${angka(p.bagiDesa, 0)}%`,
      langsung: b.tertahan,
      dY: b.dY.tertahan,
      makna: "Margin yang biasanya bocor ke luar daerah kini jadi SHU anggota dan dana usaha desa.",
    },
    {
      no: "③",
      nama: "Lapangan kerja",
      rumus: "Gaji = pekerja/KDKMP × desa × upah × 12",
      isi: `${bulat(p.kerjaPerKdkmp)} × ${bulat(p.desa)} × ${rupiahRingkas(p.upah)} × 12`,
      langsung: b.gaji,
      dY: b.dY.kerja,
      makna: `${bulat(b.pekerja)} orang bekerja di KDKMP, upahnya dibelanjakan di sekitar desa.`,
    },
  ];

  return (
    <>
      <KepalaHalaman
        kicker="Dampak ekonomi"
        judul="PDRB Kabupaten Bantul"
        keterangan={`Bantul dihitung rinci sebagai sampel: ${bulat(p.penduduk)} jiwa, ${bulat(p.desa)} desa, PDRB Rp ${bulat(p.pdrbMiliar)} miliar (ADHB 2024).`}
        aksi={<TombolBagikan />}
      />

      <RingkasanVariabel
        butir={[
          { label: "Pangsa", nilai: `${angka(p.pangsa, 0)}%` },
          { label: "Diskon", nilai: `${angka(p.diskon, 1)}%` },
          { label: "Margin", nilai: `${angka(p.margin, 1)}%` },
          { label: "Tetap di desa", nilai: `${angka(p.bagiDesa, 0)}%` },
          { label: "Pekerja/KDKMP", nilai: bulat(p.kerjaPerKdkmp) },
          { label: "Upah", nilai: rupiahRingkas(p.upah) },
        ]}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Statistik ikon="trending_up" nilai={rupiahRingkas(b.dYTotal)} label="Tambahan PDRB / tahun" catatan="ΔY hemat + tertahan + kerja" />
        <Statistik ikon="percent" nilai={persen(b.persenPdrb)} label="Terhadap PDRB Bantul" nada="baik" catatan={`dari Rp ${bulat(p.pdrbMiliar)} M`} />
        <Statistik ikon="storefront" nilai={rupiahRingkas(b.omzet)} label="Omzet KDKMP / tahun" catatan="Pop × E_food × s × 12" nada="netral" />
        <Statistik ikon="work" nilai={bulat(b.pekerja)} label="Lapangan kerja baru" catatan={`${p.kerjaPerKdkmp} orang × ${p.desa} desa`} nada="netral" />
      </div>

      <div className="mt-6">
        <Panel judul="Tiga jalur dampak" kanan={<span className="tnum text-xs text-muted">pengganda k = {angka(k, 3)}</span>}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Jalur</Th>
                <Th kanan>Nilai langsung</Th>
                <Th kanan>× k = ΔY</Th>
                <Th kanan>% PDRB</Th>
              </tr>
            </thead>
            <tbody>
              {jalur.map((j) => (
                <tr key={j.nama} className="align-top hover:bg-surface-2">
                  <Td className="min-w-[18rem]">
                    <p className="font-semibold text-ink">
                      {j.no} {j.nama}
                    </p>
                    <p className="mt-0.5 max-w-[60ch] text-xs text-ink-2">{j.makna}</p>
                    <p className="mt-1.5 font-mono text-[0.72rem] text-muted">
                      {j.rumus}
                      <br />= {j.isi}
                    </p>
                  </Td>
                  <Td kanan>{rupiahRingkas(j.langsung)}</Td>
                  <Td kanan className="font-semibold text-ink">
                    {rupiahRingkas(j.dY)}
                  </Td>
                  <Td kanan>{persen(j.dY / b.pdrb)}</Td>
                </tr>
              ))}
              <tr className="bg-surface-2">
                <Td className="font-bold text-ink">Total ΔY Bantul</Td>
                <Td kanan>{rupiahRingkas(b.hemat + b.tertahan + b.gaji)}</Td>
                <Td kanan className="font-bold text-ink">
                  {rupiahRingkas(b.dYTotal)}
                </Td>
                <Td kanan className="font-bold text-ok">
                  {persen(b.persenPdrb)}
                </Td>
              </tr>
            </tbody>
          </table>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel judul="Komposisi ΔY Bantul">
          <div className="p-5">
            <BatangTumpuk
              judulAria="Komposisi tambahan PDRB Bantul"
              segmen={[
                { label: "Penghematan harga", nilai: b.dY.hemat, warna: "var(--seri-1)" },
                { label: "Nilai tertahan", nilai: b.dY.tertahan, warna: "var(--seri-2)" },
                { label: "Lapangan kerja", nilai: b.dY.kerja, warna: "var(--seri-3)" },
              ]}
            />
          </div>
        </Panel>

        <Panel judul="Kepekaan: % PDRB menurut pangsa × margin" kanan={<span className="text-xs text-muted">diskon {angka(p.diskon, 1)}% · sel biru = variabel Anda</span>}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Pangsa s</Th>
                {MARGIN.map((m) => (
                  <Th key={m} kanan>
                    Margin {m}%
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PANGSA.map((s) => (
                <tr key={s}>
                  <Td className="tnum font-semibold text-ink">{s}%</Td>
                  {MARGIN.map((m) => {
                    const r = hitung({ ...p, pangsa: s, margin: m });
                    const ini = p.pangsa === s && p.margin === m;
                    return (
                      <Td key={m} kanan className={ini ? "bg-accent font-bold text-on-accent" : ""}>
                        {persen(r.bantul.persenPdrb)}
                      </Td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <RantaiPasok />
    </>
  );
}

function RantaiPasok() {
  const { p, h } = useParameter();
  const r = h.rantai;
  return (
    <div className="mt-6">
      <Panel judul="④ Rantai pembelian beras: petani → KDKMP → konsumen">
        <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="flex flex-col gap-3 text-sm text-ink-2">
            <p>
              Rantai beras saat ini: petani → tengkulak → penggilingan → pedagang besar → pengecer. Total margin pemasaran
              bisa mencapai <strong className="tnum text-ink">{rupiah(p.marginRantai)}/kg</strong>.
            </p>
            <p>
              Bila rantainya dipangkas menjadi <strong className="text-ink">petani → KDKMP → konsumen</strong>, margin itu
              dibagi ulang: {p.bagiPetani}% ke petani, {p.bagiKonsumen}% jadi harga lebih murah, dan sisanya{" "}
              {100 - p.bagiPetani - p.bagiKonsumen}% menanggung biaya operasional KDKMP.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { l: "Harga petani naik", n: `+${rupiah(r.naikPetani)}`, c: "text-ok" },
                { l: "Harga konsumen turun", n: `−${rupiah(r.turunKonsumen)}`, c: "text-ok" },
                { l: "Biaya operasional KDKMP", n: rupiah(r.sisaBiaya), c: "text-ink" },
              ].map((x) => (
                <div key={x.l} className="rounded-2xl border border-line px-4 py-3">
                  <p className="font-mono text-[0.62rem] tracking-[0.1em] text-muted uppercase">{x.l}</p>
                  <p className={`tnum mt-1 text-xl font-bold ${x.c}`}>{x.n}</p>
                  <p className="text-xs text-muted">per kg</p>
                </div>
              ))}
            </div>
            <Rumus>
              Rp {bulat(p.marginRantai)} = ΔP petani ({p.bagiPetani}%) + ΔP konsumen ({p.bagiKonsumen}%) + ΔC biaya (
              {100 - p.bagiPetani - p.bagiKonsumen}%)
            </Rumus>
            <Catatan ikon="info" nada="awas">
              Apakah ini menambah PDRB? <strong className="text-ink">Tergantung.</strong> Bila tengkulak yang tergantikan
              berasal dari luar Bantul, PDRB naik; bila orang Bantul sendiri, PDRB tetap — yang berubah adalah daya beli
              keluarga petani, naik {persen(p.bagiPetani / 100, 0)} dari margin per kg. Karena itu jalur ini tidak
              dijumlahkan ke ΔY di atas.
            </Catatan>
          </div>
        </div>
      </Panel>
    </div>
  );
}
