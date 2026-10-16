# Kalkulator KDKMP

Dashboard simulasi potensi dampak ekonomi dan sosial **Koperasi Desa/Kelurahan Merah Putih (KDKMP)**,
diturunkan dari catatan analisis "Analisis potensi dampak ekonomi program KDKMP". Gaya visualnya
mengikuti E-Purchasing BPJS Ketenagakerjaan (Next.js + Tailwind v4, terang/gelap).

| Halaman | Isi |
| --- | --- |
| Ringkasan | KPI utama, komposisi tambahan PDB, perbandingan 3 skenario |
| PDRB Bantul | ① penghematan harga, ② nilai tertahan di desa, ③ lapangan kerja, ④ rantai pasok beras, tabel kepekaan |
| PDB Nasional | Skala 83.762 KDKMP + ⑦ substitusi impor per komoditas (bisa diubah) |
| Kemiskinan | Poverty gap (P1/P0 × GK × N miskin) vs tambahan daya beli (SHU + diskon) |
| Rasio Gini | Kurva Lorenz sebelum/sesudah, distribusi manfaat 55/35/10 |
| Asumsi & sumber | Semua angka dasar bisa diganti, turunan angka pengganda k |

Semua asumsi tersimpan di alamat (query string), jadi skenario bisa dibagikan lewat tautan.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # cocokkan model dengan angka di catatan analisis
npm run typecheck
```

Rumus ada di `lib/model.ts`. `app.py` (versi Streamlit lama) dibiarkan apa adanya.
