import type { Metadata } from "next";
import { cookies } from "next/headers";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { Suspense } from "react";

import { PenyediaParameter } from "@/components/parameter.tsx";
import { Shell } from "@/components/shell.tsx";
import { Kerangka } from "@/components/ui.tsx";
import { ATRIBUT_TEMA, COOKIE_TEMA, bacaTema } from "@/lib/tema.ts";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-inter", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Kalkulator KDKMP", template: "%s · Kalkulator KDKMP" },
  description: "Simulasi potensi dampak ekonomi dan sosial Koperasi Desa/Kelurahan Merah Putih terhadap PDRB, PDB, kemiskinan, dan rasio Gini.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tema = bacaTema((await cookies()).get(COOKIE_TEMA)?.value);
  return (
    // Atribut tema dipasang saat render server supaya tidak ada kedip tema salah.
    <html lang="id" data-theme={ATRIBUT_TEMA[tema]}>
      <body className={`${inter.variable} ${plexMono.variable} font-sans`}>
        {/* useSearchParams di penyedia dan shell butuh batas Suspense. */}
        <Suspense fallback={<div className="p-10"><Kerangka /></div>}>
          <PenyediaParameter>
            <Shell>{children}</Shell>
          </PenyediaParameter>
        </Suspense>
      </body>
    </html>
  );
}
