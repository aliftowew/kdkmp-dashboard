import { HalamanRingkasan } from "@/components/halaman/ringkasan.tsx";

// Halaman akar menulis judulnya sendiri: template layout tidak berlaku di segmen yang sama.
export const metadata = { title: "Ringkasan · Kalkulator KDKMP" };

export default function Halaman() {
  return <HalamanRingkasan />;
}
