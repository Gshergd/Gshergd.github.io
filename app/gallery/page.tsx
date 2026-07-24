import type { Metadata } from "next";
import GalleryArchive from "@/features/gallery/GalleryArchive";

export const metadata: Metadata = {
  title: "Image Gallery — Luvinski",
  description: "The complete visual gallery of Gshergd Luvinski: screenshots, games, experiments, environments, and collected moments.",
  openGraph: { title: "Image Gallery — Luvinski", images: [{ url: "/assets/portfolio/hero-legacy.webp" }] },
};

export default function GalleryPage() { return <GalleryArchive />; }
