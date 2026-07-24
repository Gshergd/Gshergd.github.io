import type { Metadata } from "next";
import LuvinskiPortfolio from "@/features/luvinski/LuvinskiPortfolio";

export const metadata: Metadata = {
  title: "Luvinski — Portfolio Library",
  description: "The living portfolio of Gshergd Luvinski: Discord systems, websites, game experiments, visual work, and a growing library of character archives.",
  openGraph: {
    title: "Luvinski — Portfolio Library",
    description: "Systems, communities, game experiments, visual stories, and the work worth carrying forward.",
    images: [{ url: "/assets/portfolio/project-01.webp" }],
  },
};

export default function HomePage() {
  return <LuvinskiPortfolio />;
}
