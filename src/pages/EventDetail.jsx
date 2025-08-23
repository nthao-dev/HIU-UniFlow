import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import events from "../../src/constant/eventData"; // Điều chỉnh nếu đường dẫn khác
import { PATHS } from "../../src/constant/pathnames";

function EventDetail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const foundEvent = events.find((e) => e.id.toString() === eventId);
      console.log("EventDetail - eventId:", eventId);
      console.log("EventDetail - found event:", foundEvent);
      if (!foundEvent) {
        setError("Không tìm thấy sự kiện!");
      } else {
        setEvent(foundEvent);
      }
    } catch (err) {
      console.error("Error loading event:", err);
      setError("Có lỗi xảy ra khi tải sự kiện!");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  if (error || !event) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          {error || "Không tìm thấy sự kiện!"}
        </h1>
        <Link to={PATHS.HOME} className="text-blue-600 underline">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-80 object-cover rounded-lg mb-4"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400x200";
        }}
      />
      <p className="text-gray-700 mb-4">{event.description}</p>
      <p className="text-gray-800 font-semibold">
        Thời gian: {new Date(event.time).toLocaleString("vi-VN")}
      </p>
      <p className="text-gray-800 font-semibold">Địa điểm: {event.location}</p>
      <p className="text-gray-800 font-semibold">
        Tags: {event.tags.join(", ")}
      </p>
      <Link
        to={PATHS.HOME}
        className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Quay lại
      </Link>
    </div>
  );
}

export default EventDetail;
