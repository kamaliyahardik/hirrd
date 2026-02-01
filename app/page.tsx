"use client";

import Navbar from "../components/Home/Navbar";
import HeroSection from "../components/Home/HeroSection";
import CompaniesLogoMarquee from "../components/Home/CompaniesLogoMarquee";
import Features from "../components/Home/Features";
import Review from "../components/Home/Review";
import Faq from "../components/Home/Faq";
import CTA from "../components/Home/CTA";
import Footer from "../components/Home/Footer";
import HiringProcess from "../components/Home/HiringProcess";
import "../app/globals.css";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />
      {/* Hero Section */}
      <HeroSection />
      {/*--- logo marquee ---*/}
      <CompaniesLogoMarquee />
      {/* Features Section */}
      <Features />
      {/* Hiring Process */}
      <HiringProcess />
      {/*-- review --*/}
      <Review />
      {/*---- faq ----*/}
      <Faq />
      {/* CTA Section */}
      {/* <CTA /> */}
      {/* Footer */}
      <Footer />
    </div>
  );
}
