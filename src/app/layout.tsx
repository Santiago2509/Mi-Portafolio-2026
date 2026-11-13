import type { Metadata, Viewport } from "next";
import { Anton, Inter, Instrument_Serif, Allura } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/content";

const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const serif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});
const script = Allura({ variable: "--font-allura", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: `${profile.name} — Portafolio`,
  description: profile.tagline,
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body
        className={`${anton.variable} ${inter.variable} ${serif.variable} ${script.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
