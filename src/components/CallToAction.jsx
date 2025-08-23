/** @jsxImportSource @emotion/react */
import React from "react";
import { Link } from "react-router-dom";

const CallToAction = ({ auth }) => {
  return (
    <section className="mb-12">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-10 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 animate-pulse">
          UniFlow – Nền tảng sự kiện tương lai
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          {auth.isLoggedIn
            ? "Tham gia ngay để khám phá sự kiện học thuật, giải trí và trải nghiệm AI với UniFlow!"
            : "Đăng nhập để nhận gợi ý sự kiện thông minh và quản lý ĐRL hiệu quả!"}
        </p>
        <Link
          to={auth.isLoggedIn ? "/ai" : "/login"}
          className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
        >
          {auth.isLoggedIn ? "Trải nghiệm UniFlow" : "Đăng nhập ngay"}
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
