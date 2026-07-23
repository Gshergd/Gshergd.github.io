import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ada Wong — The Woman in Red",
  description: "Enter the classified world of Resident Evil's most elusive covert operative.",
  alternates: { canonical: "/ada-wong/" },
  openGraph: {
    title: "Ada Wong — The Woman in Red",
    description: "Enter the classified world of Resident Evil's most elusive covert operative.",
    url: "/ada-wong/",
    images: [{
      url: "/assets/social/ada-wong-og.png",
      width: 1680,
      height: 941,
      alt: "Ada Wong — The Woman in Red",
    }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ada Wong — The Woman in Red",
    description: "Enter the classified world of Resident Evil's most elusive covert operative.",
    images: ["/assets/social/ada-wong-og.png"],
  },
};

export default function AdaWongLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
