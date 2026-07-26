import type { Metadata } from "next";
import MissionsArchive from "@/features/missions/MissionsArchive";

export const metadata: Metadata = {
  title: "Mission Archives",
  description: "A cinematic library of character dossiers, operations, worlds, and stories.",
  alternates: { canonical: "/missions/" },
};

export default function MissionsPage() { return <MissionsArchive />; }

