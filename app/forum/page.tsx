import type { Metadata } from "next";
import ForumRequest from "@/features/forum/ForumRequest";

export const metadata: Metadata = {
  title: "Forum Request — Luvinski",
  description: "Send a direct request to Gshergd Luvinski through the Portfolio Library.",
  openGraph: {
    title: "Forum Request — Luvinski",
    description: "Open a direct channel for project requests, questions, and conversations.",
    images: [{ url: "/assets/forum/forum-sunset.png" }],
  },
};

export default function ForumPage() {
  return <ForumRequest />;
}
