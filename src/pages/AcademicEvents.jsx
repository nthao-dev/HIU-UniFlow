/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaCalendar,
  FaMapMarkerAlt,
  FaChair,
  FaShareAlt,
  FaHeart,
  FaBell,
  FaArrowLeft,
  FaArrowRight
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import events from "../../src/constant/eventData"; // Import dữ liệu từ events.js

// Hàm lọc sự kiện
function filterEvents(input, selectedTag, filters, showPast = false) {
  const query = input.toLowerCase();
  const { time, location, eventType, drlCriteria } = filters;
  const now = new Date();

  return events
    .filter((event) => event.type === "custom")
    .filter((event) => {
      const matchesQuery = query
        ? event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.tags.some((tag) => tag.toLowerCase().includes(query))
        : true;
      const matchesTag = selectedTag ? event.tags.includes(selectedTag) : true;
      const matchesTime = time
        ? (time === "upcoming" &&
          new Date(event.time) >= now &&
          new Date(event.time) <=
          new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) ||
        event.time.startsWith(time)
        : true;
      const matchesLocation = location
        ? event.location.toLowerCase().includes(location.toLowerCase())
        : true;
      const matchesEventType = eventType ? event.eventType === eventType : true;
      const matchesDrlCriteria = drlCriteria
        ? event.drlCriteria === drlCriteria
        : true;
      const matchesPast = showPast
        ? new Date(event.time) < now
        : new Date(event.time) >= now;
      return (
        matchesQuery &&
        matchesTag &&
        matchesTime &&
        matchesLocation &&
        matchesEventType &&
        matchesDrlCriteria
      );
    })
    .sort((a, b) => new Date(a.time) - new Date(b.time));
}

export default function AcademicEvents() {
  const [suggestedEvents, setSuggestedEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [filters, setFilters] = useState({
    time: "",
    location: "",
    eventType: "",
    drlCriteria: ""
  });
  const [showSeatingModal, setShowSeatingModal] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  const tags = [...new Set(events.flatMap((event) => event.tags))];
  const timeOptions = [
    { value: "", label: "Tất cả thời gian" },
    { value: "upcoming", label: "Sắp diễn ra (30 ngày tới)" },
    { value: "2025-07", label: "Tháng 7/2025" },
    { value: "2025-08", label: "Tháng 8/2025" }
  ];
  const locationOptions = [
    { value: "", label: "Tất cả địa điểm" },
    { value: "Hội trường A, HIU", label: "Hội trường A, HIU" },
    { value: "Hội trường Beethoven, HIU", label: "Hội trường Beethoven, HIU" },
    { value: "Sân vận động HIU", label: "Sân vận động HIU" },
    { value: "Online", label: "Online" }
  ];
  const eventTypeOptions = [
    { value: "", label: "Tất cả loại sự kiện" },
    { value: "Cuộc thi", label: "Cuộc thi" },
    { value: "Hội thảo", label: "Hội thảo" },
    { value: "Talkshow", label: "Talkshow" },
    { value: "Festival", label: "Festival" },
    { value: "Hoạt động đoàn thể", label: "Hoạt động đoàn thể" }
  ];
  const drlCriteriaOptions = [
    { value: "", label: "Tất cả tiêu chí ĐRL" },
    { value: "Hoạt động xã hội", label: "Hoạt động xã hội" },
    { value: "Kỹ năng chuyên môn", label: "Kỹ năng chuyên môn" },
    { value: "Học tập", label: "Học tập" },
    { value: "Văn hóa", label: "Văn hóa" }
  ];

  // Cache filtered events
  const filteredEvents = useMemo(
    () => filterEvents(input, selectedTag, filters, false),
    [input, selectedTag, filters]
  );
  const filteredPastEvents = useMemo(
    () => filterEvents(input, selectedTag, filters, true),
    [input, selectedTag, filters]
  );

  // Phân trang
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSuggestedEvents(paginatedEvents);
      setPastEvents(filteredPastEvents);
      setIsLoading(false);
      setCurrentPage(1); // Reset về trang 1 khi lọc thay đổi
    }, 300);
  }, [filteredEvents, filteredPastEvents]);

  // Carousel auto-slide
  useEffect(() => {
    const featuredEvents = events.filter(
      (event) => event.availableSeats > 0 && new Date(event.time) > new Date()
    );
    if (featuredEvents.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setSuggestedEvents(paginatedEvents);
      setIsLoading(false);
      toast.success(
        paginatedEvents.length > 0
          ? "Đã tìm thấy sự kiện!"
          : "Không tìm thấy sự kiện!"
      );
    }, 300);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleRegister = (event) => {
    if (event.availableSeats === 0) {
      toast.error(`Sự kiện ${event.title} đã hết chỗ!`);
      return;
    }
    setRegisteredEvents([...new Set([...registeredEvents, event])]);
    toast.success(`Đã đăng ký: ${event.title}!`);
  };

  const handleSelectSeat = (event, seat) => {
    if (event.availableSeats === 0) {
      toast.error(`Sự kiện ${event.title} đã hết chỗ!`);
      setShowSeatingModal(null);
      return;
    }
    setRegisteredEvents([
      ...new Set([...registeredEvents, { ...event, selectedSeat: seat }])
    ]);
    setShowSeatingModal(null);
    toast.success(`Đã chọn ghế ${seat} cho: ${event.title}!`);
  };

  const handleToggleFavorite = (event) => {
    if (favorites.some((fav) => fav.id === event.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== event.id));
      toast.info(`Đã xóa ${event.title} khỏi yêu thích`);
    } else {
      setFavorites([...favorites, event]);
      toast.success(`Đã thêm ${event.title} vào yêu thích`);
    }
  };

  const handleShare = (event) => {
    const shareUrl =
      event.readMoreUrl || `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(`${event.title}: ${shareUrl}`);
    toast.success(`Đã sao chép liên kết chia sẻ cho ${event.title}!`);
  };

  const handleSetReminder = (event) => {
    toast.success(`Đã đặt nhắc nhở cho: ${event.title}!`);
  };

  const isToday = (event) => {
    const eventDate = new Date(event.time);
    const today = new Date();
    return (
      eventDate.getFullYear() === today.getFullYear() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getDate() === today.getDate()
    );
  };

  const CountdownTimer = ({ eventTime }) => {
    const [timeLeft, setTimeLeft] = useState("");
    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date();
        const eventDate = new Date(eventTime);
        const diff = eventDate - now;
        if (diff <= 0) {
          setTimeLeft("Đã bắt đầu!");
          clearInterval(interval);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }, [eventTime]);
    return (
      <p className="text-gray-600 mb-2 text-sm sm:text-base">
        Còn lại: {timeLeft}
      </p>
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setSuggestedEvents(
        filteredEvents.slice(
          (newPage - 1) * eventsPerPage,
          newPage * eventsPerPage
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <FaCalendar className="text-blue-600 mr-3" size={36} />
            <h1 className="text-2xl sm:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Sự kiện Học thuật - UniFlow
            </h1>
          </div>
          <p className="text-gray-600 text-center mb-8 text-base sm:text-lg">
            Khám phá các hội thảo, cuộc thi, học bổng để nâng cao kỹ năng học
            thuật!
          </p>

          {/* Featured Events Carousel */}
          {events.filter(
            (event) =>
              event.availableSeats > 0 && new Date(event.time) > new Date()
          ).length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-6">
                  Sự kiện Nổi bật
                </h2>
                <div className="relative">
                  <div className="overflow-hidden rounded-lg">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {events
                        .filter(
                          (event) =>
                            event.availableSeats > 0 &&
                            new Date(event.time) > new Date()
                        )
                        .map((event) => (
                          <div key={event.id} className="min-w-full p-4">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full sm:w-1/3 h-40 sm:h-48 object-cover rounded-lg"
                                onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/300x200")
                                }
                              />
                              <div className="w-full sm:w-2/3">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                                  {event.title}
                                </h3>
                                <p className="text-gray-600 mb-2 line-clamp-2 text-sm sm:text-base">
                                  {event.description}
                                </p>
                                <p className="text-gray-600 mb-2 flex items-center text-sm sm:text-base">
                                  <FaCalendar className="mr-2" />{" "}
                                  {new Date(event.time).toLocaleString("vi-VN")}
                                </p>
                                <p className="text-gray-600 mb-2 flex items-center text-sm sm:text-base">
                                  <FaMapMarkerAlt className="mr-2" />{" "}
                                  {event.location}
                                  {event.isOnline &&
                                    event.platform &&
                                    ` (${event.platform})`}
                                </p>
                                <p className="text-gray-600 mb-3 text-sm sm:text-base">
                                  Loại: {event.eventType}
                                </p>
                                <button
                                  onClick={() => handleRegister(event)}
                                  className={`px-4 py-2 rounded-lg text-white transition-all ${event.availableSeats === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                                    }`}
                                  disabled={event.availableSeats === 0}
                                >
                                  {event.availableSeats === 0
                                    ? "Hết vé"
                                    : "Đăng ký ngay"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    {events
                      .filter(
                        (event) =>
                          event.availableSeats > 0 &&
                          new Date(event.time) > new Date()
                      )
                      .map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 mx-1 rounded-full ${currentSlide === index ? "bg-blue-600" : "bg-gray-300"
                            }`}
                          onClick={() => setCurrentSlide(index)}
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}

          {/* Event Categories */}
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-6">
              Danh mục Sự kiện
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {eventTypeOptions.slice(1).map((type) => (
                <button
                  key={type.value}
                  onClick={() =>
                    setFilters({ ...filters, eventType: type.value })
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${filters.eventType === type.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-6">
              Tìm kiếm Sự kiện
            </h2>
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tìm kiếm: Học bổng, Cuộc thi, Hội thảo..."
                    className="w-full border border-gray-300 pl-10 pr-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                  disabled={isLoading}
                >
                  Tìm kiếm
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="relative">
                  <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="time"
                    value={filters.time}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 pl-10 pr-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {timeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 pl-10 pr-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {locationOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <select
                    name="eventType"
                    value={filters.eventType}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 pl-4 pr-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {eventTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <select
                    name="drlCriteria"
                    value={filters.drlCriteria}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 pl-4 pr-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {drlCriteriaOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Registered Events */}
          {registeredEvents.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-6">
                Lịch Sự kiện Của Bạn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {registeredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/300x200")
                      }
                    />
                    <h4 className="text-base font-bold text-gray-800 mb-2">
                      {event.title}
                    </h4>
                    <p className="text-gray-600 mb-2 flex items-center text-sm">
                      <FaCalendar className="mr-2" />{" "}
                      {new Date(event.time).toLocaleString("vi-VN")}
                    </p>
                    <p className="text-gray-600 mb-2 flex items-center text-sm">
                      <FaMapMarkerAlt className="mr-2" /> {event.location}
                      {event.isOnline &&
                        event.platform &&
                        ` (${event.platform})`}
                    </p>
                    <p className="text-gray-600 mb-2 text-sm">
                      Loại: {event.eventType}
                    </p>
                    {event.selectedSeat && (
                      <p className="text-green-600 mb-2 text-sm">
                        Ghế: {event.selectedSeat}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShare(event)}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
                      >
                        <FaShareAlt />
                      </button>
                      <button
                        onClick={() => handleSetReminder(event)}
                        className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-all"
                      >
                        <FaBell />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorites Section */}
          {favorites.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-6">
                Sự kiện Yêu thích
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {favorites.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/300x200")
                      }
                    />
                    <h4 className="text-base font-bold text-gray-800 mb-2">
                      {event.title}
                    </h4>
                    <p className="text-gray-600 mb-2 flex items-center text-sm">
                      <FaCalendar className="mr-2" />{" "}
                      {new Date(event.time).toLocaleString("vi-VN")}
                    </p>
                    <p className="text-gray-600 mb-2 flex items-center text-sm">
                      <FaMapMarkerAlt className="mr-2" /> {event.location}
                      {event.isOnline &&
                        event.platform &&
                        ` (${event.platform})`}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleFavorite(event)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                      >
                        <FaHeart />
                      </button>
                      <button
                        onClick={() => handleShare(event)}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
                      >
                        <FaShareAlt />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-6">
              Sự kiện Sắp diễn ra
            </h2>
            {isLoading ? (
              <div className="text-center">
                <ClipLoader color="#2563eb" size={40} />
                <p className="text-blue-600 mt-2">Đang tìm kiếm...</p>
              </div>
            ) : suggestedEvents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {suggestedEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 ${isToday(event) ? "border-2 border-yellow-500" : ""
                        }`}
                    >
                      {isToday(event) && (
                        <p className="text-yellow-600 font-bold mb-2 text-sm">
                          Diễn ra hôm nay!
                        </p>
                      )}
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/300x200")
                        }
                      />
                      <h4 className="text-base font-bold text-gray-800 mb-2">
                        {event.title}
                      </h4>
                      <p className="text-gray-600 mb-2 flex items-center text-sm">
                        <FaCalendar className="mr-2" />{" "}
                        {new Date(event.time).toLocaleString("vi-VN")}
                      </p>
                      <p className="text-gray-600 mb-2 flex items-center text-sm">
                        <FaMapMarkerAlt className="mr-2" /> {event.location}
                        {event.isOnline &&
                          event.platform &&
                          ` (${event.platform})`}
                      </p>
                      <p className="text-gray-600 mb-2 text-sm">
                        Chỗ ngồi:{" "}
                        {event.availableSeats > 0
                          ? `${event.availableSeats} chỗ còn lại`
                          : "Hết vé"}
                      </p>
                      <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                        {event.description}
                      </p>
                      {event.drlPoints && (
                        <p className="text-green-600 mb-3 text-sm">
                          ĐRL: +{event.drlPoints} ({event.drlCriteria})
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {event.isOnline && (
                        <p className="text-blue-600 mb-3 text-sm">
                          Sự kiện Online{" "}
                          {event.platform && `trên ${event.platform}`}
                        </p>
                      )}
                      {!event.hasSeating && (
                        <p className="text-gray-500 mb-3 text-sm">
                          Không có đặt chỗ
                        </p>
                      )}
                      {new Date(event.time) > new Date() &&
                        new Date(event.time) <=
                        new Date(
                          new Date().getTime() + 3 * 24 * 60 * 60 * 1000
                        ) && <CountdownTimer eventTime={event.time} />}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleRegister(event)}
                          className={`flex-1 px-4 py-2 rounded-lg text-white text-sm transition-all ${event.availableSeats === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                            }`}
                          disabled={event.availableSeats === 0}
                        >
                          {event.availableSeats === 0 ? "Hết vé" : "Đăng ký"}
                        </button>
                        {event.hasSeating && (
                          <button
                            onClick={() => setShowSeatingModal(event)}
                            className={`px-4 py-2 rounded-lg text-white text-sm transition-all ${event.availableSeats === 0
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                              }`}
                            disabled={event.availableSeats === 0}
                          >
                            <FaChair className="inline mr-1" /> Chọn ghế
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleFavorite(event)}
                          className={`p-2 rounded-full ${favorites.some((fav) => fav.id === event.id)
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            } transition-all`}
                        >
                          <FaHeart />
                        </button>
                        <button
                          onClick={() => handleShare(event)}
                          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
                        >
                          <FaShareAlt />
                        </button>
                        <button
                          onClick={() => handleSetReminder(event)}
                          className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-all"
                        >
                          <FaBell />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6 gap-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-full ${currentPage === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                        } transition-all`}
                    >
                      <FaArrowLeft />
                    </button>
                    <span className="text-gray-700 text-sm">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-full ${currentPage === totalPages
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                        } transition-all`}
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center text-sm">
                Không tìm thấy sự kiện. Thử từ khóa hoặc bộ lọc khác!
              </p>
            )}
          </div>

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-6">
                Sự kiện Đã diễn ra
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {pastEvents.slice(0, 6).map(
                  (
                    event // Giới hạn 6 sự kiện đã diễn ra
                  ) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-lg p-4 shadow-md opacity-75"
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/300x200")
                        }
                      />
                      <h4 className="text-base font-bold text-gray-800 mb-2">
                        {event.title}
                      </h4>
                      <p className="text-gray-600 mb-2 flex items-center text-sm">
                        <FaCalendar className="mr-2" />{" "}
                        {new Date(event.time).toLocaleString("vi-VN")}
                      </p>
                      <p className="text-gray-600 mb-2 flex items-center text-sm">
                        <FaMapMarkerAlt className="mr-2" /> {event.location}
                        {event.isOnline &&
                          event.platform &&
                          ` (${event.platform})`}
                      </p>
                      <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                        {event.description}
                      </p>
                      <p className="text-gray-500 italic text-sm">
                        Sự kiện đã kết thúc
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Seating Modal */}
          {showSeatingModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">
                  Chọn ghế cho {showSeatingModal.title}
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4"].map(
                    (seat) => (
                      <button
                        key={seat}
                        onClick={() => handleSelectSeat(showSeatingModal, seat)}
                        className={`p-2 rounded text-sm transition-all ${showSeatingModal.availableSeats === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gray-200 hover:bg-blue-500 hover:text-white"
                          }`}
                        disabled={showSeatingModal.availableSeats === 0}
                      >
                        {seat}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() => setShowSeatingModal(null)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
