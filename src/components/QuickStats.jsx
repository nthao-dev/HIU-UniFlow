import React from "react";
import { Link } from "react-router-dom";
import { FaCalendar, FaUsers, FaUniversity, FaStar } from "react-icons/fa";
import { PATHS } from "../constant/pathnames";

const stats = [
  {
    id: 1,
    value: "500+",
    label: "Sự kiện đa dạng từ học thuật đến giải trí",
    icon: <FaCalendar className="text-indigo-600 text-3xl" />,
    color: "from-indigo-600 to-purple-600"
  },
  {
    id: 2,
    value: "8,000+",
    label: "Sinh viên kết nối qua gợi ý AI",
    icon: <FaUsers className="text-blue-600 text-3xl" />,
    color: "from-blue-600 to-cyan-600"
  },
  {
    id: 3,
    value: "15+",
    label: "Trường đại học đồng hành",
    icon: <FaUniversity className="text-purple-600 text-3xl" />,
    color: "from-purple-600 to-pink-600"
  },
  {
    id: 4,
    value: "25,000+",
    label: "Điểm rèn luyện phân phối cho sinh viên",
    icon: <FaStar className="text-yellow-600 text-3xl" />,
    color: "from-yellow-600 to-orange-600"
  }
];

const QuickStats = () => {
  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/40x40/cccccc/000000?text=UniFlow";
  };

  return (
    <section className="mb-16 bg-gradient-to-b from-indigo-50 to-gray-100 py-12 rounded-lg">
      <div className="flex items-center justify-center mb-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-800 text-center animate-fade-in">
          Hành trình UniFlow định hình tương lai
          <span className="ml-2 inline-block px-2 py-1 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
            AI Powered
          </span>
        </h2>
        <img
          src="/assets/mascot.png"
          alt="UniFlow Mascot"
          className="w-10 h-10 ml-2 animate-bounce"
          onError={handleImageError}
        />
      </div>
      <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
        Chúng em khát khao mang đến cho sinh viên những trải nghiệm sự kiện ý
        nghĩa, được gợi ý thông minh bởi AI và gắn kết với điểm rèn luyện, từ
        hội thảo công nghệ đến lễ hội văn hóa.
      </p>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center px-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="flex justify-center mb-4">{stat.icon}</div>
            <p
              className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent animate-pulse`}
            >
              {stat.value}
            </p>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link
          to={PATHS.ALL_EVENTS}
          className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        >
          Khám phá hành trình UniFlow
        </Link>
      </div>
    </section>
  );
};

export default QuickStats;
