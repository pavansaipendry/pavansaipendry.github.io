import type { Metadata } from "next";
import { Inter, Space_Mono, Playfair_Display, Archivo } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["wdth"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Pavan Sai Reddy Pendry | Software Engineer · Machine Learning",
  description:
    "Software engineer building AI systems that retrieve, reason, and ship - from paper to production.",
  metadataBase: new URL("https://pavansaipendry.dev"),
  openGraph: {
    title: "Pavan Sai Reddy Pendry | Software Engineer · Machine Learning",
    description:
      "Software engineer building AI systems that retrieve, reason, and ship - from paper to production.",
    type: "website",
    url: "https://pavansaipendry.dev",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pavan Sai Reddy Pendry | Software Engineer · Machine Learning",
    description:
      "Software engineer building AI systems that retrieve, reason, and ship - from paper to production.",
    images: ["/og.png"],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='%230a0a0f'/><text x='32' y='43' text-anchor='middle' font-family='monospace' font-weight='700' font-size='22' fill='%237c5cfc' letter-spacing='1'>PSR</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceMono.variable} ${playfair.variable} ${archivo.variable} font-sans antialiased`}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
