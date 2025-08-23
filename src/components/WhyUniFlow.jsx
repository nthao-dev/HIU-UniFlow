/** @jsxImportSource @emotion/react */
import React from "react";
import { Link } from "react-router-dom";
import {
  FaRobot,
  FaBullseye,
  FaFilm,
  FaQrcode,
  FaChartBar
} from "react-icons/fa";
import { css, keyframes } from "@emotion/react";

// Keyframes for animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseGlow = keyframes`
  0% {
    transform: scale(1);
    filter: brightness(100%) drop-shadow(0 0 0 rgba(0, 0, 0, 0));
  }
  50% {
    transform: scale(1.1);
    filter: brightness(120%) drop-shadow(0 0 8px currentColor);
  }
  100% {
    transform: scale(1);
    filter: brightness(100%) drop-shadow(0 0 0 rgba(0, 0, 0, 0));
  }
`;

const WhyUniFlow = () => {
  const features = [
    {
      icon: (
        <FaRobot className="text-indigo-600 text-4xl mb-3 animate-[pulseGlow_2s_ease-in-out_infinite]" />
      ),
      title: "AI Cá nhân hóa",
      description:
        "AI đề xuất sự kiện phù hợp, tối ưu tương tác và kết nối cộng đồng dựa trên sở thích cá nhân.",
      link: "/ai",
      linkText: "Khám phá ngay",
      color: "indigo",
      bgColor: "bg-indigo-500",
      hoverBgColor: "hover:bg-indigo-600",
      textColor: "text-indigo-700",
      borderColor: "border-indigo-200",
      gradient: "bg-gradient-to-br from-indigo-50 to-white"
    },
    {
      icon: (
        <FaBullseye className="text-orange-500 text-4xl mb-3 animate-[pulseGlow_2s_ease-in-out_infinite]" />
      ),
      title: "Quản lý ĐRL",
      description:
        "Hỗ trợ sinh viên tối ưu điểm rèn luyện. Nhà trường quản lý hiệu quả qua bảng điều khiển trực quan.",
      link: "/drl",
      linkText: "Tìm hiểu thêm",
      color: "orange",
      bgColor: "bg-orange-500",
      hoverBgColor: "hover:bg-orange-600",
      textColor: "text-orange-700",
      borderColor: "border-orange-200",
      gradient: "bg-gradient-to-br from-orange-50 to-white"
    },
    {
      icon: (
        <FaFilm className="text-purple-500 text-4xl mb-3 animate-[pulseGlow_2s_ease-in-out_infinite]" />
      ),
      title: "Đặt ghế Tương tác",
      description:
        "Hệ thống đặt ghế trực quan, gợi ý vị trí tốt nhất dựa trên sở thích cho các sự kiện.",
      link: "/booking",
      linkText: "Đặt ghế ngay",
      color: "purple",
      bgColor: "bg-purple-500",
      hoverBgColor: "hover:bg-purple-600",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      gradient: "bg-gradient-to-br from-purple-50 to-white"
    },
    {
      icon: (
        <FaQrcode className="text-indigo-600 text-4xl mb-3 animate-[pulseGlow_2s_ease-in-out_infinite]" />
      ),
      title: "Check-in QR",
      description:
        "Check-in nhanh qua mã QR, tiết kiệm thời gian, tích hợp báo cáo tham dự tự động.",
      link: "/events",
      linkText: "Thử ngay",
      color: "indigo",
      bgColor: "bg-indigo-500",
      hoverBgColor: "hover:bg-indigo-600",
      textColor: "text-indigo-700",
      borderColor: "border-indigo-200",
      gradient: "bg-gradient-to-br from-indigo-50 to-white"
    },
    {
      icon: (
        <FaChartBar className="text-teal-500 text-4xl mb-3 animate-[pulseGlow_2s_ease-in-out_infinite]" />
      ),
      title: "Phân tích Dữ liệu",
      description:
        "Báo cáo chi tiết về sự kiện và điểm rèn luyện, hỗ trợ nhà trường ra quyết định chiến lược.",
      link: "/analytics",
      linkText: "Xem báo cáo",
      color: "teal",
      bgColor: "bg-teal-500",
      hoverBgColor: "hover:bg-teal-600",
      textColor: "text-teal-700",
      borderColor: "border-teal-200",
      gradient: "bg-gradient-to-br from-teal-50 to-white"
    }
  ];

  return (
    <section
      className="py-12 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      role="region"
      aria-label="Why UniFlow Section"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-6 tracking-tight animate-[fadeInUp_1s_ease-out]">
          Vì sao chọn UniFlow?
        </h2>
        <p className="text-base text-gray-700 mb-8 text-center max-w-2xl mx-auto leading-relaxed">
          UniFlow hiện đại hóa quản lý sự kiện, điểm rèn luyện và phân tích dữ
          liệu, kết nối sinh viên và nhà trường hiệu quả.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.gradient} rounded-xl p-5 text-center shadow-md ${feature.borderColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 min-h-[280px] flex flex-col justify-between animate-[fadeInUp_1s_ease-out]`}
              css={css`
                animation-delay: calc(0.2s * ${index});
              `}
              role="article"
              aria-label={feature.title}
            >
              {feature.icon}
              <h3
                className={`text-lg font-bold ${feature.textColor} mb-3 uppercase tracking-wider`}
              >
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-grow">
                {feature.description}
              </p>
              <Link
                to={feature.link}
                className={`${feature.bgColor} ${feature.hoverBgColor} text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 w-[160px] mx-auto text-sm focus:ring-2 focus:ring-${feature.color}-200`}
                aria-label={`Tìm hiểu thêm về ${feature.title}`}
              >
                {feature.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUniFlow;
