import type { Parameter } from "@/lib/model.ts";

/**
 * Daftar seluruh variabel masukan, dikelompokkan dan diberi sumber.
 *
 * Dipakai dua halaman sekaligus: menu Variabel (tempat mengubahnya) dan
 * Metode & sumber (tempat membaca asal-usulnya). Satu daftar mencegah label
 * atau sumber yang berbeda antara tempat angka diketik dan tempat ia dijelaskan.
 */

export type KunciAngka = Exclude<keyof Parameter, "substitusi">;

export type Variabel = {
  kunci: KunciAngka;
  label: string;
  simbol?: string;
  satuan?: string;
  sumber: string;
  langkah?: number;
  /** Ada min/maks → ditampilkan sebagai penggeser; tanpa itu → isian angka. */
  min?: number;
  maks?: number;
  keterangan?: string;
};

export type KelompokVariabel = {
  id: string;
  judul: string;
  lede: string;
  ikon: string;
  butir: Variabel[];
};

export const KELOMPOK_VARIABEL: KelompokVariabel[] = [
  {
    id: "skenario",
    judul: "Skenario",
    lede: "Tiga tuas utama. Pilih skenario siap pakai, atau geser sendiri.",
    ikon: "tune",
    butir: [
      { kunci: "pangsa", simbol: "s", label: "Pangsa belanja via KDKMP", satuan: "%", min: 0, maks: 100, langkah: 5, sumber: "Asumsi skenario (30–100%)" },
      { kunci: "diskon", simbol: "d", label: "Diskon harga", satuan: "%", min: 0, maks: 15, langkah: 0.5, sumber: "Asumsi skenario (2–12%)" },
      { kunci: "margin", label: "Margin KDKMP", satuan: "%", min: 0, maks: 15, langkah: 0.5, sumber: "TORA SERA, Danantara: 7–12%" },
    ],
  },
  {
    id: "margin",
    judul: "Pembagian margin",
    lede: "Ke mana margin KDKMP mengalir: 3% kantor pusat, 15% KDKMP/desa, 82% anggota.",
    ikon: "pie_chart",
    butir: [
      { kunci: "bagiDesa", label: "Margin yang tetap di desa", satuan: "%", min: 0, maks: 100, sumber: "82% anggota + 15% desa (TORA SERA)" },
      { kunci: "bagiAnggota", label: "Margin jadi SHU anggota", satuan: "%", min: 0, maks: 100, sumber: "TORA SERA, Danantara / Agrinas" },
    ],
  },
  {
    id: "bantul",
    judul: "Kabupaten Bantul (sampel)",
    lede: "Data satu kabupaten yang dihitung rinci, lalu diskalakan ke nasional.",
    ikon: "where_to_vote",
    butir: [
      { kunci: "penduduk", simbol: "Pop", label: "Jumlah penduduk", satuan: "jiwa", langkah: 1, sumber: "Dukcapil per 31 Des 2024" },
      { kunci: "eFood", simbol: "E_food", label: "Pengeluaran makanan/kapita/bulan", satuan: "Rp", langkah: 1, sumber: "BPS DIY (Susenas) 2024" },
      { kunci: "pdrbMiliar", label: "PDRB ADHB", satuan: "miliar", sumber: "BPS Kab. Bantul 2024" },
      { kunci: "desa", label: "Jumlah desa (= KDKMP)", langkah: 1, sumber: "bantulkab.go.id" },
      { kunci: "kerjaPerKdkmp", label: "Pekerja per KDKMP", satuan: "orang", langkah: 1, sumber: "Asumsi analisis" },
      { kunci: "upah", label: "Upah per bulan", satuan: "Rp", langkah: 50000, sumber: "Asumsi analisis" },
    ],
  },
  {
    id: "pengganda",
    judul: "Angka pengganda (k)",
    lede: "Seberapa kali uang berputar sebelum bocor ke pajak dan impor: k = 1 ÷ (1 − c(1 − t) + m).",
    ikon: "hub",
    butir: [
      { kunci: "mpc", simbol: "c", label: "Kecenderungan konsumsi marginal", langkah: 0.001, sumber: "UKM JEM, tabel I-O 2008 (0,779)" },
      { kunci: "pajak", simbol: "t", label: "Rasio pajak thd PDB", langkah: 0.001, sumber: "CEIC, Des 2024 (11,8%)" },
      { kunci: "impor", simbol: "m", label: "Impor thd PDB", langkah: 0.0001, sumber: "Bank Dunia 2024 (20,39%)" },
    ],
  },
  {
    id: "nasional",
    judul: "Nasional",
    lede: "Untuk menskalakan Bantul dan membandingkan dengan PDB.",
    ikon: "public",
    butir: [
      { kunci: "jumlahKdkmp", label: "Jumlah KDKMP", langkah: 1, sumber: "75.753 desa + 8.486 kelurahan + 37 UPT/SPT" },
      { kunci: "pdbTriliun", label: "PDB ADHB 2025", satuan: "triliun", sumber: "BRS BPS No. 18/02/Th. XXIX" },
      { kunci: "porsiKonsumsi", label: "Porsi konsumsi RT thd PDB", satuan: "%", sumber: "BPS 2025 (53,88%)" },
    ],
  },
  {
    id: "kemiskinan",
    judul: "Kemiskinan",
    lede: "Untuk menghitung poverty gap: uang yang dibutuhkan agar semua penduduk miskin melewati garis kemiskinan.",
    ikon: "groups",
    butir: [
      { kunci: "p0", simbol: "P0", label: "Persentase penduduk miskin", satuan: "%", sumber: "BPS Sep 2025" },
      { kunci: "p1", simbol: "P1", label: "Indeks kedalaman kemiskinan", sumber: "BPS Sep 2025" },
      { kunci: "gk", simbol: "GK", label: "Garis kemiskinan", satuan: "Rp/bln", langkah: 1, sumber: "BPS Sep 2025" },
      { kunci: "miskinJuta", simbol: "N", label: "Jumlah penduduk miskin", satuan: "juta", sumber: "BPS Sep 2025" },
    ],
  },
  {
    id: "ketimpangan",
    judul: "Ketimpangan",
    lede: "Bagian pengeluaran tiap kelompok dan siapa yang menyerap manfaat KDKMP.",
    ikon: "scale",
    butir: [
      { kunci: "gini", label: "Rasio Gini resmi", langkah: 0.001, sumber: "BPS 2025" },
      { kunci: "bawah40", label: "Bagian 40% terbawah", satuan: "%", sumber: "BPS, kota+desa 2025" },
      { kunci: "tengah40", label: "Bagian 40% tengah", satuan: "%", sumber: "BPS, kota+desa 2025" },
      { kunci: "atas20", label: "Bagian 20% teratas", satuan: "%", sumber: "BPS, kota+desa 2025" },
      { kunci: "serapBawah", label: "Manfaat diserap 40% terbawah", satuan: "%", min: 0, maks: 100, sumber: "Asumsi analisis (55%)" },
      { kunci: "serapTengah", label: "Manfaat diserap 40% tengah", satuan: "%", min: 0, maks: 100, sumber: "Asumsi analisis (35%)" },
    ],
  },
  {
    id: "rantai",
    judul: "Rantai pasok beras",
    lede: "Margin petani → konsumen yang bisa dipangkas bila rantainya jadi petani → KDKMP → konsumen.",
    ikon: "local_shipping",
    butir: [
      { kunci: "marginRantai", label: "Margin pemasaran total", satuan: "Rp/kg", langkah: 100, sumber: "Penelitian Kab. Semarang (Kabarbursa)" },
      { kunci: "bagiPetani", label: "Berpindah ke petani", satuan: "%", min: 0, maks: 100, sumber: "Asumsi analisis (30%)" },
      { kunci: "bagiKonsumen", label: "Jadi harga lebih murah", satuan: "%", min: 0, maks: 100, sumber: "Asumsi analisis (30%)" },
    ],
  },
];
