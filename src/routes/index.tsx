import { createFileRoute } from "@tanstack/react-router";
import { IDCardGenerator } from "@/components/id-card-generator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Student ID Card Generator" },
      { name: "description", content: "Create, preview, print, and download professional student ID cards." },
      { property: "og:title", content: "Student ID Card Generator" },
      { property: "og:description", content: "Create professional student ID cards with photos, QR verification, and downloadable files." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <IDCardGenerator />;
}
