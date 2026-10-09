import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChallengeDetail from "@/pages/ChallengeDetail";

export default function PublicChallengeDetail() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <ChallengeDetail />
      </main>
      <Footer />
    </div>
  );
}
