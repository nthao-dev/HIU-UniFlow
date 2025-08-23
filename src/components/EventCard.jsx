import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate
import JSConfetti from "js-confetti";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaRobot,
  FaFacebook,
  FaVideo,
  FaChair,
  FaHeart,
  FaShareAlt,
  FaInfoCircle
} from "react-icons/fa";

import { PATHS } from "../../src/constant/pathnames";

const EventCard = ({ event, showAIBadge = false, onTagClick = () => { } }) => {

  const navigate = useNavigate(); // Khởi tạo useNavigate

  // Chuyển đổi thời gian
  const formattedTime = new Date(event.time).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  // Xác định thuộc tính
  const isOnline = event.isOnline || event.location.toLowerCase() === "online";
  const hasSeating = event.hasSeating || false;
  const availableSeats = event.availableSeats || (hasSeating ? 50 : 0);
  const totalSeats = hasSeating ? 50 : 0;
  const platform = isOnline ? event.platform || "Zoom" : null;
  const isSoldOut = hasSeating && !isOnline && availableSeats === 0;

  // Trạng thái yêu thích
  const [isFavorite, setIsFavorite] = useState(false);

  // Đếm ngược thời gian
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const eventTime = new Date(event.time);
      const diff = eventTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ days, hours, minutes });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, [event.time]);

  // Xác định màu border và gradient
  const getBorderAndGradient = () => {
    if (event.tags.includes("học tập"))
      return {
        border: "border-blue-300",
        gradient: "from-blue-400 to-blue-600"
      };
    if (event.tags.includes("giải trí") || event.tags.includes("festival"))
      return {
        border: "border-pink-300",
        gradient: "from-pink-400 to-pink-600"
      };
    if (event.tags.includes("thiện nguyện"))
      return {
        border: "border-green-300",
        gradient: "from-green-400 to-green-600"
      };
    return {
      border: "border-yellow-300",
      gradient: "from-yellow-400 to-yellow-600"
    };
  };

  const { border, gradient } = getBorderAndGradient();

  // Xác định icon cho platform
  const getPlatformIcon = () => {
    if (!isOnline) return null;
    if (platform.toLowerCase() === "facebook") {
      return <FaFacebook className="mr-2 w-5 h-5 text-blue-600" />;
    }
    if (platform.toLowerCase() === "google meet") {
      return <FaVideo className="mr-2 w-5 h-5 text-green-600" />;
    }
    return <FaVideo className="mr-2 w-5 h-5 text-blue-500" />;
  };

  // Xử lý chia sẻ
  const handleShare = () => {
    const shareUrl =
      event.readMoreUrl !== "#"
        ? event.readMoreUrl
        : `${window.location.origin}/event/${event.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Đã sao chép link sự kiện!");
    });
  };

  // Xử lý nhấn "Xem thêm"
  const handleViewMore = () => {
    const targetUrl = PATHS.EVENT_DETAIL.replace(":eventId", event.id);
    console.log("Navigating to:", targetUrl); // Debug
    navigate(targetUrl);
  };

  // Xử lý nhấn "Đăng ký ngay"/"Tham gia ngay"/"Mua vé"
  const handleRegister = () => {
    if (isSoldOut) return;
    const targetUrl =
      event.readMoreUrl && event.readMoreUrl !== "#"
        ? event.readMoreUrl
        : PATHS.EVENT_DETAIL.replace(":eventId", event.id);
    console.log("Register navigating to:", targetUrl); // Debug
    if (targetUrl.startsWith("http")) {
      window.open(targetUrl, "_blank"); // Mở link bên ngoài
    } else {
      navigate(targetUrl); // Chuyển hướng nội bộ
    }
  };

  return (
    <div
      className={`relative bg-white backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-glow transform transition-all duration-500 border-l-8 ${border} ${showAIBadge ? "ring-4 ring-blue-200/50 animate-pulse-subtle" : ""
        } ${isSoldOut ? "filter grayscale" : ""
        } overflow-hidden max-w-sm mx-auto`}
    >
      {/* Ảnh sự kiện */}
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-60 object-cover rounded-t-3xl"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x200";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent rounded-t-3xl" />
        <h3
          className={`absolute bottom-4 left-4 text-white text-2xl font-extrabold line-clamp-2 drop-shadow-xl tracking-tight bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400 animate-gradient`}
        >
          {event.title}
        </h3>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 left-4 p-3 rounded-full bg-white/95 hover:bg-white transition-colors duration-300 shadow-lg animate-shake"
        >
          <FaHeart
            className={`w-6 h-6 ${isFavorite ? "text-red-500" : "text-gray-500"
              }`}
          />
        </button>
      </div>

      {/* Nội dung card */}
      <div className="p-6 space-y-4">
        {/* Badge */}
        {(showAIBadge || hasSeating || isOnline) && (
          <span
            className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold flex items-center transition-all duration-300 shadow-md ${showAIBadge
              ? "bg-gradient-to-r from-blue-300 to-pink-300 text-blue-900 animate-pulse"
              : isOnline
                ? "bg-purple-100 text-purple-900"
                : isSoldOut
                  ? "bg-red-400 text-white"
                  : "bg-blue-100 text-blue-900"
              }`}
          >
            {showAIBadge ? (
              <>
                <FaRobot className="mr-2 w-5 h-5" /> AI Gợi ý
              </>
            ) : isOnline ? (
              <>
                {getPlatformIcon()} {platform}
              </>
            ) : isSoldOut ? (
              "Cháy vé"
            ) : (
              <>
                <FaChair className="mr-2 w-5 h-5" /> Có đặt chỗ
              </>
            )}
          </span>
        )}

        {/* Thanh tiến độ chỗ ngồi */}
        {hasSeating && !isOnline && (
          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${gradient} transition-all duration-1000`}
              style={{ width: `${(availableSeats / totalSeats) * 100}%` }}
            />
          </div>
        )}

        {/* Thông tin sự kiện */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FaCalendar className="text-blue-500 w-6 h-6" />
            <p className="text-sm text-gray-800 font-semibold">
              {formattedTime}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-blue-500 w-6 h-6" />
            <p className="text-sm text-gray-800 font-semibold">
              {event.location}
            </p>
          </div>
          {hasSeating && !isOnline && (
            <p className="text-sm text-gray-800 font-semibold">
              <span className="font-bold">Đặt chỗ:</span>{" "}
              {isSoldOut ? "Cháy vé" : `${availableSeats}/${totalSeats} chỗ`}
            </p>
          )}
          {isOnline && (
            <p className="text-sm text-gray-800 font-semibold flex items-center">
              <span className="font-bold">Hình thức:</span> {getPlatformIcon()}{" "}
              {platform}
            </p>
          )}
          {!hasSeating && !isOnline && (
            <p className="text-sm text-gray-800 font-semibold">
              <span className="font-bold">Đặt chỗ:</span> Không
            </p>
          )}
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
            {event.description}
          </p>
          {/* Countdown Circle */}
          <div className="flex items-center gap-3">
            <svg className="w-12 h-12">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="gray"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="url(#gradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="125.6"
                strokeDashoffset={
                  timeLeft.days > 0 ? 0 : 125.6 - (timeLeft.hours / 24) * 125.6
                }
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <p className="text-sm text-blue-600 font-bold">
              {timeLeft.days > 0
                ? `${timeLeft.days} ngày`
                : `${timeLeft.hours} giờ ${timeLeft.minutes} phút`}
            </p>
          </div>
          <p
            className={`text-sm ${event.drlPoints ? "text-green-600 font-bold" : "text-gray-600"
              }`}
          >
            <span className="font-bold">ĐRL:</span>{" "}
            {event.drlPoints
              ? `+${event.drlPoints} điểm (Tiêu chí ${event.drlCriteria})`
              : "Không có"}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-6 ${tag === "học tập"
                ? "bg-blue-100 text-blue-800"
                : tag === "giải trí" || tag === "festival"
                  ? "bg-pink-100 text-pink-800"
                  : tag === "thiện nguyện"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleRegister}
            className={`flex-1 px-5 py-3 rounded-lg text-sm text-center font-bold transition-all duration-300 shadow-lg animate-shake ${isSoldOut
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : `bg-gradient-to-r ${gradient} text-white hover:bg-gradient-to-r hover:from-opacity-80 hover:to-opacity-80`
              }`}
            disabled={isSoldOut}
          >
            {isOnline
              ? "Tham gia ngay"
              : event.tags.includes("giải trí") ||
                event.tags.includes("festival")
                ? "Mua vé"
                : "Đăng ký ngay"}
          </button>
          {isSoldOut && (
            <button
              onClick={() => navigate(`/event/${event.id}/waitlist`)}
              className="px-5 py-3 rounded-lg text-sm text-center bg-yellow-300 text-yellow-900 hover:bg-yellow-400 transition-colors duration-300 font-bold shadow-lg animate-shake"
            >
              Danh sách chờ
            </button>
          )}
          {hasSeating && !isOnline && !isSoldOut && (
            <button
              onClick={() => navigate(`/event/${event.id}/seating`)}
              className="px-5 py-3 rounded-lg text-sm text-center bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-300 flex items-center gap-2 font-bold shadow-lg animate-shake"
            >
              <FaChair className="w-5 h-5" /> Xem chỗ ngồi
            </button>
          )}
          <button
            onClick={handleShare}
            className="px-5 py-3 rounded-lg text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-300 flex items-center gap-2 font-bold shadow-lg animate-shake"
          >
            <FaShareAlt className="w-5 h-5" /> Chia sẻ
          </button>
          <button
            onClick={handleViewMore}
            className="px-5 py-3 rounded-lg text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-300 flex items-center gap-2 font-bold shadow-lg animate-shake"
          >
            <FaInfoCircle className="w-5 h-5" /> Xem thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
