import React, { useCallback, useState } from "react";
import { debounce } from "lodash";

// Danh sách bộ lọc
const filterOptions = [
  { value: "all", label: "Tất cả" },
  { value: "movie", label: "Chiếu phim" },
  { value: "seminar", label: "Hội thảo" },
  { value: "club", label: "Câu lạc bộ" },
  { value: "sport", label: "Thể thao" },
  { value: "workshop", label: "Workshop" },
  { value: "festival", label: "Lễ hội" }
];

// Danh sách gợi ý tĩnh (mô phỏng AI)
const mockSuggestions = [
  { title: "Hội thảo Công nghệ AI 2025", category: "seminar", relevance: 0.9 },
  {
    title: "Chiếu phim ngoài trời - Avengers",
    category: "movie",
    relevance: 0.7
  },
  { title: "Ngày hội Câu lạc bộ Guitar", category: "club", relevance: 0.8 },
  { title: "Giải bóng rổ Sinh viên", category: "sport", relevance: 0.85 },
  { title: "Workshop Lập trình React", category: "workshop", relevance: 0.75 },
  { title: "Lễ hội Âm nhạc Sinh viên", category: "festival", relevance: 0.95 }
];

// Sự kiện hot (mô phỏng AI đề xuất theo xu hướng)
const hotEvents = [
  "Lễ hội Âm nhạc Sinh viên",
  "Hội thảo Công nghệ AI 2025",
  "Giải bóng rổ Sinh viên"
];

// Bộ lọc nâng cao
const advancedFilters = {
  date: [
    { value: "today", label: "Hôm nay" },
    { value: "this_week", label: "Tuần này" },
    { value: "this_month", label: "Tháng này" }
  ],
  location: [
    { value: "campus_a", label: "Cơ sở A" },
    { value: "campus_b", label: "Cơ sở B" },
    { value: "online", label: "Online" }
  ]
};

const SearchFilter = ({
  filterType,
  setFilterType,
  searchQuery,
  setSearchQuery
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
  const [advancedFilter, setAdvancedFilter] = useState({
    date: "",
    location: ""
  });
  const [showHotEvents, setShowHotEvents] = useState(false);

  // Debounce tìm kiếm
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      if (value) {
        // Mô phỏng AI: Sắp xếp gợi ý theo độ liên quan và lọc theo từ khóa + loại sự kiện
        const filteredSuggestions = mockSuggestions
          .filter(
            (s) =>
              s.title.toLowerCase().includes(value.toLowerCase()) &&
              (filterType === "all" || s.category === filterType)
          )
          .sort((a, b) => b.relevance - a.relevance)
          .slice(0, 4); // Giới hạn 4 gợi ý
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300),
    [filterType]
  );

  // Xử lý tìm kiếm bằng giọng nói (mô phỏng)
  const handleVoiceSearch = () => {
    setIsVoiceSearchActive(!isVoiceSearchActive);
    if (!isVoiceSearchActive) {
      setTimeout(() => debouncedSearch("hội thảo"), 1000);
    }
  };

  // Xử lý bộ lọc nâng cao
  const handleAdvancedFilter = (type, value) => {
    setAdvancedFilter({ ...advancedFilter, [type]: value });
  };

  // Xử lý hiển thị sự kiện hot
  const handleShowHotEvents = () => {
    setShowHotEvents(true);
    setSuggestions(
      mockSuggestions
        .filter((s) => hotEvents.includes(s.title))
        .sort((a, b) => b.relevance - a.relevance)
    );
  };

  return (
    <section className="mb-8 p-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl shadow-xl transition-all duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Input tìm kiếm và gợi ý */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Tìm sự kiện hot..."
            value={searchQuery}
            onChange={(e) => debouncedSearch(e.target.value)}
            aria-label="Tìm kiếm sự kiện"
            className="w-full p-3 pr-10 border-0 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 bg-white/90 shadow-md placeholder-gray-400 text-sm"
          />
          <button
            onClick={handleVoiceSearch}
            aria-label={
              isVoiceSearchActive
                ? "Dừng tìm kiếm giọng nói"
                : "Tìm kiếm bằng giọng nói"
            }
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
              isVoiceSearchActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white shadow-sm`}
          >
            {isVoiceSearchActive ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="5" y="5" width="14" height="14" rx="2" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            )}
          </button>
          {suggestions.length > 0 && (
            <ul className="absolute w-full bg-white/95 backdrop-blur-sm border border-gray-100 rounded-lg mt-2 shadow-2xl max-h-48 overflow-y-auto z-20 animate-fade-in">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSearchQuery(suggestion.title);
                    setSuggestions([]);
                  }}
                  className="px-3 py-2 hover:bg-indigo-50 cursor-pointer transition-all duration-200 text-sm flex items-center gap-2"
                >
                  <span className="text-indigo-600 font-medium">
                    #{suggestion.category}
                  </span>
                  {suggestion.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bộ lọc loại sự kiện (dropdown) */}
        <div className="flex gap-3 items-center">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            aria-label="Lọc theo loại sự kiện"
            className="p-2 border-0 rounded-lg bg-white/90 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 shadow-md text-sm"
          >
            {filterOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {/* Bộ lọc nâng cao */}
          <select
            value={advancedFilter.date}
            onChange={(e) => handleAdvancedFilter("date", e.target.value)}
            aria-label="Lọc theo ngày"
            className="p-2 border-0 rounded-lg bg-white/90 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 shadow-md text-sm"
          >
            <option value="">Ngày</option>
            {advancedFilters.date.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={advancedFilter.location}
            onChange={(e) => handleAdvancedFilter("location", e.target.value)}
            aria-label="Lọc theo địa điểm"
            className="p-2 border-0 rounded-lg bg-white/90 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 shadow-md text-sm"
          >
            <option value="">Địa điểm</option>
            {advancedFilters.location.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {/* Nút khám phá sự kiện hot */}
          <button
            onClick={handleShowHotEvents}
            className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:scale-105 transition-all duration-300 text-sm flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Hot
          </button>
        </div>
      </div>
    </section>
  );
};

export default React.memo(SearchFilter);
