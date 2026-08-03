"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import TrustSignals from "@/components/TrustSignals";
import NearbyAttractions from "@/components/NearbyAttractions";
import HappyClients from "@/components/HappyClients";
import VisitorFeedback from "@/components/VisitorFeedback";
import LeadForm from "@/components/LeadForm";
import Projects from "@/components/Projects";
import IndividualLand from "@/components/IndividualLand";
import HomeGallery from "@/components/HomeGallery";
import FAQ from "@/components/FAQ";
import InvestorSection from "@/components/InvestorSection";
import ClientComponentsWrapper from "@/components/ClientComponentsWrapper";

export default function HomeClient({
  initialSlides,
  initialContent,
}: {
  initialSlides: any;
  initialContent: Record<string, string>;
}) {
  return (
    <>
      <Header />
      <main>
        <Hero initialSlides={initialSlides} initialContent={initialContent} />
        <Benefits />
        <TrustSignals />
        <Projects />
        <IndividualLand />
        <HomeGallery />
        <NearbyAttractions />
        <InvestorSection />
        <HappyClients />
        <VisitorFeedback />
        <section id="lead-form" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <LeadForm />
          </div>
        </section>
        <FAQ />
      </main>
      <Footer />
      <ClientComponentsWrapper />
    </>
  );
}