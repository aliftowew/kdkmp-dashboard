/**
 * Mencocokkan model dengan angka di catatan analisis KDKMP.
 *
 * Catatan analisis membulatkan pengganda ke 1,934 dan beberapa angka antara;
 * karena itu pembandingnya memakai toleransi relatif, bukan kesamaan persis.
 */
import assert from "node:assert/strict";
import { AWAL, dariAlamat, giniTigaKelompok, hitung, keAlamat, pengganda } from "../lib/model.ts";

const dekat = (nyata: number, harap: number, tol: number, label: string) => {
  const sel = Math.abs(nyata - harap) / Math.abs(harap);
  assert.ok(sel <= tol, `${label}: ${nyata} vs ${harap} (selisih ${(sel * 100).toFixed(2)}%)`);
};

// Pengganda: 1/(1 − 0,779(1 − 0,118) + 0,2039) ≈ 1,934
dekat(pengganda(0.779, 0.118, 0.2039), 1.934, 0.001, "pengganda");

const min = hitung(AWAL);
dekat(min.bantul.hemat, 53_202_727_598, 0.0001, "penghematan Bantul 30%/2%");
dekat(min.bantul.omzet, 2_660_136_379_920, 0.0001, "omzet Bantul 30%");
dekat(min.bantul.tertahan, 180_623_260_197, 0.0001, "retained 7%×97%");
dekat(min.bantul.shuAnggota, 152_691_828_207, 0.0001, "SHU anggota 7%×82%");
dekat(min.bantul.gaji, 40.5e9, 0.0001, "gaji 1.350 orang");
dekat(min.bantul.dYTotal, 530.4e9, 0.005, "ΔY total minimum Bantul");
dekat(min.bantul.persenPdrb, 0.0145, 0.01, "% PDRB minimum");
dekat(min.kemiskinan.povertyGap, 36.2e12, 0.005, "poverty gap nasional");
dekat(min.ketimpangan.giniPendekatan, 0.324, 0.002, "Gini pendekatan 2025");
dekat(min.ketimpangan.konsumsi, 12_834.8e12, 0.0001, "konsumsi RT");

const maks = hitung({ ...AWAL, pangsa: 100, diskon: 12, margin: 12 });
dekat(maks.bantul.hemat, 1_064_054_551_968, 0.0001, "penghematan 100%/12%");
dekat(maks.bantul.tertahan, 1_032_132_915_409, 0.0001, "retained 100%/12%");
dekat(maks.bantul.persenPdrb, 0.1128, 0.01, "% PDRB maksimum");
dekat(maks.nasional.substitusi, 76.86e12, 0.01, "substitusi impor");

// Gini tiga kelompok setelah manfaat konservatif (catatan: 0,3593)
const g = hitung(AWAL).ketimpangan.giniBaru;
assert.ok(g < 0.37 && g > 0.35, `Gini baru konservatif ${g}`);

// Alamat: bolak-balik dan hanya selisih yang ditulis
assert.equal(keAlamat(AWAL), "");
const p = { ...AWAL, pangsa: 50, substitusi: { ...AWAL.substitusi, gandum: 10 } };
assert.equal(keAlamat(p), "pangsa=50&sub_gandum=10");
assert.deepEqual(dariAlamat(new URLSearchParams(keAlamat(p))), p);
assert.equal(dariAlamat(new URLSearchParams("pangsa=abc")).pangsa, AWAL.pangsa);

console.log("test_model: lolos");
console.log({
  k: min.k, skala: min.skala,
  minNasional: min.nasional.dYTotal / 1e12, minPdb: min.nasional.persenPdb,
  maksNasional: maks.nasional.dYTotal / 1e12, maksPdb: maks.nasional.persenPdb,
  dayaBeli: [min.kemiskinan.dayaBeliNasional / 1e12, maks.kemiskinan.dayaBeliNasional / 1e12],
  gini: [min.ketimpangan.giniBaru, maks.ketimpangan.giniBaru],
});
