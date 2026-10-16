"use client";

import { BatangDatar } from "@/components/grafik.tsx";
import { IsianAngka, PemilihSkenario, TombolBagikan, useParameter } from "@/components/parameter.tsx";
import { Catatan, Kartu, KepalaHalaman, Panel, Rumus, Statistik, Td, Th } from "@/components/ui.tsx";
import { angka, bulat, persen, rupiahRingkas } from "@/lib/format.ts";
import { AWAL } from "@/lib/model.ts";

const NEGARA = [
  { negara: "Finlandia", pdb: "11% – 14%", anggota: "~90% (dewasa)", sektor: "Ritel (konsumen) & perbankan" },
  { negara: "Selandia Baru", pdb: "3% – 20%", anggota: "~40%", sektor: "Pertanian & peternakan (susu)" },
  { negara: "Prancis", pdb: "10% – 18%", anggota: "~40%", sektor: "Perbankan & pertanian" },
  { negara: "Amerika Serikat", pdb: "3% – 5%", anggota: "~33%", sektor: "Utilitas (listrik), pertanian & credit union" },
  { negara: "Belanda", pdb: "18%", anggota: "~17% – 25%", sektor: "Pertanian (hortikultura) & perbankan" },
  { negara: "Indonesia", pdb: "~1% – 5%", anggota: "~8% – 9%", sektor: "Simpan pinjam (KSP)" },
];

export function HalamanNasional() {
  const { p, h, ubah } = useParameter();
  const n = h.nasional;

  return (
    <>
      <KepalaHalaman
        kicker="Dampak ekonomi"
        judul="PDB Nasional"
        keterangan="Hasil Bantul diskalakan ke seluruh KDKMP, lalu ditambah potensi substitusi impor pangan lewat petani lokal."
        aksi={<TombolBagikan />}
      />

      <Kartu className="mt-8 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[0.95rem] font-bold tracking-[-0.01em]">Skenario & skala</h2>
          <PemilihSkenario />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <IsianAngka
            label="Jumlah KDKMP nasional"
            nilai={p.jumlahKdkmp}
            bawaan={AWAL.jumlahKdkmp}
            ubah={(v) => ubah({ jumlahKdkmp: v })}
            langkah={1}
            sumber="75.753 desa + 8.486 kelurahan + 37 UPT/SPT"
          />
          <IsianAngka
            label="PDB ADHB 2025"
            nilai={p.pdbTriliun}
            bawaan={AWAL.pdbTriliun}
            ubah={(v) => ubah({ pdbTriliun: v })}
            satuan="triliun"
            sumber="BRS BPS No. 18/02/Th. XXIX"
          />
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[0.62rem] tracking-[0.1em] text-muted uppercase">Faktor skala</p>
            <p className="tnum rounded-xl bg-surface-2 px-3 py-2 text-sm font-semibold">
              × {angka(h.skala, 2)}
            </p>
            <p className="text-xs text-muted">
              {bulat(p.jumlahKdkmp)} KDKMP ÷ {bulat(p.desa)} desa Bantul
            </p>
          </div>
        </div>
      </Kartu>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Statistik ikon="trending_up" nilai={rupiahRingkas(n.dYTotal)} label="Tambahan PDB / tahun" catatan="jaringan desa + substitusi impor" />
        <Statistik ikon="percent" nilai={persen(n.persenPdb)} label="Terhadap PDB 2025" nada="baik" catatan={`Rp ${angka(p.pdbTriliun, 1)} T`} />
        <Statistik ikon="hub" nilai={rupiahRingkas(n.dYDesa)} label="Dari jaringan KDKMP" nada="netral" catatan={`ΔY Bantul ${rupiahRingkas(h.bantul.dYTotal)} × ${angka(h.skala, 1)}`} />
        <Statistik ikon="agriculture" nilai={rupiahRingkas(n.dYImpor)} label="Dari substitusi impor" nada="netral" catatan={`${rupiahRingkas(n.substitusi)} × k ${angka(h.k, 3)}`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Panel judul="⑦ Substitusi impor komoditas" kanan={<span className="text-xs text-muted">Ubah % yang digantikan petani lokal</span>}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Komoditas</Th>
                <Th kanan>Nilai impor / tahun</Th>
                <Th kanan>% digantikan</Th>
                <Th kanan>Nilai</Th>
              </tr>
            </thead>
            <tbody>
              {n.impor.map((km) => (
                <tr key={km.id} className="hover:bg-surface-2">
                  <Td>
                    <p className="font-semibold text-ink">{km.nama}</p>
                    <p className="text-xs text-muted">{km.kegunaan}</p>
                  </Td>
                  <Td kanan className="whitespace-nowrap">
                    Rp {angka(km.minT, 1)}–{angka(km.maxT, 1)} T
                  </Td>
                  <Td kanan>
                    <span className="inline-flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={5}
                        value={km.persen}
                        aria-label={`Persen impor ${km.nama} yang digantikan`}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (Number.isFinite(v)) ubah({ substitusi: { ...p.substitusi, [km.id]: Math.min(100, Math.max(0, v)) } });
                        }}
                        className={`tnum w-16 rounded-lg border bg-surface px-2 py-1 text-right text-sm focus-visible:border-accent ${
                          km.persen !== AWAL.substitusi[km.id] ? "border-accent font-semibold" : "border-line"
                        }`}
                      />
                      <span className="text-xs text-muted">%</span>
                    </span>
                  </Td>
                  <Td kanan className={km.nilai ? "font-semibold text-ink" : "text-muted"}>
                    {rupiahRingkas(km.nilai, 2)}
                  </Td>
                </tr>
              ))}
              <tr className="bg-surface-2">
                <Td className="font-bold text-ink">Total substitusi</Td>
                <Td kanan>{""}</Td>
                <Td kanan className="text-xs text-muted">
                  × k {angka(h.k, 3)}
                </Td>
                <Td kanan className="font-bold whitespace-nowrap text-ink">
                  {rupiahRingkas(n.substitusi)}
                  <span className="block text-xs font-medium text-muted">ΔY {rupiahRingkas(n.dYImpor)}</span>
                </Td>
              </tr>
            </tbody>
          </table>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel judul="Nilai yang digantikan per komoditas">
            <div className="p-5">
              <BatangDatar
                baris={[...n.impor].sort((a, b) => b.nilai - a.nilai).map((km) => ({ label: km.nama, nilai: km.nilai }))}
                format={(v) => rupiahRingkas(v, 1)}
              />
              <p className="mt-4 text-xs text-muted">Nilai impor memakai titik tengah rentang sumber.</p>
            </div>
          </Panel>
          <Catatan ikon="info">
            <p>
              Logikanya: impor tinggi karena H<sub>impor</sub> &lt; H<sub>lokal</sub> akibat rantai pasok yang panjang.
              Rantai petani → KDKMP → konsumen memangkas margin sehingga H<sub>lokal</sub> bisa bersaing, dan impor (M)
              turun di Y = C + I + G + (X − M).
            </p>
          </Catatan>
        </div>
      </div>

      <div className="mt-6 grid gap-6 2xl:grid-cols-2">
        <Panel judul="Cara hitung">
          <div className="flex flex-col gap-3 p-5 text-sm text-ink-2">
            <Rumus>ΔY nasional = ΔY Bantul × (KDKMP nasional ÷ desa Bantul) + Substitusi × k</Rumus>
            <Rumus>
              = {rupiahRingkas(h.bantul.dYTotal)} × {angka(h.skala, 2)} + {rupiahRingkas(n.substitusi)} × {angka(h.k, 3)}
            </Rumus>
            <Rumus>
              = {rupiahRingkas(n.dYTotal)} → {persen(n.persenPdb)} dari PDB
            </Rumus>
          </div>
        </Panel>
        <Panel judul="Kontribusi koperasi di negara lain">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Negara</Th>
                <Th kanan>Kontribusi PDB</Th>
                <Th kanan>Warga anggota</Th>
                <Th>Sektor dominan</Th>
              </tr>
            </thead>
            <tbody>
              {NEGARA.map((r) => (
                <tr key={r.negara} className={r.negara === "Indonesia" ? "bg-warn-soft/50" : "hover:bg-surface-2"}>
                  <Td className="font-semibold whitespace-nowrap text-ink">{r.negara}</Td>
                  <Td kanan className="whitespace-nowrap">{r.pdb}</Td>
                  <Td kanan className="whitespace-nowrap">{r.anggota}</Td>
                  <Td className="min-w-[14rem] text-ink-2">{r.sektor}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </>
  );
}
