/**
 * Model hitung dampak ekonomi KDKMP (Koperasi Desa/Kelurahan Merah Putih).
 *
 * Seluruh rumus diturunkan dari catatan analisis "Analisis potensi dampak
 * ekonomi program KDKMP": dampak penghematan harga, nilai yang tertahan di
 * desa, lapangan kerja, proyeksi nasional, substitusi impor, poverty gap, dan
 * rasio Gini. Murni, tanpa I/O — dipakai halaman dan diuji di tools/test_model.ts.
 *
 * Satuan internal selalu rupiah penuh dan pecahan (0,3 bukan 30). Persen hanya
 * dipakai di Parameter karena itulah yang diketik dan digeser orang; konversi
 * terjadi sekali di sini supaya tidak ada halaman yang lupa membagi seratus.
 */

export type IdKomoditas =
  | "beras"
  | "gandum"
  | "kedelai"
  | "gula"
  | "daging"
  | "susu"
  | "buah"
  | "bawang"
  | "jagung";

export type Komoditas = {
  id: IdKomoditas;
  nama: string;
  kegunaan: string;
  /** Nilai impor tahunan, triliun rupiah (rentang dari sumber). */
  minT: number;
  maxT: number;
};

export const KOMODITAS: Komoditas[] = [
  { id: "beras", nama: "Beras", kegunaan: "Konsumsi rumah tangga", minT: 28.5, maxT: 30.2 },
  { id: "gandum", nama: "Gandum", kegunaan: "Mi, roti, biskuit", minT: 58.7, maxT: 67.1 },
  { id: "kedelai", nama: "Kedelai", kegunaan: "Tahu, tempe", minT: 25.2, maxT: 28.5 },
  { id: "gula", nama: "Gula (konsumsi + industri)", kegunaan: "Rumah tangga & industri makanan", minT: 41.9, maxT: 50.3 },
  { id: "daging", nama: "Daging sapi & kerbau", kegunaan: "Protein hewani", minT: 11.7, maxT: 16.8 },
  { id: "susu", nama: "Susu & produk olahan", kegunaan: "Minuman & pangan olahan", minT: 23.5, maxT: 26.8 },
  { id: "buah", nama: "Buah impor tertentu", kegunaan: "Konsumsi langsung", minT: 10.1, maxT: 13.4 },
  { id: "bawang", nama: "Bawang putih", kegunaan: "Bumbu pokok", minT: 8.4, maxT: 10.1 },
  { id: "jagung", nama: "Jagung pakan", kegunaan: "Tidak langsung (ayam/telur)", minT: 5.0, maxT: 10.1 },
];

/** Persen impor yang bisa digantikan petani lokal lewat KDKMP (asumsi analisis). */
export const SUBSTITUSI_AWAL: Record<IdKomoditas, number> = {
  beras: 100,
  gandum: 0,
  kedelai: 50,
  gula: 40,
  daging: 25,
  susu: 35,
  buah: 0,
  bawang: 25,
  jagung: 15,
};

export type Parameter = {
  // — skenario (persen)
  pangsa: number; // s: pangsa belanja makanan warga yang lewat KDKMP
  diskon: number; // d: diskon harga dibanding pasar
  margin: number; // margin kotor KDKMP atas omzet (7–12% menurut TORA SERA)
  bagiDesa: number; // bagian margin yang tetap di desa: 82% anggota + 15% KDKMP/desa
  bagiAnggota: number; // bagian margin yang jadi SHU anggota

  // — Kabupaten Bantul sebagai sampel
  penduduk: number; // jiwa
  eFood: number; // pengeluaran makanan per kapita sebulan, rupiah
  pdrbMiliar: number; // PDRB ADHB, miliar rupiah
  desa: number; // jumlah desa = jumlah KDKMP
  kerjaPerKdkmp: number; // orang
  upah: number; // rupiah per bulan

  // — angka pengganda Keynesian
  mpc: number; // c, kecenderungan konsumsi marginal (pecahan)
  pajak: number; // t, rasio pajak (pecahan)
  impor: number; // m, impor terhadap PDB (pecahan)

  // — nasional
  jumlahKdkmp: number;
  pdbTriliun: number;
  porsiKonsumsi: number; // persen konsumsi rumah tangga terhadap PDB

  // — kemiskinan
  p0: number; // persen penduduk miskin
  p1: number; // indeks kedalaman kemiskinan
  gk: number; // garis kemiskinan, rupiah/kapita/bulan
  miskinJuta: number; // jumlah penduduk miskin, juta jiwa

  // — ketimpangan (persen bagian pengeluaran)
  gini: number;
  bawah40: number;
  tengah40: number;
  atas20: number;
  serapBawah: number; // persen manfaat KDKMP yang diserap 40% terbawah
  serapTengah: number; // … 40% tengah; sisanya 20% teratas

  // — rantai pasok beras
  marginRantai: number; // rupiah/kg dari petani ke konsumen
  bagiPetani: number; // persen margin yang berpindah ke petani
  bagiKonsumen: number; // persen margin yang jadi harga lebih murah

  substitusi: Record<IdKomoditas, number>;
};

export const AWAL: Parameter = {
  pangsa: 30,
  diskon: 2,
  margin: 7,
  bagiDesa: 97,
  bagiAnggota: 82,

  penduduk: 980_269,
  eFood: 753_800,
  pdrbMiliar: 36_478,
  desa: 75,
  kerjaPerKdkmp: 18,
  upah: 2_500_000,

  mpc: 0.779,
  pajak: 0.118,
  impor: 0.2039,

  jumlahKdkmp: 83_762,
  pdbTriliun: 23_821.1,
  porsiKonsumsi: 53.88,

  p0: 8.25,
  p1: 1.661,
  gk: 641_443,
  miskinJuta: 23.36,

  gini: 0.37,
  bawah40: 18.65,
  tengah40: 35.79,
  atas20: 45.56,
  serapBawah: 55,
  serapTengah: 35,

  marginRantai: 7_000,
  bagiPetani: 30,
  bagiKonsumen: 30,

  substitusi: { ...SUBSTITUSI_AWAL },
};

export type IdSkenario = "konservatif" | "moderat" | "maksimal";

/** Tiga skenario yang dipakai di catatan analisis. */
export const SKENARIO: Record<IdSkenario, { label: string; pangsa: number; diskon: number; margin: number; keterangan: string }> = {
  konservatif: { label: "Konservatif", pangsa: 30, diskon: 2, margin: 7, keterangan: "Pangsa 30%, diskon 2%, margin 7%" },
  moderat: { label: "Moderat", pangsa: 50, diskon: 12, margin: 10, keterangan: "Pangsa 50%, diskon 12%, margin 10%" },
  maksimal: { label: "Maksimal", pangsa: 100, diskon: 12, margin: 12, keterangan: "Pangsa 100%, diskon 12%, margin 12%" },
};

export function skenarioAktif(p: Parameter): IdSkenario | null {
  for (const [id, s] of Object.entries(SKENARIO) as [IdSkenario, (typeof SKENARIO)[IdSkenario]][]) {
    if (p.pangsa === s.pangsa && p.diskon === s.diskon && p.margin === s.margin) return id;
  }
  return null;
}

/* ---------------------------------------------------------------- rumus */

/** k = 1 / (1 − c(1 − t) + m) */
export function pengganda(mpc: number, pajak: number, impor: number): number {
  return 1 / (1 - mpc * (1 - pajak) + impor);
}

/**
 * Gini dari tiga kelompok pengeluaran lewat luas trapesium di bawah kurva
 * Lorenz: titik (0,0) → (0,4; b) → (0,8; b+t) → (1,1); G = 1 − 2A.
 *
 * Tiga titik saja meremehkan ketimpangan (kurvanya jadi garis patah, bukan
 * lengkung), karena itu hasilnya dikoreksi dengan rasio Gini resmi / Gini
 * pendekatan di hitungKetimpangan — persis cara catatan analisisnya.
 */
export function giniTigaKelompok(bawah: number, tengah: number, atas: number): number {
  const total = bawah + tengah + atas;
  const y1 = bawah / total;
  const y2 = (bawah + tengah) / total;
  const luas = ((0 + y1) / 2) * 0.4 + ((y1 + y2) / 2) * 0.4 + ((y2 + 1) / 2) * 0.2;
  return 1 - 2 * luas;
}

export type Hasil = ReturnType<typeof hitung>;

export function hitung(p: Parameter) {
  const s = p.pangsa / 100;
  const d = p.diskon / 100;
  const mg = p.margin / 100;
  const k = pengganda(p.mpc, p.pajak, p.impor);
  const pdrb = p.pdrbMiliar * 1e9;
  const pdb = p.pdbTriliun * 1e12;
  const skala = p.desa > 0 ? p.jumlahKdkmp / p.desa : 0;

  // ① Penghematan harga: S = Pop × E_food × s × d × 12
  const belanjaMakan = p.penduduk * p.eFood * 12;
  const omzet = belanjaMakan * s;
  const hemat = omzet * d;

  // ② Nilai yang biasanya bocor ke luar desa kini tertahan: Omzet × margin × bagian desa
  const tertahan = omzet * mg * (p.bagiDesa / 100);
  const shuAnggota = omzet * mg * (p.bagiAnggota / 100);

  // ③ Lapangan kerja: orang × upah × 12
  const pekerja = p.kerjaPerKdkmp * p.desa;
  const gaji = pekerja * p.upah * 12;

  const dY = { hemat: hemat * k, tertahan: tertahan * k, kerja: gaji * k };
  const dYBantul = dY.hemat + dY.tertahan + dY.kerja;

  // ⑥–⑦ Nasional: Bantul diskalakan per KDKMP, ditambah substitusi impor
  const impor = KOMODITAS.map((km) => {
    const tengah = ((km.minT + km.maxT) / 2) * 1e12;
    const persen = p.substitusi[km.id] ?? 0;
    return { ...km, tengah, persen, nilai: tengah * (persen / 100) };
  });
  const substitusi = impor.reduce((a, b) => a + b.nilai, 0);
  const dYImpor = substitusi * k;
  const dYDesaNasional = dYBantul * skala;
  const dYNasional = dYDesaNasional + dYImpor;

  // Kemiskinan: gap pengeluaran = (P1/P0) × GK; poverty gap = N miskin × gap × 12
  const rasioKedalaman = p.p0 > 0 ? p.p1 / p.p0 : 0;
  const gapBulan = rasioKedalaman * p.gk;
  const gapTahun = gapBulan * 12;
  const povertyGap = p.miskinJuta * 1e6 * gapTahun;
  const dayaBeliBantul = shuAnggota + hemat; // ΔC = SHU + diskon
  const dayaBeliNasional = dayaBeliBantul * skala;
  const cakupanGap = povertyGap > 0 ? dayaBeliNasional / povertyGap : 0;

  // Ketimpangan
  const konsumsi = (p.porsiKonsumsi / 100) * pdb;
  const giniPendekatan = giniTigaKelompok(p.bawah40, p.tengah40, p.atas20);
  const koreksi = giniPendekatan > 0 ? p.gini / giniPendekatan : 1;
  const serapAtas = Math.max(0, 100 - p.serapBawah - p.serapTengah);
  const totalBagian = p.bawah40 + p.tengah40 + p.atas20;
  const lama = {
    bawah: (p.bawah40 / totalBagian) * konsumsi,
    tengah: (p.tengah40 / totalBagian) * konsumsi,
    atas: (p.atas20 / totalBagian) * konsumsi,
  };
  const baru = {
    bawah: lama.bawah + (p.serapBawah / 100) * dayaBeliNasional,
    tengah: lama.tengah + (p.serapTengah / 100) * dayaBeliNasional,
    atas: lama.atas + (serapAtas / 100) * dayaBeliNasional,
  };
  const konsumsiBaru = baru.bawah + baru.tengah + baru.atas;
  const giniBaru = giniTigaKelompok(baru.bawah, baru.tengah, baru.atas) * koreksi;

  // Rantai pasok beras
  const naikPetani = p.marginRantai * (p.bagiPetani / 100);
  const turunKonsumen = p.marginRantai * (p.bagiKonsumen / 100);
  const sisaBiaya = p.marginRantai - naikPetani - turunKonsumen;

  return {
    k,
    skala,
    bantul: {
      belanjaMakan,
      omzet,
      hemat,
      tertahan,
      shuAnggota,
      pekerja,
      gaji,
      dY,
      dYTotal: dYBantul,
      pdrb,
      persenPdrb: pdrb > 0 ? dYBantul / pdrb : 0,
    },
    nasional: {
      impor,
      substitusi,
      dYImpor,
      dYDesa: dYDesaNasional,
      dYTotal: dYNasional,
      pdb,
      persenPdb: pdb > 0 ? dYNasional / pdb : 0,
      omzet: omzet * skala,
      pekerja: pekerja * skala,
    },
    kemiskinan: {
      rasioKedalaman,
      gapBulan,
      gapTahun,
      povertyGap,
      dayaBeliBantul,
      dayaBeliNasional,
      cakupanGap,
    },
    ketimpangan: {
      konsumsi,
      giniPendekatan,
      koreksi,
      serapAtas,
      lama,
      baru,
      konsumsiBaru,
      bagianLama: { bawah: lama.bawah / konsumsi, tengah: lama.tengah / konsumsi, atas: lama.atas / konsumsi },
      bagianBaru: { bawah: baru.bawah / konsumsiBaru, tengah: baru.tengah / konsumsiBaru, atas: baru.atas / konsumsiBaru },
      giniLama: p.gini,
      giniBaru,
    },
    rantai: { naikPetani, turunKonsumen, sisaBiaya },
  };
}

/* ------------------------------------------------------------ alamat (URL) */

type KunciAngka = Exclude<keyof Parameter, "substitusi">;
const KUNCI = (Object.keys(AWAL) as (keyof Parameter)[]).filter((k) => k !== "substitusi") as KunciAngka[];

/**
 * Hanya nilai yang berbeda dari bawaan yang ditulis ke alamat. Alamatnya tetap
 * pendek dan bisa dibagikan, dan pembaruan asumsi bawaan di masa depan tidak
 * tertimpa oleh tautan lama yang kebetulan menyimpan angka bawaan lama.
 */
export function keAlamat(p: Parameter): string {
  const q = new URLSearchParams();
  for (const k of KUNCI) if (p[k] !== AWAL[k]) q.set(k, String(p[k]));
  for (const km of KOMODITAS) {
    if (p.substitusi[km.id] !== AWAL.substitusi[km.id]) q.set(`sub_${km.id}`, String(p.substitusi[km.id]));
  }
  return q.toString();
}

export function dariAlamat(q: URLSearchParams | { get(k: string): string | null }): Parameter {
  const p: Parameter = { ...AWAL, substitusi: { ...AWAL.substitusi } };
  for (const k of KUNCI) {
    const v = q.get(k);
    if (v === null) continue;
    const n = Number(v);
    // Angka rusak di alamat (salah salin, diketik tangan) jatuh ke bawaan, bukan NaN di layar.
    if (Number.isFinite(n)) p[k] = n;
  }
  for (const km of KOMODITAS) {
    const v = q.get(`sub_${km.id}`);
    const n = Number(v);
    if (v !== null && Number.isFinite(n)) p.substitusi[km.id] = Math.min(100, Math.max(0, n));
  }
  return p;
}
