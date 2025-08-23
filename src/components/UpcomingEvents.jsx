import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../constant/pathnames";
import events from "../constant/eventData";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Đã bắt đầu!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days} ngày ${hours} giờ ${minutes} phút`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return <span className="text-indigo-600 font-medium">{timeLeft}</span>;
};

const EVENTS_PER_PAGE = 6;

const UpcomingEvents = () => {
  const sortedEvents = events
    .filter((event) => new Date(event.time) > new Date())
    .sort((a, b) => new Date(a.time) - new Date(b.time));

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sortedEvents.length / EVENTS_PER_PAGE);

  const currentEvents = sortedEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  return (
    <section className="mb-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-800 mb-8 text-center animate-fade-in">
        Sự kiện sắp tới với UniFlow
        <span className="ml-2 inline-block px-2 py-1 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
          AI Powered
        </span>
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Khám phá các sự kiện hấp dẫn được gợi ý thông minh bởi UniFlow
      </p>

      {currentEvents.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Sắp ra mắt các sự kiện đỉnh cao! Hãy theo dõi UniFlow.
        </p>
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {currentEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  {new Date(event.time).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-gray-600 mb-2">
                  Còn lại: <CountdownTimer targetDate={event.time} />
                </p>
                <p className="text-gray-500 mb-4">{event.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-indigo-600">{event.drlPoints} ĐRL</p>
                  {event.hasSeating && (
                    <p
                      className={`text-sm ${event.availableSeats > 0
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {event.availableSeats > 0
                        ? `${event.availableSeats} chỗ trống`
                        : "Cháy vé"}
                    </p>
                  )}
                </div>
                <Link
                  to={`${PATHS.EVENT_DETAIL}/${event.id}`}
                  className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded ${page === currentPage ? "bg-indigo-600 text-white" : ""
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default UpcomingEvents;
