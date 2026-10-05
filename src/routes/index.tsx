import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/nexus/Navbar";
import { Hero } from "@/components/nexus/Hero";
import { ScrollStory } from "@/components/nexus/ScrollStory";
import { KnowledgeUniverse } from "@/components/nexus/KnowledgeUniverse";
import { FinalCTA } from "@/components/nexus/FinalCTA";
import { Footer } from "@/components/nexus/Footer";
import { CursorGlow } from "@/components/nexus/CursorGlow";
import { useSmoothScroll } from "@/components/nexus/useLenis";

const TITLE = "BEACON — One Front Door For Your Enterprise";
const DESCRIPTION =
  "BEACON is the enterprise AI orchestrator that routes one question across HR, IT and Finance systems and returns one grounded, cited answer.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useSmoothScroll();

  return (
    <main className="relative bg-background">
      <CursorGlow />
      <Navbar />
      <Hero />
      <ScrollStory />
      <KnowledgeUniverse />
      <FinalCTA />
      <Footer />
    </main>
  );
}
