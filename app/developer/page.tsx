import type { Metadata } from "next";
import DeveloperDashboard from "@/features/gallery/DeveloperDashboard";

export const metadata: Metadata = {
  title: "Gallery Developer — Luvinski",
  description: "Private gallery management for the Luvinski portfolio.",
  robots: { index: false, follow: false },
};

export default function DeveloperPage() { return <DeveloperDashboard />; }
