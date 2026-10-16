"use client";

import { Ikon } from "@/components/ui.tsx";
import { ATRIBUT_TEMA, COOKIE_TEMA, type Tema } from "@/lib/tema.ts";

/**
 * Tombol terang/gelap.
 *
 * Satu tombol ikon, bukan tiga pilihan: bulan berarti "ke gelap", matahari
 * berarti "ke terang". Bentuk ini sudah dikenal orang, jadi tidak perlu label,
 * dan tidak memakan tinggi sidebar.
 *
 * Ikon MANA yang tampil ditentukan CSS, bukan JavaScript. Saat setelan masih
 * mengikuti sistem, server tidak tahu sistem pembacanya gelap atau terang —
 * menebaknya membuat ikon salah sekejap lalu melompat begitu JavaScript jalan.
 * Dengan merender kedua ikon dan menyembunyikan salah satunya lewat aturan
 * yang sama dengan palet, ikonnya sudah benar sejak gambar pertama.
 */
function temaBerlaku(): Tema {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark") return "gelap";
  if (attr === "light") return "terang";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "gelap" : "terang";
}

export function TombolTema() {
  const alih = () => {
    const tujuan: Tema = temaBerlaku() === "gelap" ? "terang" : "gelap";
    const akar = document.documentElement;

    // Transisi dimatikan sesaat supaya pergantian tidak terlihat seperti kedip.
    akar.classList.add("ganti-tema");
    akar.setAttribute("data-theme", ATRIBUT_TEMA[tujuan]!);
    window.setTimeout(() => akar.classList.remove("ganti-tema"), 60);

    // Dibaca server saat render berikutnya, jadi tidak ada kedip tema salah.
    document.cookie = `${COOKIE_TEMA}=${tujuan}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <button
      type="button"
      onClick={alih}
      title="Ganti terang/gelap"
      aria-label="Ganti tampilan terang atau gelap"
      className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-[1.15rem] text-ink-2 transition-colors hover:bg-surface-2"
    >
      {/*
        Dua ikon, dipilih CSS, bukan satu ikon yang ditukar JavaScript.
        Dengan begitu ikonnya sudah benar pada gambar pertama, bahkan sebelum
        hidrasi, jadi tidak ada ikon yang melompat sesudah halaman hidup.
      */}
      <Ikon nama="dark_mode" className="ikon-gelap" />
      <Ikon nama="light_mode" className="ikon-terang" />
    </button>
  );
}
