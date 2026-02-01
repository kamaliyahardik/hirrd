"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import GitHubStar from "@/components/Home/GitHubStar"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (authUser) {
          const { data: userData } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", authUser.id)
            .single();
          setUser({ ...authUser, full_name: userData?.full_name });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const navLinks = [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
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

            {/* github star btn */}
            <GitHubStar />
            
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? null : user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:text-white font-medium"
                  >
                    {user.full_name || "Dashboard"}
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-black cursor-pointer"
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button className="bg-primary shadow-md shadow-primary/30 hover:bg-white hover:text-black">
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </>
              )}
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

          {loading ? null : user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-gray-200 hover:text-white transition"
              >
                {user.full_name || "Dashboard"}
              </Link>
              <Button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                variant="ghost"
                className="text-gray-200 hover:text-white hover:bg-white/10"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md bg-white p-2 text-gray-800"
          >
            <X className="size-6" />
          </button>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
