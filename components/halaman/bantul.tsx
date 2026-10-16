"use client";

import { BatangTumpuk } from "@/components/grafik.tsx";
import { IsianAngka, PemilihSkenario, Penggeser, TombolBagikan, useParameter } from "@/components/parameter.tsx";
import { Catatan, Kartu, KepalaHalaman, Panel, Rumus, Statistik, Td, Th } from "@/components/ui.tsx";
import { angka, bulat, persen, rupiah, rupiahRingkas } from "@/lib/format.ts";
import { AWAL, hitung } from "@/lib/model.ts";

const PANGSA = [30, 50, 75, 100];
const MARGIN = [7, 10, 12];

export function HalamanBantul() {
  const { p, h, ubah } = useParameter();
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
        keterangan={`Bantul dipakai sebagai sampel: ${bulat(p.penduduk)} jiwa, ${bulat(p.desa)} desa, PDRB Rp ${bulat(p.pdrbMiliar)} miliar (ADHB 2024).`}
        aksi={<TombolBagikan />}
      />

      <Kartu className="mt-8 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[0.95rem] font-bold tracking-[-0.01em]">Asumsi skenario</h2>
          <PemilihSkenario />
        </div>
        <div className="mt-5 grid gap-x-8 gap-y-5 md:grid-cols-2 xl:grid-cols-4">
          <Penggeser label="Pangsa belanja via KDKMP" nilai={p.pangsa} ubah={(n) => ubah({ pangsa: n })} min={0} max={100} langkah={5} />
          <Penggeser label="Diskon harga" nilai={p.diskon} ubah={(n) => ubah({ diskon: n })} min={0} max={15} langkah={0.5} />
          <Penggeser
            label="Margin KDKMP"
            nilai={p.margin}
            ubah={(n) => ubah({ margin: n })}
            min={0}
            max={15}
            langkah={0.5}
            keterangan="TORA SERA: 7–12%"
          />
          <Penggeser
            label="Margin yang tetap di desa"
            nilai={p.bagiDesa}
            ubah={(n) => ubah({ bagiDesa: n })}
            min={0}
            max={100}
            keterangan="82% anggota + 15% desa"
          />
        </div>
        <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <IsianAngka label="Pekerja per KDKMP" nilai={p.kerjaPerKdkmp} bawaan={AWAL.kerjaPerKdkmp} ubah={(n) => ubah({ kerjaPerKdkmp: n })} langkah={1} satuan="orang" />
          <IsianAngka label="Upah per bulan" nilai={p.upah} bawaan={AWAL.upah} ubah={(n) => ubah({ upah: n })} langkah={50000} satuan="Rp" />
          <IsianAngka label="Jumlah desa (KDKMP)" nilai={p.desa} bawaan={AWAL.desa} ubah={(n) => ubah({ desa: n })} langkah={1} sumber="bantulkab.go.id" />
          <IsianAngka label="PDRB Bantul" nilai={p.pdrbMiliar} bawaan={AWAL.pdrbMiliar} ubah={(n) => ubah({ pdrbMiliar: n })} satuan="miliar" sumber="BPS Bantul, ADHB 2024" />
        </div>
      </Kartu>

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

        <Panel judul="Kepekaan: % PDRB menurut pangsa × margin" kanan={<span className="text-xs text-muted">diskon {angka(p.diskon, 1)}%</span>}>
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
  const { p, h, ubah } = useParameter();
  const r = h.rantai;
  return (
    <div className="mt-6">
      <Panel judul="④ Rantai pembelian beras: petani → KDKMP → konsumen">
        <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="flex flex-col gap-5">
            <IsianAngka
              label="Margin pemasaran total"
              nilai={p.marginRantai}
              bawaan={AWAL.marginRantai}
              ubah={(n) => ubah({ marginRantai: n })}
              langkah={100}
              satuan="Rp/kg"
              sumber="Penelitian di Kab. Semarang (Kabarbursa)"
            />
            <Penggeser label="Berpindah ke petani" nilai={p.bagiPetani} ubah={(n) => ubah({ bagiPetani: n })} min={0} max={100 - p.bagiKonsumen} />
            <Penggeser label="Jadi harga lebih murah" nilai={p.bagiKonsumen} ubah={(n) => ubah({ bagiKonsumen: n })} min={0} max={100 - p.bagiPetani} />
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
