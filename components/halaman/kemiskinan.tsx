"use client";

import { MeteranCakupan } from "@/components/grafik.tsx";
import { IsianAngka, PemilihSkenario, Penggeser, TombolBagikan, useParameter } from "@/components/parameter.tsx";
import { Catatan, Kartu, KepalaHalaman, Lencana, Panel, Rumus, Statistik, Td, Th } from "@/components/ui.tsx";
import { angka, bulat, persen, rupiah, rupiahRingkas } from "@/lib/format.ts";
import { AWAL, type IdSkenario, SKENARIO, hitung, skenarioAktif } from "@/lib/model.ts";

const BANDING = [
  { ind: "Porsi uang ke petani", biasa: "30% – 40%", kop: "80%", negara: "India (Amul)" },
  { ind: "Rasio gaji (bos : buruh)", biasa: "1 : 100+", kop: "1 : 3 s/d 1 : 9", negara: "Spanyol (Mondragon)" },
  { ind: "Respons krisis", biasa: "PHK massal", kop: "Potong gaji bersama", negara: "Spanyol / Italia" },
  { ind: "Akses modal warga desa", biasa: "Ditolak bank (unbankable)", kop: "Diterima koperasi", negara: "Kenya" },
];

export function HalamanKemiskinan() {
  const { p, h, ubah } = useParameter();
  const m = h.kemiskinan;
  const aktif = skenarioAktif(p);
  const cukup = m.cakupanGap >= 1;

  return (
    <>
      <KepalaHalaman
        kicker="Dampak sosial"
        judul="Potensi menurunkan kemiskinan"
        keterangan="Berapa uang yang dibutuhkan agar seluruh penduduk miskin melewati garis kemiskinan — dan apakah tambahan daya beli dari KDKMP cukup menutupnya?"
        aksi={<TombolBagikan />}
      />

      <Kartu className="mt-8 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[0.95rem] font-bold tracking-[-0.01em]">Asumsi</h2>
          <PemilihSkenario />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <IsianAngka label="P0 · % penduduk miskin" nilai={p.p0} bawaan={AWAL.p0} ubah={(v) => ubah({ p0: v })} satuan="%" sumber="BPS, Sep 2025" />
          <IsianAngka label="P1 · indeks kedalaman" nilai={p.p1} bawaan={AWAL.p1} ubah={(v) => ubah({ p1: v })} sumber="BPS, Sep 2025" />
          <IsianAngka label="Garis kemiskinan" nilai={p.gk} bawaan={AWAL.gk} ubah={(v) => ubah({ gk: v })} langkah={1} satuan="Rp/bln" sumber="BPS, Sep 2025" />
          <IsianAngka label="Penduduk miskin" nilai={p.miskinJuta} bawaan={AWAL.miskinJuta} ubah={(v) => ubah({ miskinJuta: v })} satuan="juta" sumber="BPS, Sep 2025" />
          <Penggeser label="Margin jadi SHU anggota" nilai={p.bagiAnggota} ubah={(v) => ubah({ bagiAnggota: v })} min={0} max={100} />
        </div>
      </Kartu>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Statistik ikon="groups" nilai={rupiahRingkas(m.povertyGap)} label="Poverty gap nasional / tahun" nada="awas" catatan="uang untuk mengangkat semua ke GK" />
        <Statistik ikon="payments" nilai={rupiah(m.gapBulan)} label="Kekurangan per orang / bulan" nada="netral" catatan={`${rupiah(m.gapTahun)} per tahun`} />
        <Statistik ikon="savings" nilai={rupiahRingkas(m.dayaBeliNasional)} label="Tambahan daya beli nasional" catatan="ΔC = SHU anggota + diskon" />
        <Statistik
          ikon={cukup ? "check_circle" : "warning"}
          nilai={`${angka(m.cakupanGap, 1)}×`}
          label="Kelipatan poverty gap"
          nada={cukup ? "baik" : "awas"}
          catatan={cukup ? "nilainya cukup menutup poverty gap" : "belum cukup menutup poverty gap"}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel judul="Langkah hitung poverty gap">
          <ol className="flex flex-col gap-4 p-5 text-sm text-ink-2">
            <li>
              <p className="font-semibold text-ink">1. Seberapa jauh orang miskin dari garis kemiskinan</p>
              <Rumus>
                P1 ÷ P0 = {angka(p.p1, 3)} ÷ {angka(p.p0, 2)} = {angka(m.rasioKedalaman, 3)}
              </Rumus>
              <p className="mt-1 text-xs">Rata-rata orang miskin berada {persen(m.rasioKedalaman, 1)} di bawah GK.</p>
            </li>
            <li>
              <p className="font-semibold text-ink">2. Gap pengeluaran per orang</p>
              <Rumus>
                {angka(m.rasioKedalaman, 3)} × {rupiah(p.gk)} = {rupiah(m.gapBulan)}/bulan → × 12 = {rupiah(m.gapTahun)}/tahun
              </Rumus>
            </li>
            <li>
              <p className="font-semibold text-ink">3. Dikalikan jumlah penduduk miskin</p>
              <Rumus>
                {angka(p.miskinJuta, 2)} juta × {rupiah(m.gapTahun)} = {rupiahRingkas(m.povertyGap)}/tahun
              </Rumus>
            </li>
          </ol>
        </Panel>

        <Panel judul="Daya beli baru vs poverty gap">
          <div className="flex flex-col gap-5 p-5">
            <MeteranCakupan
              nilai={m.dayaBeliNasional}
              sasaran={m.povertyGap}
              labelNilai="Daya beli baru"
              labelSasaran="Poverty gap"
            />
            <Rumus>
              ΔC Bantul = SHU {rupiahRingkas(h.bantul.shuAnggota)} + diskon {rupiahRingkas(h.bantul.hemat)} ={" "}
              {rupiahRingkas(m.dayaBeliBantul)} → × {angka(h.skala, 1)} = {rupiahRingkas(m.dayaBeliNasional)}
            </Rumus>
            <Catatan ikon="warning" nada="awas">
              &quot;Cukup menutup&quot; berarti <strong className="text-ink">nilainya</strong> sebesar itu — bukan
              bahwa seluruhnya otomatis sampai ke penduduk miskin. Kemiskinan 0% realistis hanya bila manfaat KDKMP
              memang tersalur ke keluarga di bawah garis kemiskinan.
            </Catatan>
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel judul="Tambahan daya beli per skenario">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Skenario</Th>
                <Th kanan>SHU anggota (Bantul)</Th>
                <Th kanan>Diskon (Bantul)</Th>
                <Th kanan>ΔC Bantul</Th>
                <Th kanan>ΔC nasional</Th>
                <Th kanan>vs poverty gap</Th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(SKENARIO) as IdSkenario[]).map((id) => {
                const s = SKENARIO[id];
                const r = hitung({ ...p, pangsa: s.pangsa, diskon: s.diskon, margin: s.margin });
                return (
                  <tr key={id} className={aktif === id ? "bg-accent-soft/60" : "hover:bg-surface-2"}>
                    <Td className="min-w-[15rem]">
                      <span className="font-semibold text-ink">{s.label}</span>
                      <span className="block text-xs text-muted">{s.keterangan}</span>
                    </Td>
                    <Td kanan>{rupiahRingkas(r.bantul.shuAnggota)}</Td>
                    <Td kanan>{rupiahRingkas(r.bantul.hemat)}</Td>
                    <Td kanan>{rupiahRingkas(r.kemiskinan.dayaBeliBantul)}</Td>
                    <Td kanan className="font-semibold text-ink">
                      {rupiahRingkas(r.kemiskinan.dayaBeliNasional)}
                    </Td>
                    <Td kanan>
                      <Lencana nada={r.kemiskinan.cakupanGap >= 1 ? "baik" : "awas"} ikon={r.kemiskinan.cakupanGap >= 1 ? "check_circle" : "warning"}>
                        {angka(r.kemiskinan.cakupanGap, 1)}×
                      </Lencana>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel judul="Kenapa koperasi, bukan perusahaan biasa">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th>Indikator</Th>
                <Th>Perusahaan biasa</Th>
                <Th>Koperasi (contoh sukses)</Th>
                <Th>Negara</Th>
              </tr>
            </thead>
            <tbody>
              {BANDING.map((b) => (
                <tr key={b.ind} className="hover:bg-surface-2">
                  <Td className="font-semibold text-ink">{b.ind}</Td>
                  <Td>{b.biasa}</Td>
                  <Td className="font-semibold text-ok">{b.kop}</Td>
                  <Td className="text-ink-2">{b.negara}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
      <p className="mt-3 text-xs text-muted">Jumlah penduduk miskin Sep 2025: {bulat(p.miskinJuta * 1e6)} jiwa.</p>
    </>
  );
}
