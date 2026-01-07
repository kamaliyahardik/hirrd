import React from 'react'
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {ArrowRightIcon} from "lucide-react"

const CTA = () => {
  return (
    <>
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
    </>
  )
}

export default CTA