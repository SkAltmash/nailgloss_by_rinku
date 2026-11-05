import type { Metadata, Viewport } from "next";
import { Karla, Yeseva_One } from "next/font/google";
import { CONTACT } from "@/lib/data";
import { publicFileExists } from "@/lib/media";
import "lenis/dist/lenis.css";
import "./globals.css";

const yeseva = Yeseva_One({
  variable: "--font-yeseva",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = `${CONTACT.name} — Doorstep nail technician in ${CONTACT.city}`;
const description = `Salon-style nails at your doorstep. Nail extensions, gel polish, nail art and press-on nails — a doorstep nail service in ${CONTACT.city}. Book on WhatsApp.`;

// Only advertise an Open Graph image if one actually ships in /public.
const ogImage = publicFileExists("og.png")
  ? [{ url: "/og.png", width: 1200, height: 630, alt: CONTACT.name }]
  : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "nail technician Nagpur",
    "doorstep nails Nagpur",
    "nail extensions Nagpur",
    "gel polish Nagpur",
    "nail art Nagpur",
    "press-on nails",
  ],
  alternates: { canonical: "/" },
  ...(ogImage && {
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: CONTACT.name,
      title,
      description,
      url: "/",
      images: ogImage,
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  }),
};

export const viewport: Viewport = {
  themeColor: "#4A1F14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${yeseva.variable} ${karla.variable} antialiased`}>
      <body id="top">{children}</body>
    </html>
  );
}
