import React from "react";

const Review = () => {
  const reviewData = [
  {
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    name: "Rahul Patel",
    role: "Frontend Developer",
    review:
      "I got interview calls within a week. Very easy to use and relevant job matches.",
    date: "April 20, 2025",
  },
  {
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    name: "Neha Shah",
    role: "HR Manager",
    review:
      "We hired quality candidates quickly. Verified profiles saved us a lot of time.",
    date: "May 10, 2025",
  },
  {
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    name: "Amit Desai",
    role: "Backend Developer",
    review:
      "Job alerts are very accurate. Much better than other job portals.",
    date: "June 5, 2025",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    name: "Pooja Mehta",
    role: "Digital Marketing Executive",
    review:
      "One-click apply feature is a game changer. Highly recommended!",
    date: "June 18, 2025",
  },
];


  const CreateCard = ({ card }) => (
  <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 bg-white">
    <div className="flex gap-2">
      <img className="size-11 rounded-full" src={card.image} alt={card.name} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <p className="font-medium">{card.name}</p>

          {/* Verified badge */}
          <svg
            className="mt-0.5"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.555.72..."
              fill="#2196F3"
            />
            <path
              d="M4.9 6.3 4 5.4..."
              fill="#fff"
            />
          </svg>
        </div>

        {/* Role / Location */}
        <span className="text-xs text-slate-500">
          {card.role}
        </span>
      </div>
    </div>

    {/* Review text (dynamic) */}
    <p className="text-sm py-4 text-gray-800">
      “{card.review}”
    </p>

    <div className="flex items-center justify-between text-slate-500 text-xs">
      <p>{card.date}</p>
    </div>
  </div>
);

  return (
    <>
      <style>{`
  @keyframes marqueeScroll {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }

  .marquee-inner {
    animation: marqueeScroll 10s linear infinite;
  }

  .marquee-reverse {
    animation-direction: reverse;
  }

  .marquee-inner:hover {
    animation-play-state: paused;
  }
`}</style>

      <div className="w-full max-w-5xl mx-auto overflow-hidden">
        <div className="marquee-inner flex min-w-[200%] pt-10 pb-5">
          {[...reviewData, ...reviewData].map((card, i) => (
            <CreateCard key={i} card={card} />
          ))}
        </div>

        <div className="marquee-inner marquee-reverse flex min-w-[200%] pt-10 pb-5">
          {[...reviewData, ...reviewData].map((card, i) => (
            <CreateCard key={i} card={card} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Review;
