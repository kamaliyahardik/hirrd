"use client";

import { useEffect, useRef, useState } from "react";
import React from "react";
import SectionTitle from "@/components/SectionTitle";

type Step = {
  title: string;
  description: string;
};

const leftSteps: Step[] = [
  {
    title: "Create Your Profile or Company Page",
    description:
      "Job seekers build a professional profile with skills and experience, while recruiters create a company page to showcase their brand and open positions.",
  },
  {
    title: "Get Matched Instantly",
    description:
      "Hirrd intelligently matches candidates with relevant jobs and helps recruiters discover qualified talent based on skills and preferences.",
  },
];

const rightSteps: Step[] = [
  {
    title: "Sign Up and Get Started",
    description:
      "Create your free account in minutes. Whether you're looking for a job or hiring talent, Hirrd guides you through a simple setup process.",
  },
  {
    title: "Apply or Post Jobs with One Click",
    description:
      "Job seekers can apply instantly using their saved profile, while recruiters can post jobs and start receiving applications right away.",
  },
];

export default function BuildProcess() {
  // ✅ FIX: null allowed
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [progress, setProgress] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    const handleScroll = () => {
      const updated = segmentRefs.current.map((el) => {
        if (!el) return 0;

        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const start = windowHeight * 0.6;
        const end = windowHeight * 0.2;

        let percent = (start - rect.top) / (start - end);
        percent = Math.min(Math.max(percent, 0), 1);

        return percent;
      });

      setProgress(updated);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section id="process" className="flex flex-col items-center mt-32">
        {/* <p className="font-domine">Simple 4-Step Process</p> */}

        <SectionTitle
          title="Simple 4-Step Process"
          subtitle="Get Hired or Hire Talent in Just Four Simple Steps"
        />

        <div className="flex flex-col md:flex-row mt-20 md:mt-32">
          {/* LEFT */}
          <div>
            {leftSteps.map((step, index) => (
              <div key={index} className="max-w-lg h-60 md:mt-60">
                <h3 className="text-xl underline font-domine">{step.title}</h3>
                <p className="mt-6 text-gray-500 text-sm/6">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* CENTER LINE */}
          <div className="hidden md:flex flex-col items-center">
            <div className="size-4 bg-gray-800" />

            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  ref={(el) => {
                    segmentRefs.current[i] = el;
                  }}
                  className="relative w-0.5 mx-10 h-60 bg-gray-300 overflow-hidden"
                >
                  <div
                    style={{ height: `${progress[i] * 100}%` }}
                    className="absolute top-0 left-0 w-full bg-gray-800"
                  />
                </div>

                <div
                  className={`size-4 ${
                    progress[i] > 0.95 ? "bg-gray-800" : "bg-gray-300"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div>
            {rightSteps.map((step, index) => (
              <div
                key={index}
                className={`max-w-lg h-60 ${index === 0 ? "" : "md:mt-60"}`}
              >
                <h3 className="text-xl underline font-domine">{step.title}</h3>
                <p className="mt-6 text-gray-500 text-sm/6">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
