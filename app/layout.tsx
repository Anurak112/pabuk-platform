import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pabuk.ai | คลังข้อมูลโอเพนซอร์สไทยเพื่อ AI",
  description: "ระบบนิเวศข้อมูลวัฒนธรรมแบบกระจายศูนย์ที่ขับเคลื่อนโดยชุมชน สำหรับทั้ง 77 จังหวัดของประเทศไทย",
  keywords: ["Thai AI", "Open Source", "Data Repository", "Cultural Heritage", "Machine Learning"],
  openGraph: {
    title: "Pabuk.ai | Building Thailand's AI Future",
    description: "Community-driven cultural data ecosystem for all 77 provinces of Thailand",
    type: "website",
    locale: "th_TH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
