/** @jsxImportSource @emotion/react */
import React from "react";
import { Link } from "react-router-dom";
import { FaFilm, FaQrcode, FaBullseye, FaRobot } from "react-icons/fa";

const EventFeatures = () => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-800 mb-8 text-center animate-fade-in">
        Khám phá thế giới sự kiện
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/movies"
          className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
        >
          <FaFilm className="text-purple-600 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-purple-700 mb-2">
            Chiếu phim
          </h3>
          <p className="text-sm text-gray-600">
            Đặt vé xem phim với sơ đồ chỗ ngồi thông minh.
          </p>
        </Link>
        <Link
          to="/events"
          className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
        >
          <FaQrcode className="text-indigo-600 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">
            Check-in QR
          </h3>
          <p className="text-sm text-gray-600">
            Check-in sự kiện nhanh chóng, tiện lợi.
          </p>
        </Link>
        <Link
          to="/drl"
          className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
        >
          <FaBullseye className="text-orange-600 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-orange-700 mb-2">
            Quản lý ĐRL
          </h3>
          <p className="text-sm text-gray-600">
            Theo dõi và đạt 100 điểm rèn luyện dễ dàng.
          </p>
        </Link>
        <Link
          to="/ai"
          className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
        >
          <FaRobot className="text-green-600 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-700 mb-2">
            Trò chuyện với UniFlow AI
          </h3>
          <p className="text-sm text-gray-600">
            Hỏi đáp sự kiện với AI thông minh.
          </p>
        </Link>
      </div>
    </section>
  );
};

export default EventFeatures;
