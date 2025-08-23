/** @jsxImportSource @emotion/react */
import React from "react";
import { Link } from "react-router-dom";
import { FaBook, FaTheaterMasks, FaBullseye, FaGlobe } from "react-icons/fa";
import { css, keyframes } from "@emotion/react";
import { PATHS } from "../constant/pathnames";

// Keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const flameBurst = keyframes`
  0% { height: 0; opacity: 0; transform: scale(0.5); }
  50% { height: 30px; opacity: 0.9; transform: scale(1); }
  100% { height: 0; opacity: 0; transform: scale(0.5); }
`;
const breathe = keyframes`
  0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(255,215,0,0)); }
  50% { transform: scale(1.2); filter: drop-shadow(0 0 12px rgba(255,215,0,0.9)); }
  100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(255,215,0,0)); }
`;
const spark = keyframes`
  0% { transform: translate(0, 0); opacity: 0; }
  50% { opacity: 0.8; }
  100% { transform: translate(50px, -50px); opacity: 0; }
`;
const comet = keyframes`
  0% { transform: translate(0, 0); opacity: 0.2; }
  50% { opacity: 0.5; }
  100% { transform: translate(200px, -200px); opacity: 0; }
`;
const flameTrail = keyframes`
  0% { width: 0; opacity: 0.3; }
  50% { width: 100%; opacity: 0.8; }
  100% { width: 0; opacity: 0.3; }
`;

const ExploreEvents = () => {
  const buttons = [
    {
      to: PATHS.ACADEMIC_EVENTS,
      icon: (
        <FaBook
          className="mr-2 text-xl group-hover:animate-[breathe_0.5s_ease-in-out]"
          css={css`
            color: #ffffff;
          `}
        />
      ),
      label: "Sự kiện học thuật",
      bgColor:
        "bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700",
      flameColor: "bg-gradient-to-b from-blue-400 to-transparent",
      shadowColor: "group-hover:shadow-[0_0_30px_rgba(79,70,229,1)]",
      ariaLabel: "Khám phá Sự kiện Học thuật"
    },
    {
      to: "/entertainment-events", // Thay bằng PATHS.ENTERTAINMENT_EVENTS nếu có
      icon: (
        <FaTheaterMasks
          className="mr-2 text-xl group-hover:animate-[breathe_0.5s_ease-in-out]"
          css={css`
            color: #ffffff;
          `}
        />
      ),
      label: "Sự kiện giải trí",
      bgColor:
        "bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600",
      flameColor: "bg-gradient-to-b from-orange-400 to-transparent",
      shadowColor: "group-hover:shadow-[0_0_30px_rgba(249,115,22,1)]",
      ariaLabel: "Khám phá Sự kiện Giải trí"
    },
    {
      to: "/drl", // Thay bằng PATHS.DRL nếu có
      icon: (
        <FaBullseye
          className="mr-2 text-xl group-hover:animate-[breathe_0.5s_ease-in-out]"
          css={css`
            color: #ffffff;
          `}
        />
      ),
      label: "Lộ trình ĐRL",
      bgColor:
        "bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600",
      flameColor: "bg-gradient-to-b from-teal-400 to-transparent",
      shadowColor: "group-hover:shadow-[0_0_30px_rgba(13,148,136,1)]",
      ariaLabel: "Khám phá Lộ trình Điểm rèn luyện",
      tooltip: "AI thắp sáng hành trình tích điểm"
    },
    {
      to: "/events", // Thay bằng PATHS.ALL_EVENTS nếu có
      icon: (
        <FaGlobe
          className="mr-2 text-xl group-hover:animate-[breathe_0.5s_ease-in-out] group-hover:rotate-12"
          css={css`
            color: #ffffff;
          `}
        />
      ),
      label: "Tất cả sự kiện",
      bgColor:
        "bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600",
      flameColor: "bg-gradient-to-b from-yellow-400 to-transparent",
      shadowColor: "group-hover:shadow-[0_0_30px_rgba(34,197,94,1)]",
      ariaLabel: "Khám phá Tất cả Sự kiện"
    }
  ];

  return (
    <section
      className="mb-8 relative bg-gradient-to-r from-indigo-900 via-blue-800 to-purple-900 rounded-xl p-6 overflow-hidden"
      css={css`
        background-size: 200% 100%;
        animation: ${gradientShift} 15s ease-in-out infinite;
      `}
      role="region"
      aria-label="Khám phá Sự kiện"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.3),transparent_70%)]"
        css={css`
          animation: ${breathe} 5s ease-in-out infinite;
        `}
      ></div>
      <div
        className="absolute top-0 left-0 w-5 h-5 bg-white/70 rounded-full"
        css={css`
          animation: ${spark} 4s ease-in-out infinite;
        `}
      ></div>
      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-white/70 rounded-full"
        css={css`
          animation: ${spark} 5s ease-in-out infinite 1s;
        `}
      ></div>
      <div
        className="absolute top-10 left-10 w-6 h-6 bg-white/70 rounded-full"
        css={css`
          animation: ${spark} 3s ease-in-out infinite 0.5s;
        `}
      ></div>
      <div
        className="absolute top-0 left-0 w-8 h-2 bg-white/50 rounded-full"
        css={css`
          animation: ${comet} 10s ease-in-out infinite;
        `}
      ></div>
      <h2
        className="text-2xl md:text-3xl font-bold text-white mb-2 text-center"
        css={css`
          animation: ${fadeIn} 1s ease-out;
        `}
      >
        Tỏa sáng cùng UniFlow
      </h2>
      <p
        className="text-sm text-gray-200 mb-5 text-center max-w-md mx-auto font-medium"
        css={css`
          animation: ${fadeIn} 1s ease-out 0.2s;
          animation-fill-mode: both;
        `}
      >
        Khám phá sự kiện và lộ trình tích điểm được AI thắp sáng cho hành trình
        của bạn.
      </p>
      <div className="relative flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-gradient-to-r from-indigo-300 to-yellow-300 opacity-0 group-hover:opacity-100"
          css={css`
            animation: ${flameTrail} 2s ease-in-out infinite;
          `}
        ></div>
        {buttons.map((button, index) => (
          <div key={index} className="group relative">
            <Link
              to={button.to}
              className={`w-[260px] py-3 px-6 ${button.bgColor} text-white rounded-full font-bold text-base ${button.shadowColor} transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-3 hover:rotate-x-5 hover:rotate-y-5 flex items-center justify-center whitespace-nowrap relative overflow-hidden`}
              aria-label={button.ariaLabel}
              css={css`
                animation: ${fadeIn} 1s ease-out ${0.3 + index * 0.1}s;
                animation-fill-mode: both;
                background-size: 200% 100%;
                animation: ${gradientShift} 2s ease-in-out infinite;
                transform-style: preserve-3d;
                perspective: 1000px;
              `}
              onClick={() => console.log(`Navigating to: ${button.to}`)}
            >
              <span
                className={`absolute bottom-full left-1/2 -translate-x-1/2 w-10 ${button.flameColor} opacity-0 group-hover:opacity-100`}
                css={css`
                  animation: ${flameBurst} 1.2s ease-in-out infinite;
                  ${button.label === "Tất cả sự kiện" ? "width: 14px;" : ""}
                `}
              ></span>
              {button.icon}
              {button.label}
            </Link>
            {button.tooltip && (
              <span
                className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs text-gray-800 bg-white/95 rounded-md px-2 py-1 shadow-sm border border-teal-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                css={css`
                  animation: ${fadeIn} 0.3s ease-out;
                `}
              >
                {button.tooltip}
              </span>
            )}
            {button.label === "Lộ trình ĐRL" && (
              <span
                className="absolute -top-2 -right-2 bg-yellow-300 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow-sm"
                css={css`
                  animation: ${breathe} 1.5s ease-in-out infinite;
                `}
              >
                AI Thắp sáng
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreEvents;
