import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Pavan Sai Reddy Pendry | Software Engineer & AI/ML",
  description:
    "Full-stack developer and AI/ML engineer building scalable autonomous systems from research to deployment.",
  metadataBase: new URL("https://pavansaipendry.dev"),
  openGraph: {
    title: "Pavan Sai Reddy Pendry | Software Engineer & AI/ML",
    description:
      "Full-stack developer and AI/ML engineer building scalable autonomous systems from research to deployment.",
    type: "website",
    url: "https://pavansaipendry.dev",
  },
  twitter: {
    card: "summary",
    title: "Pavan Sai Reddy Pendry | Software Engineer & AI/ML",
    description:
      "Full-stack developer and AI/ML engineer building scalable autonomous systems from research to deployment.",
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
      <body className={`${inter.variable} ${spaceMono.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
