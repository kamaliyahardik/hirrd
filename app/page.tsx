"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ArrowRight,
  Briefcase,
  Users,
  TrendingUp,
  Menu,
  X,
  ArrowUpRightIcon,
  SparkleIcon,
  ShieldCheck,
  BarChart3,
  Globe,
  ArrowRightIcon,
  MousePointerClick,
  Bell,
  InstagramIcon, 
  LinkedinIcon, 
  TwitterIcon
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedContent from "@/components/AnimatedContent";
import SectionTitle from "@/components/SectionTitle";
import Review from "../components/Home/Review"
import Faq from "../components/Home/Faq"
import "../app/globals.css";

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "FAQ", href: "/#faq" },
  ];

  const trustedLogosText = [
    "Google",
    "Microsoft",
    "Amazon",
    "Tata Consultancy Services",
    "Infosys",
    "Reliance Industries",
    "iServeU",
    "Kiran Gems",
    "Larsen & Toubro",
    "Reliance Retail",
    "Flipkart",
    "Zomato",
  ];

  const features = [
    {
      title: "Smart Job Matching",
      description:
        "Our AI-powered algorithm connects you with jobs that perfectly match your skills and career goals.",
      icon: SparkleIcon,
      cardBg: "bg-blue-50",
      iconBg: "bg-blue-500",
    },
    {
      title: "Verified Companies",
      description:
        "Apply with confidence. We verify every company to ensure legitimate and safe job opportunities.",
      icon: ShieldCheck,
      cardBg: "bg-green-50",
      iconBg: "bg-green-500",
    },
    {
      title: "Application Analytics",
      description:
        "Track your job applications and see who viewed your profile with detailed real-time insights.",
      icon: BarChart3,
      cardBg: "bg-purple-50",
      iconBg: "bg-purple-500",
    },
    {
      title: "Global Reach",
      description:
        "Whether you're hiring or looking for work, connect with talent and opportunities worldwide.",
      icon: Globe,
      cardBg: "bg-orange-50",
      iconBg: "bg-orange-500",
    },
    {
      title: "One-Click Apply",
      description:
        "Apply to multiple jobs instantly using your saved profile and resume—no repetitive forms.",
      icon: MousePointerClick,
      cardBg: "bg-emerald-50",
      iconBg: "bg-emerald-500",
    },
    {
      title: "Instant Job Alerts",
      description:
        "Get real-time notifications for new jobs that match your preferences and skills.",
      icon: Bell,
      cardBg: "bg-rose-50",
      iconBg: "bg-rose-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav
        className="fixed top-5 left-0 right-0 z-50 px-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 70 }}
      >
        {/* Navbar container */}
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-black/80 backdrop-blur-md px-4 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-white.png"
                alt="Logo"
                width={150}
                height={50}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-white transition"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-black"
              >
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/30">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden text-gray-300"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/40 backdrop-blur-md text-lg font-medium transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-gray-200 hover:text-white transition"
            >
              {link.name}
            </a>
          ))}

          <Button
            variant="ghost"
            className="text-gray-200 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/auth/login">Login</Link>
          </Button>

          <Button
            className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/30"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/auth/signup">Get Started</Link>
          </Button>

          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md bg-white p-2 text-gray-800"
          >
            <X className="size-6" />
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pb-32 md:pb-44 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center bg-no-repeat text-slate-800 text-sm">
        {/* HERO */}
        <div className="flex flex-col-reverse gap-10 md:flex-row px-4 md:px-16 lg:px-24 xl:px-32 mt-12 md:mt-32">
          {/* LEFT CONTENT */}
          <div className="max-md:text-center pl-15">
            <h1 className="text-4xl md:text-6xl/[76px] font-semibold max-w-xl bg-gradient-to-r from-slate-900 to-[#6D8FE4] text-transparent bg-clip-text">
              Build a Career That Gets You Hired
            </h1>

            <p className="text-sm md:text-base max-w-lg mt-6 text-slate-600">
              Join a trusted job platform connecting skilled professionals with verified companies worldwide.
            </p>

            {/* <div className="flex gap-4 mt-6 max-md:justify-center">
              <button className="px-8 py-3 rounded-md bg-black text-white transition">
                Get Started
              </button>
              <button className="px-5 py-3 rounded-md bg-white text-black border border-black hover:bg-black-50 transition">
                Explore Jobs
              </button>
            </div> */}

            {/* USERS */}
            <div className="flex items-center mt-9 max-md:justify-center">
              <div className="flex -space-x-3.5 pr-3">
                {[
                  "photo-1633332755192-727a05c4013d",
                  "photo-1535713875002-d1d0cf377fde",
                  "photo-1438761681033-6461ffad8d80",
                  "photo-1522075469751-3a6694fb2f61",
                  "photo-1527980965255-d3b416303d12",
                ].map((img, i) => (
                  <Image
                    key={i}
                    src={`https://images.unsplash.com/${img}?w=200`}
                    alt="user"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white"
                  />
                ))}
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Trusted by 100+ job seekers & recruiters
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full md:max-w-xs lg:max-w-lg">
            <Image
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/users-group.png"
              alt="Users Group"
              width={600}
              height={500}
              priority
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/*--- logo marquee ---*/}
      <motion.section
        className="border-y border-gray-10 bg-white/1 max-md:mt-10"
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full overflow-hidden py-6">
            <div className="flex gap-14 items-center justify-center animate-marquee whitespace-nowrap">
              {trustedLogosText.concat(trustedLogosText).map((logo, i) => (
                <span
                  key={i}
                  className="mx-6 text-sm md:text-base font-semibold text-gray-400 hover:text-black tracking-wide transition-colors cursor-pointer"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 border-x md:divide-x border-gray-200 divide-gray-200 max-w-7xl mx-auto">
          <div>
            <div className="p-4 pt-16 md:p-16 flex flex-col items-start md:sticky md:top-26">
              <SectionTitle
                dir="left"
                icon={SparkleIcon}
                title="Core features"
                subtitle="Everything you need to build, deploy and scale AI agents - designed for speed, reliability and real-world production use."
              />
              <AnimatedContent className="p-4 md:p-6 bg-black w-full rounded-xl mt-12">
                <p className="text-lg text-white">
                  Trusted by teams building intelligent products with AI agents.
                </p>

                <a
                  href="#"
                  className="bg-white w-max hover:bg-gray-100 px-5 py-2 rounded-full mt-6 flex items-center gap-1"
                >
                  Explore
                  <ArrowUpRightIcon size={20} />
                </a>
              </AnimatedContent>
            </div>
          </div>
          <div className="p-4 pt-16 md:p-16 space-y-6">
            {features.map((feature, index) => (
              <AnimatedContent
                key={index}
                className={`${feature.cardBg} flex flex-col items-start p-6 rounded-xl w-full md:sticky md:top-26`}
              >
                <div className={`${feature.iconBg} p-2 text-white rounded-md`}>
                  <feature.icon />
                </div>
                <p className="text-base font-medium mt-4">{feature.title}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {feature.description}
                </p>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
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
      </section>

      {/*-- review --*/}
      <Review />

      {/*---- faq ----*/}
      <Faq />
      
      {/* CTA Section */}
      <section className="py-20 2xl:pb-32 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
            <div className="relative z-10">
              <motion.h2
                className="text-2xl sm:text-4xl font-semibold mb-6"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 70,
                  mass: 1,
                }}
              >
                Ready to grow your career or hire faster?
              </motion.h2>
              <motion.p
                className="max-sm:text-sm text-slate-400 mb-10 max-w-xl mx-auto"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 70,
                  mass: 1,
                  delay: 0.2,
                }}
              >
                Partner with Hirrd to connect with verified talent and opportunities that deliver real results.
              </motion.p>
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 70,
                  mass: 1,
                  delay: 0.3,
                }}
              >
                <Button className="px-8 py-3 gap-2">
                  Get Started <ArrowRightIcon size={20} />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-16 lg:px-24 xl:px-32">
            <div className="border-x border-gray-200 px-4 md:px-12 max-w-7xl mx-auto pt-40">
                <div className="flex flex-col md:flex-row items-start justify-between relative p-8 md:p-12 overflow-hidden pb-32 md:pb-42 rounded-t-2xl">
                    <Image
                        src="/logo-dark.png"
                        alt="Logo"
                        width={135}
                        height={35}
                        className="h-62 w-auto absolute -bottom-18 opacity-7 select-none pointer-events-none"
                    />
                    <AnimatedContent distance={40} className="max-w-72">
                        <Image
                            src="/logo-dark.png"
                            alt="Logo"
                            width={135}
                            height={40}
                            className="h-9"
                        />
                        <p className="text-black mt-4 pb-6">For further assistance or additional inquiries, feel free to contact us</p>
                    </AnimatedContent>
                    <div>
                        <p className="uppercase font-semibold text-black text-base">Social</p>
                        <AnimatedContent className="flex flex-col mt-6 gap-3">
                            <a href="https://prebuiltui.com?ref=buildify" className="flex items-center gap-2 text-black">
                                <TwitterIcon size={20} />
                                <p>Twitter</p>
                            </a>
                            <a href="https://prebuiltui.com?ref=buildify" className="flex items-center gap-2 text-black">
                                <LinkedinIcon size={20} />
                                <p>Linkedin</p>
                            </a>
                            <a href="https://prebuiltui.com?ref=buildify" className="flex items-center gap-2 text-black">
                                <InstagramIcon size={20} />
                                <p>Instagram</p>
                            </a>
                        </AnimatedContent>
                    </div>
                </div>
            </div>
        </footer>
    </div>
  );
}
