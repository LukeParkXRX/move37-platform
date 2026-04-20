import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui";

export const metadata: Metadata = {
  title: "Get It Done at Work — 한국 스타트업의 미국 진출 파트너",
  description:
    "실행으로 연결하는 한·미 스타트업 파트너. US Market Enabler와 실시간 매칭. We don't advise. We execute.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Inter:wght@300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
          <ToastProvider>{children}</ToastProvider>
        </body>
    </html>
  );
}
