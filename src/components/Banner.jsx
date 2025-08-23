/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Danh sách hình ảnh cho carousel (sử dụng URL mới để đảm bảo hiển thị)
const bannerImages = [
  // Hội thảo học thuật
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2070&auto=format&fit=crop",

  // Workshop nhóm sinh viên / startup
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2070&auto=format&fit=crop",

  // Sự kiện trong giảng đường / hội trường
  "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?q=80&w=2070&auto=format&fit=crop"
]


const Banner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Tự động chuyển đổi hình ảnh mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Tính toán đếm ngược đến ngày sự kiện (11/10/2025 08:00)
  useEffect(() => {
    const eventDate = new Date("2025-10-11T08:00:00+07:00").getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Xử lý khi người dùng nhấn vào nút điều hướng
  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative h-[450px] w-full flex items-center justify-center text-center overflow-hidden bg-gray-900">
      {/* Hình ảnh carousel với hiệu ứng fade */}
      {bannerImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
        >
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)"
            }}
          />
          <img
            src={image}
            alt={`Banner ${index + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://placehold.co/1200x450";
            }}
          />
        </div>
      ))}

      {/* Nội dung banner */}
      <div className="relative z-20 text-white px-6 max-w-4xl mx-auto drop-shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
          Hackathon AI HIU 2025
        </h1>
        <p className="text-lg md:text-xl mb-4 font-medium tracking-wide">
          11-10-2025 | 08:00 - 18:00 | HIU, TP.HCM
        </p>

        {/* Đếm ngược thời gian với thiết kế thư viện */}
        <div className="flex justify-center gap-4 mb-6 bg-gray-800/50 backdrop-blur-sm rounded-xl py-3 px-6 shadow-lg">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-teal-400">
              {timeLeft.days}
            </span>
            <span className="text-sm font-medium">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-teal-400">
              {timeLeft.hours}
            </span>
            <span className="text-sm font-medium">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-teal-400">
              {timeLeft.minutes}
            </span>
            <span className="text-sm font-medium">Minutes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-teal-400">
              {timeLeft.seconds}
            </span>
            <span className="text-sm font-medium">Seconds</span>
          </div>
        </div>

        {/* Nút hành động với thiết kế thư viện */}
        <div className="flex justify-center gap-4 mb-4">
          <Link
            to="/register/hackathon-ai-hiu-2025"
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Đăng ký ngay
          </Link>
          <Link
            to="/event/hackathon-ai-hiu-2025"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Chi tiết
          </Link>
        </div>

        <p className="text-base md:text-lg font-medium">
          Phát triển ứng dụng AI. Tặng 5 ĐRL nếu đội chiến thắng. Đăng ký ngay!
        </p>
      </div>

      {/* Nút điều hướng carousel */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 text-white bg-gray-800/50 hover:bg-gray-800/70 p-2 rounded-full transition-all duration-300"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 text-white bg-gray-800/50 hover:bg-gray-800/70 p-2 rounded-full transition-all duration-300"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Thanh footer của banner */}
      <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-gray-800 to-transparent flex items-center justify-center z-20">
        <span className="text-2xl font-bold text-white tracking-wide drop-shadow-md">
          HONG BANG INTERNATIONAL
        </span>
      </div>
    </div>
  );
};

export default Banner;
