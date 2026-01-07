"use client";

import React from 'react'
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';



const Navbar = () => {
      const [isOpen, setIsOpen] = useState(false);
    const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "FAQ", href: "/#faq" },
  ];
  return (
    <>
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
    </>
  )
}

export default Navbar