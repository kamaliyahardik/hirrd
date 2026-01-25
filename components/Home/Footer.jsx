import React from 'react'
import AnimatedContent from "@/components/AnimatedContent";
import {TwitterIcon, LinkedinIcon, InstagramIcon, Github, Mail } from "lucide-react"
import Image from "next/image";


const Footer = () => {
  return (
    <>
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
                        <p className="text-black mt-4 pb-6">For further assistance or additional inquiries, feel free to <a className='hover:underline text-lg' href="mailto:hirrd.help@gmail.com" target='_blank'>contact us</a></p>
                    </AnimatedContent>
                    <div>
                        <p className="uppercase font-semibold text-black text-base">Social</p>
                        <AnimatedContent className="flex flex-col mt-6 gap-3">
                            <a href="https://x.com/hardik_kamliyaa" className="flex items-center gap-2 text-black">
                                <TwitterIcon size={20} />
                                <p>Twitter</p>
                            </a>
                            <a href="https://www.linkedin.com/in/hardik-kamaliya/" className="flex items-center gap-2 text-black">
                                <LinkedinIcon size={20} />
                                <p>Linkedin</p>
                            </a>
                            <a href="https://www.instagram.com/hardik.kamaliya_" className="flex items-center gap-2 text-black">
                                <InstagramIcon size={20} />
                                <p>Instagram</p>
                            </a>
                            <a href="https://github.com/kamaliyahardik/hirrd" className="flex items-center gap-2 text-black" target="_blank">
                                <Github size={20} />
                                <p>GitHub</p>
                            </a>
                            <a href="mailto:hirrd.help@gmail.com" className="flex items-center gap-2 text-black" target="_blank">
                                <Mail size={20} />
                                <p>Support</p>
                            </a>
                        </AnimatedContent>
                    </div>
                </div>
            </div>
      </footer>
    </>
  )
}

export default Footer