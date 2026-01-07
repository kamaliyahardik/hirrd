import React from 'react'
import { motion } from "framer-motion";


const CompaniesLogoMarquee = () => {
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
  return (
    <>
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
    </>
  )
}

export default CompaniesLogoMarquee