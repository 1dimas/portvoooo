import HeroSection from "@/components/sections/HeroSection";
import LabSection from "@/components/sections/LabSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import CertificatesSection from "@/components/sections/CertificatesSection";
import ZoomTransitionSection from "@/components/sections/ZoomTransitionSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ContactSection from "@/components/sections/ContactSection";
import Preloader from "@/components/Preloader";
import ScrollingBanner from "@/components/ScrollingBanner";

export default function Home() {
  return (
    <main className="relative bg-bg-primary overflow-clip">
      <Preloader />
      <HeroSection />
      <div className="h-16 md:h-48" />
      <LabSection />
      <div className="h-16 md:h-48" />
      <ServicesSection />
      <div className="h-16 md:h-48" />
      <ProjectsSection />
      <div className="h-16 md:h-48" />
      <ExperienceSection />
      <div className="h-16 md:h-48" />
      <CertificatesSection />
      <div className="h-16 md:h-48" />
      <ZoomTransitionSection />
      <TechStackSection />
      <ScrollingBanner text="AVAILABLE FOR FREELANCE • MARI BERKOLABORASI • LET'S BUILD SOMETHING GREAT" />
      <ContactSection />
    </main>
  );
}

