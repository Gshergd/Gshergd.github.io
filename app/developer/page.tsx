import type { Metadata } from "next";
import DeveloperDashboard from "@/features/gallery/DeveloperDashboard";

export const metadata: Metadata = {
  title: "Archive Developer — Luvinski",
  description: "Private gallery management and visual mission-page building for the Luvinski portfolio.",
  robots: { index: false, follow: false },
};

export default function DeveloperPage() { return <DeveloperDashboard />; }
