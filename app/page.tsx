"use client";

import Navbar from "../components/Home/Navbar";
import HeroSection from "../components/Home/HeroSection";
import CompaniesLogoMarquee from "../components/Home/CompaniesLogoMarquee";
import Features from "../components/Home/Features";
import Review from "../components/Home/Review";
import Faq from "../components/Home/Faq";
import CTA from "../components/Home/CTA";
import Footer from "../components/Home/Footer";
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
      {/*-- review --*/}
      <Review />
      {/*---- faq ----*/}
      <Faq />
      {/* CTA Section */}
      <CTA />
      {/* Footer */}
      <Footer />

      {/* How It Works
      <section
        id="how-it-works"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-primary min-w-fit">1</div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Create Your Account
                </h3>
                <p className="text-muted-foreground">
                  Sign up as a job seeker or recruiter in minutes.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-primary min-w-fit">2</div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Set Up Your Profile
                </h3>
                <p className="text-muted-foreground">
                  Add your skills, experience, and preferences.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-primary min-w-fit">3</div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Connect & Grow
                </h3>
                <p className="text-muted-foreground">
                  Start applying to jobs or post positions for your company.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-muted rounded-2xl aspect-square flex items-center justify-center border border-border">
            <TrendingUp className="w-20 h-20 text-primary/30" />
          </div>
        </div>
      </section> */}
    </div>
  );
}
