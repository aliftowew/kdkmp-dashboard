"use client";

import Link from "next/link";

import {
  IsianAngka,
  PemilihSkenario,
  Penggeser,
  TombolBagikan,
  TombolKembalikan,
  useParameter,
} from "@/components/parameter.tsx";
import { Catatan, Ikon, Kartu, KepalaHalaman } from "@/components/ui.tsx";
import { angka, persen, rupiahRingkas } from "@/lib/format.ts";
import { AWAL, KOMODITAS, type Parameter } from "@/lib/model.ts";
import { KELOMPOK_VARIABEL, type Variabel } from "@/lib/variabel.ts";

/**
 * Satu-satunya tempat mengubah angka. Halaman hasil hanya membaca.
 *
 * Batas penggeser yang saling bergantung (pembagian yang harus ≤ 100%)
 * dihitung di sini dari nilai pasangannya, supaya tidak mungkin menyusun
 * pembagian 80% + 40%.
 */
function batasMaks(v: Variabel, p: Parameter): number {
  if (v.kunci === "serapBawah") return 100 - p.serapTengah;
  if (v.kunci === "serapTengah") return 100 - p.serapBawah;
  if (v.kunci === "bagiPetani") return 100 - p.bagiKonsumen;
  if (v.kunci === "bagiKonsumen") return 100 - p.bagiPetani;
  return v.maks ?? 100;
}

export function HalamanVariabel() {
  const { p, h, ubah, alamat } = useParameter();
  const qs = alamat ? `?${alamat}` : "";
  const jumlahBagian = p.bawah40 + p.tengah40 + p.atas20;

  return (
    <>
      <KepalaHalaman
        kicker="Pengaturan"
        judul="Variabel"
        keterangan="Semua angka masukan ada di sini. Ubah sekali, dan seluruh halaman hasil ikut dihitung ulang."
        aksi={
          <div className="flex flex-wrap gap-2">
            <TombolKembalikan />
            <TombolBagikan />
          </div>
        }
      />

      {/* Pratinjau hasil yang ikut menempel saat menggulir, supaya efek tiap
          perubahan langsung terlihat tanpa bolak-balik ke halaman lain. */}
      <div className="sticky top-[61px] z-10 mt-6 lg:top-3">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-naik md:grid-cols-4">
          {[
            { l: "Tambahan PDB", n: rupiahRingkas(h.nasional.dYTotal), href: "/nasional" },
            { l: "% PDB 2025", n: persen(h.nasional.persenPdb), href: "/nasional" },
            { l: "vs poverty gap", n: `${angka(h.kemiskinan.cakupanGap, 1)}×`, href: "/kemiskinan" },
            { l: "Gini baru", n: angka(h.ketimpangan.giniBaru, 3), href: "/ketimpangan" },
          ].map((x) => (
            <Link key={x.l} href={`${x.href}${qs}`} className="bg-surface px-4 py-2.5 transition-colors hover:bg-surface-2">
              <span className="block font-mono text-[0.6rem] tracking-[0.1em] text-muted uppercase">{x.l}</span>
              <span className="tnum block text-lg font-extrabold tracking-[-0.02em]">{x.n}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {KELOMPOK_VARIABEL.map((k) => (
          <Kartu key={k.id} className={`p-5 ${k.id === "skenario" ? "xl:col-span-2" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-xl text-accent-ink">
                  <Ikon nama={k.ikon} />
                </span>
                <div>
                  <h2 className="text-[0.95rem] font-bold tracking-[-0.01em]">{k.judul}</h2>
                  <p className="mt-0.5 max-w-[60ch] text-xs text-ink-2">{k.lede}</p>
                </div>
              </div>
              {k.id === "skenario" && <PemilihSkenario />}
              {k.id === "pengganda" && (
                <span className="tnum rounded-full bg-accent-soft px-3 py-1 text-sm font-bold text-accent-ink">
                  k = {angka(h.k, 3)}
                </span>
              )}
            </div>

            <div className={`mt-5 grid gap-x-6 gap-y-5 ${k.id === "skenario" ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
              {k.butir.map((v) => {
                const label = v.simbol ? `${v.label} (${v.simbol})` : v.label;
                return v.min !== undefined ? (
                  <Penggeser
                    key={v.kunci}
                    label={label}
                    nilai={p[v.kunci]}
                    ubah={(n) => ubah({ [v.kunci]: n } as Partial<Parameter>)}
                    min={v.min}
                    max={batasMaks(v, p)}
                    langkah={v.langkah ?? 1}
                    satuan={v.satuan ?? ""}
                    keterangan={v.sumber}
                  />
                ) : (
                  <IsianAngka
                    key={v.kunci}
                    label={label}
                    nilai={p[v.kunci]}
                    bawaan={AWAL[v.kunci]}
                    ubah={(n) => ubah({ [v.kunci]: n } as Partial<Parameter>)}
                    satuan={v.satuan}
                    sumber={v.sumber}
                    langkah={v.langkah}
                  />
                );
              })}
              {k.id === "ketimpangan" && (
                <p className="text-xs text-muted sm:col-span-2">
                  Sisanya, <strong className="tnum text-ink">{angka(h.ketimpangan.serapAtas, 0)}%</strong>, diserap 20%
                  teratas.
                </p>
              )}
            </div>

            {k.id === "ketimpangan" && Math.abs(jumlahBagian - 100) > 0.05 && (
              <div className="mt-4">
                <Catatan nada="awas" ikon="warning">
                  Ketiga bagian pengeluaran berjumlah {angka(jumlahBagian, 2)}%, bukan 100%. Hitungan tetap jalan dengan
                  menormalkan ketiganya, tapi periksa lagi angkanya.
                </Catatan>
              </div>
            )}
          </Kartu>
        ))}

        <Kartu className="p-5 xl:col-span-2">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-xl text-accent-ink">
              <Ikon nama="agriculture" />
            </span>
            <div>
              <h2 className="text-[0.95rem] font-bold tracking-[-0.01em]">Substitusi impor</h2>
              <p className="mt-0.5 max-w-[70ch] text-xs text-ink-2">
                Persen impor tiap komoditas yang bisa digantikan petani lokal lewat KDKMP. Nilai impor memakai titik
                tengah rentang sumber.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {KOMODITAS.map((km) => (
              <Penggeser
                key={km.id}
                label={km.nama}
                nilai={p.substitusi[km.id]}
                ubah={(n) => ubah({ substitusi: { ...p.substitusi, [km.id]: n } })}
                min={0}
                max={100}
                langkah={5}
                keterangan={`impor Rp ${angka(km.minT, 1)}–${angka(km.maxT, 1)} T`}
              />
            ))}
          </div>
        </Kartu>
      </div>
    </>
  );
}
