import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MissionRenderer from "@/features/missions/MissionRenderer";
import { getPublishedMission, getPublishedMissions } from "@/features/missions/missionServer";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPublishedMissions()).map((mission) => ({ slug: mission.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const mission = await getPublishedMission(slug);
  if (!mission) return { title: "Mission not found" };
  return {
    title: `${mission.name} — Mission Archive`, description: mission.excerpt,
    alternates: { canonical: `/missions/${mission.slug}/` },
    openGraph: { title: `${mission.name} — Mission Archive`, description: mission.excerpt, url: `/missions/${mission.slug}/`, images: [{ url: mission.cover_url || mission.hero.image }], type: "website" },
    twitter: { card: "summary_large_image", title: `${mission.name} — Mission Archive`, description: mission.excerpt, images: [mission.cover_url || mission.hero.image] },
  };
}

export default async function MissionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mission = await getPublishedMission(slug);
  if (!mission) notFound();
  return <MissionRenderer mission={mission} />;
}

