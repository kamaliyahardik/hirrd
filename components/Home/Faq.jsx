import React from "react";
import { ChevronDownIcon, CircleQuestionMarkIcon } from "lucide-react";
import SectionTitle from "../SectionTitle";
import AnimatedContent from "../AnimatedContent";

const Faq = () => {
  const faqs = [
    {
      question: "What is Hirrd?",
      answer:
        "Hirrd is a job portal that connects job seekers with verified companies",
    },
    {
      question: "Who can use Hirrd?",
      answer:
        "Hirrd is designed for job seekers looking for opportunities and recruiters searching for skilled talent.",
    },
    {
      question: "Is Hirrd free for job seekers?",
      answer:
        "Yes, job seekers can create a profile, browse jobs, and apply for opportunities completely free.",
    },
    {
      question: "How do I get started on Hirrd?",
      answer:
        "First, sign up for an account. Then complete your profile and start applying to matching job openings.",
    },
    {
      question: "Are companies on Hirrd verified?",
      answer:
        "Yes, all companies are reviewed and verified to ensure safe and genuine job opportunities.",
    },
    {
      question: "How do I apply for a job?",
      answer:
        "Open a job listing, click apply, and submit your profile or resume in just a few steps.",
    },
  ];

  return (
    <>
      <section id="faq" className="border-y border-gray-200">
        <div className="px-4 md:px-16 lg:px-24 xl:px-32">
          <div className="p-4 pt-20 md:p-20 flex flex-col items-center max-w-7xl mx-auto justify-center border-x border-gray-200">
            <SectionTitle
              icon={ChevronDownIcon}
              title="Got questions?"
              subtitle="Everything you need to know about Hirrd — from sign-up to getting hired."
            />
          </div>
        </div>
        <div className="px-4 md:px-16 lg:px-24 xl:px-32 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200 border-x border-gray-200 max-w-7xl mx-auto">
            <div className="p-4 pt-20 md:p-20 space-y-6">
              {faqs.map((faq, index) => (
                <AnimatedContent key={index}>
                  <details
                    key={index}
                    className="group bg-gray-50 border border-gray-200 rounded-xl"
                    open={index === 0}
                  >
                    <summary className="flex items-center justify-between p-6 select-none">
                      <h3 className="font-medium text-base">{faq.question}</h3>
                      <ChevronDownIcon
                        size={20}
                        className="group-open:rotate-180"
                      />
                    </summary>
                    <p className="text-sm/6 text-zinc-500 max-w-md p-6 pt-0">
                      {faq.answer}
                    </p>
                  </details>
                </AnimatedContent>
              ))}
            </div>
            <div className="p-4 pt-20 md:p-20">
              <div className="sticky top-30 flex items-center justify-between gap-5 p-6 bg-black w-full rounded-xl mt-12">
                <h3 className="text-lg text-white text-balance">
                  Still have questions? Our team help you get started.
                </h3>

                <a
                  href="https://prebuiltui.com?ref=buildify"
                  className="bg-white w-max shrink-0 hover:bg-gray-100 px-5 py-2 rounded-full"
                >
                  Contact support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Faq;
