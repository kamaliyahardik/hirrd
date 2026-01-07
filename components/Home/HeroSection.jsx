import React from 'react'
import Image from "next/image";

const HeroSection = () => {
  return (
   <>
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
   </>
  )
}

export default HeroSection