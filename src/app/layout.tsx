import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";
import SmoothScroller from "@/components/SmoothScroller";
import CustomCursor from "@/components/CustomCursor";
import TopProgressBar from "@/components/TopProgressBar";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";
import TerminalOverlay from "@/components/TerminalOverlay";
import AIHeroGuide from "@/components/AIHeroGuide";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dimas — Full Stack Developer & Mitra Digital Bisnis",
  description:
    "Portfolio seorang Full Stack Developer yang siap membantu mewujudkan ide bisnis Anda menjadi produk digital yang fungsional, estetik, dan scalable.",
  keywords: [
    "Full Stack Developer",
    "Web Developer",
    "Freelance",
    "Next.js",
    "React",
    "TypeScript",
    "Portfolio",
  ],
  openGraph: {
    title: "Dimas — Full Stack Developer & Mitra Digital Bisnis",
    description:
      "Portfolio seorang Full Stack Developer yang siap membantu mewujudkan ide bisnis Anda menjadi produk digital.",
    type: "website",
    locale: "id_ID",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${anton.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TerminalOverlay />
          <ThemeToggle />
          <CustomCursor />
          <TopProgressBar />
          <SmoothScroller>{children}</SmoothScroller>
          <AIHeroGuide />
        </ThemeProvider>
      </body>
    </html>
  );
}
