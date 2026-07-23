import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Secretary Archives",
    template: "%s | The Secretary Archives",
  },
  description: "Cinematic fan archives devoted to unforgettable characters and their hidden histories.",
  icons: {
    icon: "/assets/brand/secretary-mark.png",
    shortcut: "/assets/brand/secretary-mark.png",
    apple: "/assets/brand/secretary-mark.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
