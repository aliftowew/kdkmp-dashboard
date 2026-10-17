"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useParameter } from "@/components/parameter.tsx";
import { TombolTema } from "@/components/tema.tsx";
import { Ikon } from "@/components/ui.tsx";
import { GRUP, MENU, menuAktif } from "@/lib/menu.ts";

/*
 * Logo resmi Kopdes Merah Putih dipakai apa adanya, tidak digambar ulang.
 *
 * Ia selalu duduk di atas lempeng putih (--latar-logo), juga di tema gelap:
 * separuh putih bendera dan tulisan hitam "MERAH PUTIH" lenyap di atas latar
 * gelap, dan logo yang warnanya dibalik bukan lagi logo yang sama.
 */
function Merek({ ringkas = false }: { ringkas?: boolean }) {
  return (
    // Di sidebar logo ditumpuk di atas judul: berdampingan, judulnya terpotong
    // dan tulisan "MERAH PUTIH" di logo terlalu kecil untuk terbaca.
    <span className={`flex min-w-0 gap-3 ${ringkas ? "items-center" : "flex-col items-start gap-2.5"}`}>
      {ringkas ? (
        <img
          src="/logo/marka.png"
          alt="Kopdes Merah Putih"
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 rounded-xl border border-line bg-latar-logo object-contain"
        />
      ) : (
        <span className="shrink-0 rounded-2xl border border-line bg-latar-logo px-3 py-2">
          <img src="/logo/kopdes.png" alt="Kopdes Merah Putih" width={97} height={72} className="h-[4.5rem] w-auto" />
        </span>
      )}
      <span className={`flex min-w-0 flex-col ${ringkas ? "max-sm:sr-only" : ""}`}>
        <span className="truncate text-[1.02rem] leading-tight font-extrabold tracking-[-0.02em]">Kalkulator KDKMP</span>
        <span className="truncate font-mono text-[0.6rem] tracking-[0.1em] text-muted uppercase">
          Simulasi dampak
        </span>
      </span>
    </span>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  // Diambil dari penyedia, bukan useSearchParams: alamat ditulis lewat
  // replaceState, dan tautan menu harus ikut berubah di render yang sama.
  const { alamat: qs } = useParameter();
  const [terbuka, setTerbuka] = useState(false);
  const pembuka = useRef<HTMLButtonElement>(null);
  const penutup = useRef<HTMLButtonElement>(null);

  // Berpindah halaman menutup laci.
  useEffect(() => setTerbuka(false), [path]);

  useEffect(() => {
    if (!terbuka) return;
    document.body.style.overflow = "hidden";
    penutup.current?.focus();
    const tekan = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTerbuka(false);
        pembuka.current?.focus();
      }
    };
    window.addEventListener("keydown", tekan);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", tekan);
    };
  }, [terbuka]);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <a href="#konten" className="lewati print:hidden">
        Lewati ke konten
      </a>

      {terbuka && (
        <button
          type="button"
          aria-label="Tutup menu"
          tabIndex={-1}
          onClick={() => setTerbuka(false)}
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
        />
      )}

      <aside
        id="menu-utama"
        className={`fixed inset-y-0 left-0 z-40 flex w-[17rem] max-w-[85vw] flex-col border-r border-line bg-sidebar shadow-naik transition-transform duration-200 motion-reduce:transition-none print:hidden ${
          terbuka ? "visible translate-x-0" : "invisible -translate-x-full"
        } lg:visible lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:w-auto lg:translate-x-0 lg:shadow-none`}
      >
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 lg:gap-5 lg:p-3">
          <div className="flex items-start justify-between gap-2 lg:px-1 lg:pt-1">
            <Merek />
            <button
              ref={penutup}
              type="button"
              onClick={() => {
                setTerbuka(false);
                pembuka.current?.focus();
              }}
              aria-label="Tutup menu"
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-[1.15rem] text-ink-2 hover:bg-surface-2 lg:hidden"
            >
              <Ikon nama="close" />
            </button>
          </div>

          <nav aria-label="Menu utama" className="flex flex-col gap-5 lg:gap-4">
            {GRUP.map((g) => (
              <div key={g} className="flex flex-col gap-0.5">
                <p className="mb-1 px-3 text-[0.6rem] font-bold tracking-[0.11em] text-muted uppercase lg:mb-0.5">{g}</p>
                {MENU.filter((m) => m.grup === g).map((m) => {
                  const aktif = menuAktif(path, m.href);
                  return (
                    <Link
                      key={m.href}
                      // Asumsi ikut dibawa berpindah halaman, jadi skenario yang
                      // sedang disusun tidak hilang saat pindah menu.
                      href={qs ? `${m.href}?${qs}` : m.href}
                      aria-current={aktif ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors lg:py-1.5 ${
                        aktif ? "bg-accent-soft font-semibold text-accent-ink" : "font-medium text-ink-2 hover:bg-surface-2"
                      }`}
                    >
                      <Ikon nama={m.ikon} className={`text-[1.15rem] ${aktif ? "text-accent-ink" : "text-muted"}`} />
                      {m.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t border-line p-3">
          <div className="flex items-start gap-2 rounded-xl bg-surface-2 px-2.5 py-2">
            <Ikon nama="info" className="mt-0.5 text-[1rem] text-muted" />
            <p className="text-xs text-ink-2">
              Angka adalah <strong className="font-semibold text-ink">simulasi potensi</strong>, bukan realisasi.
              Ubah angkanya di menu Variabel untuk menguji kepekaan hasil.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-line bg-surface px-5 py-2.5 sm:px-8 lg:static lg:px-10 print:hidden">
          <button
            ref={pembuka}
            type="button"
            onClick={() => setTerbuka(true)}
            aria-label="Buka menu"
            aria-expanded={terbuka}
            aria-controls="menu-utama"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-[1.15rem] text-ink-2 hover:bg-surface-2 lg:hidden"
          >
            <Ikon nama="menu" />
          </button>
          <span className="lg:hidden">
            <Merek ringkas />
          </span>
          <p className="hidden text-sm text-muted lg:block">Simulasi dampak ekonomi & sosial program KDKMP</p>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href={qs ? `/variabel?${qs}` : "/variabel"}
              aria-label="Ubah variabel"
              title="Ubah variabel"
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-[1.15rem] text-ink-2 transition-colors hover:bg-surface-2"
            >
              <Ikon nama="tune" />
            </Link>
            <Link
              href={qs ? `/asumsi?${qs}` : "/asumsi"}
              aria-label="Metode dan sumber data"
              title="Metode & sumber data"
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-[1.15rem] text-ink-2 transition-colors hover:bg-surface-2"
            >
              <Ikon nama="help_outline" />
            </Link>
            <TombolTema />
          </div>
        </div>

        <main id="konten" tabIndex={-1} className="min-w-0 px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
