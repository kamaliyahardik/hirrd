import React from 'react'
import SectionTitle from "@/components/SectionTitle";
import AnimatedContent from "@/components/AnimatedContent";
import {SparkleIcon, ArrowUpRightIcon, ShieldCheck, BarChart3, Globe, MousePointerClick, Bell} from "lucide-react";

const Features = () => {
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
    <>
    <section className="px-4 md:px-16 lg:px-24 xl:px-32">
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
    </>
  )
}

export default Features