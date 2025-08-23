/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaPaperPlane,
  FaCalendar,
  FaMapMarkerAlt,
  FaChair,
  FaBullseye
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Autosuggest from "react-autosuggest";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import {
  VerticalTimeline,
  VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import events from "../constant/eventData";

// Hàm filterMockEvents (giữ nguyên, chỉ lấy sự kiện học thuật)
function filterMockEvents(
  input,
  selectedTag,
  filters,
  userProfile,
  userHistory,
  eventHistory
) {
  const query = input ? input.toLowerCase() : "";
  const { time, location, timeOfDay } = filters || {};
  const { major, priority, drlNeeded, interests = [] } = userProfile || {};
  const now = new Date();

  return (events || [])
    .filter((event) => event?.eventType === "academic")
    .map((event) => {
      let score = 0;
      if (query) {
        if (event?.title?.toLowerCase().includes(query)) score += 5;
        if (event?.description?.toLowerCase().includes(query)) score += 3;
        if (event?.eventType?.toLowerCase().includes(query)) score += 2;
        if (event?.tags?.some((tag) => tag?.toLowerCase().includes(query)))
          score += 2;
        if (
          query.includes("học bổng") &&
          (event?.drlCriteria === 1 ||
            event?.drlCriteria === 2 ||
            event?.tags?.includes("học bổng"))
        )
          score += 7;
      }
      if (selectedTag && event?.tags?.includes(selectedTag)) score += 3;
      if (major && event?.tags?.includes(major.toLowerCase())) score += 4;
      if (priority === "drl" && drlNeeded?.includes(event?.drlCriteria))
        score += 6;
      if (priority === "academic" && event?.tags?.includes("học tập"))
        score += 4;
      if (interests?.some((interest) => event?.tags?.includes(interest)))
        score += 3;
      if (userHistory?.[selectedTag] > 0) score += userHistory[selectedTag];
      if (
        eventHistory?.some((ev) =>
          event?.tags?.some((tag) => ev?.tags?.includes(tag))
        )
      )
        score += 2;
      const eventDate = event?.time ? new Date(event.time) : now;
      if (
        eventDate >= now &&
        eventDate <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
      )
        score += 5;

      const matchesTime = time
        ? (time === "upcoming" &&
            eventDate >= now &&
            eventDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) ||
          (time.startsWith("2025-") && event?.time?.startsWith(time))
        : true;
      const matchesLocation = location
        ? event?.location?.toLowerCase().includes(location.toLowerCase())
        : true;
      const matchesTimeOfDay = timeOfDay
        ? (() => {
            const hours = eventDate.getHours();
            if (timeOfDay === "morning") return hours >= 0 && hours < 12;
            if (timeOfDay === "afternoon") return hours >= 12 && hours < 18;
            if (timeOfDay === "evening") return hours >= 18 && hours <= 23;
            return true;
          })()
        : true;

      return { event, score, matchesTime, matchesLocation, matchesTimeOfDay };
    })
    .filter(
      ({ matchesTime, matchesLocation, matchesTimeOfDay }) =>
        matchesTime && matchesLocation && matchesTimeOfDay
    )
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(a.event?.time) - new Date(b.event?.time) ||
        0
    )
    .map(({ event }) => event)
    .slice(0, 5);
}

// Hàm generateRoadmap (giữ nguyên, chỉ lấy sự kiện học thuật)
function generateRoadmap(userProfile, eventHistory, allEvents) {
  const { major, priority, drlNeeded, interests = [] } = userProfile || {};
  const now = new Date();

  return (allEvents || [])
    .filter((event) => event?.eventType === "academic")
    .map((event) => {
      let score = 0;
      let reason = "Phù hợp với hồ sơ của bạn";
      if (drlNeeded?.includes(event?.drlCriteria)) {
        score += 6;
        reason = `Giúp đạt ĐRL ${event.drlCriteria}`;
      }
      if (event?.tags?.includes(major?.toLowerCase())) {
        score += 4;
        reason = `Phù hợp với ngành ${major?.toUpperCase()}`;
      }
      if (priority === "academic" && event?.tags?.includes("học tập")) {
        score += 4;
        reason = "Hỗ trợ học thuật";
      }
      if (interests?.some((interest) => event?.tags?.includes(interest))) {
        score += 3;
        reason = `Phù hợp với sở thích ${interests.join(", ")}`;
      }
      if (
        eventHistory?.some((ev) =>
          event?.tags?.some((tag) => ev?.tags?.includes(tag))
        )
      ) {
        score += 2;
        reason = "Dựa trên lịch sử tham gia";
      }
      const eventDate = event?.time ? new Date(event.time) : now;
      if (
        eventDate >= now &&
        eventDate <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
      ) {
        score += 5;
        reason += " (Diễn ra trong 3 ngày tới)";
      }

      const isUpcoming =
        eventDate >= now &&
        eventDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      return { event, score, isUpcoming, reason };
    })
    .filter(({ isUpcoming }) => isUpcoming)
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(a.event?.time) - new Date(b.event?.time) ||
        0
    )
    .map(({ event, reason }) => ({ ...event, reason }))
    .slice(0, 3);
}

// Hàm generateDrlTargetRoadmap (giữ nguyên vì đã phù hợp)
function generateDrlTargetRoadmap(userProfile, allEvents, targetDrl) {
  const { drlTotal, drlNeeded } = userProfile || {};
  const remainingPoints = targetDrl - (drlTotal || 0);
  const now = new Date();
  let accumulatedPoints = 0;
  const roadmap = [];

  if (remainingPoints <= 0) {
    return [];
  }

  const prioritizedEvents = (allEvents || [])
    .filter((event) => {
      const eventDate = event?.time ? new Date(event.time) : now;
      return (
        eventDate >= now &&
        eventDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      );
    })
    .map((event) => {
      let score = 0;
      let reason = `Cộng ${event?.drlPoints || 0} ĐRL`;
      if (drlNeeded?.includes(event?.drlCriteria)) {
        score += 10;
        reason += `, giúp đạt ĐRL ${event.drlCriteria}`;
      }
      return { event, score, reason };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(a.event?.time) - new Date(b.event?.time) ||
        0
    );

  for (const { event, reason } of prioritizedEvents) {
    if (accumulatedPoints >= remainingPoints) break;
    roadmap.push({ ...event, reason });
    accumulatedPoints += event?.drlPoints || 0;
  }

  return roadmap;
}

// Hàm mock để trả lời chat với UniBot
function mockChatResponse(chatInput, userProfile, userHistory, eventHistory) {
  const inputLower = chatInput.toLowerCase();
  let text = "Mình tìm được vài sự kiện học thuật phù hợp đây!";
  let suggestedEvents = [];

  // Xử lý từ khóa đơn giản
  if (inputLower.includes("học bổng")) {
    text = "Đây là các sự kiện học bổng phù hợp với bạn!";
    suggestedEvents = filterMockEvents(
      "học bổng",
      "",
      {},
      userProfile,
      userHistory,
      eventHistory
    ).slice(0, 2);
  } else if (inputLower.includes("đrl") || inputLower.includes("rèn luyện")) {
    const drlCriteria = userProfile?.drlNeeded?.[0] || "";
    text = `Gợi ý sự kiện giúp đạt tiêu chí ĐRL ${drlCriteria || "phù hợp"}!`;
    suggestedEvents = filterMockEvents(
      `đrl ${drlCriteria}`,
      "",
      {},
      userProfile,
      userHistory,
      eventHistory
    ).slice(0, 2);
  } else if (
    inputLower.includes("hội thảo") ||
    inputLower.includes("cuộc thi")
  ) {
    text = "Đây là các hội thảo/cuộc thi học thuật phù hợp!";
    suggestedEvents = filterMockEvents(
      inputLower,
      "",
      {},
      userProfile,
      userHistory,
      eventHistory
    ).slice(0, 2);
  } else {
    suggestedEvents = filterMockEvents(
      inputLower,
      "",
      {},
      userProfile,
      userHistory,
      eventHistory
    ).slice(0, 2);
  }

  return {
    text,
    events: suggestedEvents.map((event) => ({
      id: event.id,
      title: event.title,
      time: event.time,
      location: event.location,
      reason: `Phù hợp với ${inputLower || "hồ sơ của bạn"}`,
      drlPoints: event.drlPoints || 5,
      hasSeating: event.hasSeating || false
    }))
  };
}

export default function AcademicEvents() {
  const [suggestedEvents, setSuggestedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [filters, setFilters] = useState({
    time: "",
    location: "",
    timeOfDay: ""
  });
  const [userProfile, setUserProfile] = useState({
    major: "",
    priority: "",
    drlTotal: 85,
    drlAchieved: [3, 4],
    drlNeeded: [],
    interests: []
  });
  const [userHistory, setUserHistory] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("userHistory") || "{}");
      return saved || {};
    } catch (e) {
      return {};
    }
  });
  const [eventHistory, setEventHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [roadmapEvents, setRoadmapEvents] = useState([]);
  const [drlTargetRoadmap, setDrlTargetRoadmap] = useState([]);
  const [showDrlTarget, setShowDrlTarget] = useState(false);
  const [showSeatingModal, setShowSeatingModal] = useState(null);
  const [drlTarget, setDrlTarget] = useState(() => {
    try {
      return localStorage.getItem("drlTarget") || "";
    } catch (e) {
      return "";
    }
  });

  const tags = [
    "học tập",
    "học bổng",
    "thiện nguyện",
    "cuộc thi",
    "đrl",
    "cntt",
    "y khoa",
    "kinh tế"
  ];
  const timeOptions = [
    { value: "", label: "Tất cả thời gian" },
    { value: "upcoming", label: "Sắp diễn ra (30 ngày tới)" },
    { value: "2025-07", label: "Tháng 7/2025" }
  ];
  const locationOptions = [
    { value: "", label: "Tất cả địa điểm" },
    { value: "TP.HCM", label: "TP.HCM" },
    { value: "Online", label: "Online" }
  ];
  const majorOptions = [
    { value: "", label: "Chọn ngành" },
    { value: "cntt", label: "CNTT" },
    { value: "y khoa", label: "Y khoa" },
    { value: "kinh tế", label: "Kinh tế" }
  ];
  const priorityOptions = [
    { value: "", label: "Chọn ưu tiên" },
    { value: "academic", label: "Trao dồi học thuật" },
    { value: "drl", label: "Tăng điểm rèn luyện" }
  ];
  const drlOptions = [
    { value: "", label: "Chọn tiêu chí" },
    { value: "1", label: "Tiêu chí 1" },
    { value: "2", label: "Tiêu chí 2" },
    { value: "3", label: "Tiêu chí 3" },
    { value: "4", label: "Tiêu chí 4" },
    { value: "5", label: "Tiêu chí 5" }
  ];
  const interestOptions = [
    { value: "AI", label: "AI" },
    { value: "khởi nghiệp", label: "Khởi nghiệp" },
    { value: "học bổng", label: "Học bổng" }
  ];
  const timeOfDayOptions = [
    { value: "", label: "Tất cả thời gian trong ngày" },
    { value: "morning", label: "Buổi sáng (0:00 - 12:00)" },
    { value: "afternoon", label: "Buổi chiều (12:00 - 18:00)" },
    { value: "evening", label: "Buổi tối (18:00 - 23:59)" }
  ];

  const getSuggestions = (value) => {
    const inputValue = value?.trim().toLowerCase() || "";
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : ["ĐRL 1", "học bổng", "hội thảo AI", "cuộc thi CNTT"].filter(
          (s) => s.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const renderSuggestion = (suggestion) => <span>{suggestion}</span>;

  // Hàm fetchSuggestions chỉ dùng mock data
  const fetchSuggestions = (
    query = "",
    tag = "",
    filters = {},
    profile = {},
    history = {},
    eventHistory = []
  ) => {
    setIsLoading(true);
    setTimeout(() => {
      // Chỉ dùng filterMockEvents để lấy sự kiện
      const mockEvents = filterMockEvents(
        query,
        tag,
        filters,
        profile,
        history,
        eventHistory
      );
      setSuggestedEvents(mockEvents);
      if (mockEvents.length > 0) {
        toast.success("Đã tìm thấy sự kiện học thuật!");
      } else {
        toast.warn("Không tìm thấy sự kiện phù hợp, thử từ khóa khác!");
      }
      setIsLoading(false);
    }, 500); // Giả lập thời gian chờ
  };

  // Hàm xử lý chat với UniBot, dùng mock response
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput?.trim()) return;
    const userMessage = { sender: "user", text: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput("");

    // Tạo phản hồi giả từ mockChatResponse
    setTimeout(() => {
      const response = mockChatResponse(
        chatInput,
        userProfile,
        userHistory,
        eventHistory
      );
      const botMessage = {
        sender: "bot",
        text: response.text,
        events: response.events
      };
      setChatMessages((prev) => [...prev, botMessage]);
      toast.success("UniBot đã trả lời câu hỏi của bạn!");
    }, 500); // Giả lập thời gian chờ
  };

  const handleSelectSeat = (event, seat) => {
    setEventHistory([
      ...new Set([...eventHistory, { ...event, selectedSeat: seat }])
    ]);
    setUserHistory((prev) => {
      const updated = { ...prev };
      (event?.tags || []).forEach(
        (tag) => (updated[tag] = (updated[tag] || 0) + 1)
      );
      try {
        localStorage.setItem("userHistory", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save userHistory to localStorage:", e);
      }
      return updated;
    });
    setShowSeatingModal(null);
    toast.success(
      `Đã chọn ghế ${seat} cho sự kiện: ${event?.title || "Không xác định"}!`
    );
  };

  const isToday = (event) => {
    const eventDate = event?.time ? new Date(event.time) : new Date();
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
        const eventDate = eventTime ? new Date(eventTime) : now;
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

    return <p className="text-gray-600 mb-1">Còn lại: {timeLeft}</p>;
  };

  // Sửa useEffect để tránh vòng lặp vô hạn
  useEffect(() => {
    const now = new Date();
    const hasFutureEvents = (events || []).some(
      (event) =>
        event?.eventType === "academic" && new Date(event?.time || now) >= now
    );
    if (!hasFutureEvents) {
      toast.warn("Dữ liệu sự kiện học thuật đã cũ! Vui lòng cập nhật thêm.");
    }

    // Chỉ cập nhật drlNeeded nếu cần
    const totalCriteria = 5;
    const allCriteria = [1, 2, 3, 4, 5];
    const missingCriteria = allCriteria.filter(
      (c) => !userProfile?.drlAchieved?.includes(c)
    );

    // So sánh để tránh setState không cần thiết
    if (
      JSON.stringify(missingCriteria) !== JSON.stringify(userProfile.drlNeeded)
    ) {
      setUserProfile((prev) => ({
        ...prev,
        drlNeeded: missingCriteria
      }));
    }

    // Chỉ gọi fetchSuggestions và generateRoadmap khi major và priority có giá trị
    if (userProfile?.major && userProfile?.priority) {
      fetchSuggestions("", "", filters, userProfile, userHistory, eventHistory);
      setRoadmapEvents(generateRoadmap(userProfile, eventHistory, events));
    }
  }, [userHistory, eventHistory]); // Loại userProfile khỏi dependencies

  const handleInputChange = (e) => {
    setInput(e.target.value);
    const updatedHistory = { ...userHistory };
    updatedHistory[e.target.value] = (updatedHistory[e.target.value] || 0) + 1;
    setUserHistory(updatedHistory);
    try {
      localStorage.setItem("userHistory", JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save userHistory to localStorage:", e);
    }
  };

  const handleTagClick = (tag) => {
    const newTag = tag === selectedTag ? "" : tag;
    setSelectedTag(newTag);
    if (newTag) {
      const updatedHistory = { ...userHistory };
      updatedHistory[newTag] = (updatedHistory[newTag] || 0) + 1;
      setUserHistory(updatedHistory);
      try {
        localStorage.setItem("userHistory", JSON.stringify(updatedHistory));
      } catch (e) {
        console.error("Failed to save userHistory to localStorage:", e);
      }
    }
    if (userProfile?.major && userProfile?.priority) {
      fetchSuggestions(
        input,
        newTag,
        filters,
        userProfile,
        userHistory,
        eventHistory
      );
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    if (userProfile?.major && userProfile?.priority) {
      fetchSuggestions(
        input,
        selectedTag,
        newFilters,
        userProfile,
        userHistory,
        eventHistory
      );
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name === "drlNeeded" && userProfile?.priority === "drl") {
      const drlValues = value ? [parseInt(value)] : [];
      setUserProfile({ ...userProfile, drlNeeded: drlValues });
      toast.success("Đã cập nhật tiêu chí ĐRL thiếu!");
    } else if (name === "interests") {
      const newInterests = userProfile?.interests?.includes(value)
        ? userProfile.interests.filter((i) => i !== value)
        : [...userProfile.interests, value];
      setUserProfile({ ...userProfile, interests: newInterests });
      toast.success("Đã cập nhật sở thích của bạn!");
    } else {
      setUserProfile({ ...userProfile, [name]: value });
      toast.success("Đã cập nhật hồ sơ của bạn!");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (userProfile?.major && userProfile?.priority) {
      fetchSuggestions(
        input,
        selectedTag,
        filters,
        userProfile,
        userHistory,
        eventHistory
      );
    } else {
      toast.warn("Vui lòng chọn ngành và ưu tiên trước khi tìm kiếm!");
    }
  };

  const handleRegister = (event) => {
    setEventHistory([...new Set([...eventHistory, event])]);
    setUserHistory((prev) => {
      const updated = { ...prev };
      (event?.tags || []).forEach(
        (tag) => (updated[tag] = (updated[tag] || 0) + 1)
      );
      try {
        localStorage.setItem("userHistory", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save userHistory to localStorage:", e);
      }
      return updated;
    });
    setUserProfile((prev) => {
      const newDrlTotal = Math.min(
        (prev?.drlTotal || 0) + (event?.drlPoints || 0),
        100
      );
      const newDrlAchieved = event?.drlCriteria
        ? [...new Set([...(prev?.drlAchieved || []), event.drlCriteria])]
        : prev.drlAchieved;
      const target = parseInt(drlTarget) || 100;
      if (newDrlTotal >= target) {
        toast.success(`Chúc mừng! Bạn đã đạt mục tiêu ${target} ĐRL! 🎉`);
      }
      return {
        ...prev,
        drlTotal: newDrlTotal,
        drlAchieved: newDrlAchieved
      };
    });
    toast.success(
      `Đã đăng ký sự kiện: ${event?.title || "Không xác định"}! Cộng ${
        event?.drlPoints || 0
      } ĐRL`
    );
  };

  const handleDrlTarget = () => {
    const target = parseInt(drlTarget) || 100;
    if (isNaN(target) || target < (userProfile?.drlTotal || 0)) {
      toast.error("Mục tiêu ĐRL phải lớn hơn điểm hiện tại!");
      return;
    }
    if (target > 100) {
      toast.error("Mục tiêu ĐRL không được vượt quá 100!");
      return;
    }
    try {
      localStorage.setItem("drlTarget", target.toString());
    } catch (e) {
      console.error("Failed to save drlTarget to localStorage:", e);
    }
    const roadmap = generateDrlTargetRoadmap(userProfile, events, target);
    setDrlTargetRoadmap(roadmap);
    setShowDrlTarget(true);
    toast.success(`Đã tạo lộ trình để đạt ${target} ĐRL!`);
  };

  const remainingDrlPoints = drlTarget
    ? (parseInt(drlTarget) || 100) - (userProfile?.drlTotal || 0)
    : 100 - (userProfile?.drlTotal || 0);

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <FaCalendar className="text-blue-500 mr-2" size={32} />
            <h1 className="text-3xl sm:text-4xl font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 whitespace-normal break-words leading-tight">
              UniFlow: Sự kiện Học thuật
            </h1>
          </div>
          <p className="text-gray-600 text-center mb-8">
            Tìm kiếm hội thảo, cuộc thi, học bổng và lộ trình ĐRL với UniBot!
          </p>

          {/* User Profile with Progress Bar */}
          <div className="mb-12 bg-gray-50 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              Cập nhật Hồ sơ Học thuật
            </h2>
            <p className="text-gray-600 mb-4">
              Cung cấp thông tin để nhận gợi ý sự kiện học thuật phù hợp.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiến trình ĐRL
              </label>
              <div className="w-full bg-gray-200 rounded-full h-6 mb-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-teal-500 text-xs font-medium text-white text-center p-1 rounded-full transition-all duration-500"
                  style={{ width: `${userProfile?.drlTotal || 0}%` }}
                >
                  {userProfile?.drlTotal || 0}/100
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Đã đạt: {(userProfile?.drlAchieved || []).length}/5 tiêu chí (
                {(userProfile?.drlAchieved || []).join(", ")})
              </p>
              <p className="text-sm text-red-600 font-medium">
                Tiêu chí còn thiếu:{" "}
                {(userProfile?.drlNeeded || []).join(", ") || "Không có"}
              </p>
              <p className="text-sm text-orange-600 font-medium">
                Điểm còn thiếu để đạt {drlTarget || 100} ĐRL:{" "}
                {remainingDrlPoints > 0 ? remainingDrlPoints : 0}
              </p>
              <div className="flex gap-2 mt-2 items-center">
                {userProfile?.drlNeeded?.length > 0 && (
                  <button
                    onClick={() =>
                      handleChatSubmit({
                        preventDefault: () => {},
                        target: {
                          value: `Gợi ý sự kiện học thuật cho ĐRL ${userProfile.drlNeeded[0]}`
                        }
                      })
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                  >
                    Xem gợi ý
                  </button>
                )}
                <input
                  type="number"
                  value={drlTarget}
                  onChange={(e) => setDrlTarget(e.target.value)}
                  placeholder="Nhập mục tiêu ĐRL (tối đa 100)"
                  className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                  min={userProfile?.drlTotal || 0}
                  max={100}
                />
                <button
                  onClick={handleDrlTarget}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center"
                >
                  <FaBullseye className="mr-2" /> Tạo lộ trình
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngành học
                </label>
                <select
                  name="major"
                  value={userProfile?.major || ""}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {majorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ưu tiên
                </label>
                <select
                  name="priority"
                  value={userProfile?.priority || ""}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {userProfile?.priority === "drl" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu chí ĐRL cần đạt
                  </label>
                  <select
                    name="drlNeeded"
                    value={userProfile?.drlNeeded[0] || ""}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {drlOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sở thích
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      handleProfileChange({
                        target: { name: "interests", value: option.value }
                      })
                    }
                    className={`px-3 py-1 rounded-full text-sm ${
                      userProfile?.interests?.includes(option.value)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lộ trình đạt mục tiêu ĐRL */}
          {showDrlTarget && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                Lộ trình Đạt {drlTarget || 100} ĐRL
              </h2>
              <p className="text-gray-600 mb-4">
                Bạn cần {remainingDrlPoints > 0 ? remainingDrlPoints : 0} điểm
                để đạt {drlTarget || 100} ĐRL. Dưới đây là các sự kiện học thuật
                gợi ý:
              </p>
              {drlTargetRoadmap.length > 0 ? (
                <VerticalTimeline layout="1-column-left">
                  {drlTargetRoadmap.map((event) => (
                    <VerticalTimelineElement
                      key={event.id}
                      date={event.time}
                      icon={<FaBullseye />}
                      iconStyle={{ background: "#7c3aed", color: "#fff" }}
                    >
                      <div className="bg-white rounded-lg p-4 shadow-md">
                        <h4 className="text-lg font-bold text-gray-800">
                          {event.title}
                        </h4>
                        <p className="text-gray-600 mb-1">{event.location}</p>
                        <p className="text-gray-600 mb-2">{event.reason}</p>
                        <button
                          onClick={() => handleRegister(event)}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all"
                        >
                          Đăng ký
                        </button>
                      </div>
                    </VerticalTimelineElement>
                  ))}
                </VerticalTimeline>
              ) : (
                <p className="text-gray-500 text-center">
                  Không có sự kiện học thuật phù hợp để đạt {drlTarget || 100}{" "}
                  ĐRL. Thử thay đổi bộ lọc!
                </p>
              )}
            </div>
          )}

          {/* Search and Filters */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              Tìm kiếm Sự kiện Học thuật
            </h2>
            <p className="text-gray-600 mb-4">
              Nhập từ khóa hoặc chọn tag để tìm hội thảo, cuộc thi, học bổng.
            </p>
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Hội thảo AI, học bổng"
                    className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  disabled={isLoading}
                >
                  Tìm
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTag === tag
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-all`}
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                  <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="time"
                    value={filters.time}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
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
                    className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {locationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="timeOfDay"
                    value={filters.timeOfDay}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {timeOfDayOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>

            {isLoading ? (
              <div className="text-center">
                <ClipLoader color="#2563eb" size={40} />
                <p className="text-blue-600 mt-2">Đang tìm kiếm...</p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  Kết quả Gợi ý Sự kiện Học thuật
                </h3>
                {suggestedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suggestedEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 ${
                          isToday(event) ? "border-2 border-yellow-500" : ""
                        }`}
                      >
                        {isToday(event) && (
                          <p className="text-yellow-600 font-bold mb-2">
                            Diễn ra hôm nay!
                          </p>
                        )}
                        <img
                          src={
                            event.imageUrl ||
                            "https://via.placeholder.com/300x200"
                          }
                          alt={event.title}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                          onError={(e) =>
                            (e.target.src =
                              "https://via.placeholder.com/300x200")
                          }
                        />
                        <h4 className="text-lg font-bold text-gray-800 mb-2">
                          {event.title}
                        </h4>
                        <p className="text-gray-600 mb-1 flex items-center">
                          <FaCalendar className="mr-2" /> {event.time}
                        </p>
                        <p className="text-gray-600 mb-1 flex items-center">
                          <FaMapMarkerAlt className="mr-2" /> {event.location}
                        </p>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {event.description}
                        </p>
                        {new Date(event.time) > new Date() &&
                          new Date(event.time) <=
                            new Date(
                              new Date().getTime() + 3 * 24 * 60 * 60 * 1000
                            ) && <CountdownTimer eventTime={event.time} />}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRegister(event)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all"
                          >
                            Đăng ký
                          </button>
                          {event.hasSeating && (
                            <button
                              onClick={() => setShowSeatingModal(event)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                            >
                              <FaChair className="inline mr-1" /> Chọn ghế
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    Không tìm thấy sự kiện học thuật. Thử từ khóa hoặc tag khác!
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              Lộ trình Sự kiện Học thuật Cá nhân
            </h2>
            <p className="text-gray-600 mb-4">
              Gợi ý 3 sự kiện học thuật trong 30 ngày tới dựa trên hồ sơ của
              bạn.
            </p>
            {roadmapEvents.length > 0 ? (
              <VerticalTimeline layout="1-column-left">
                {roadmapEvents.map((event) => (
                  <VerticalTimelineElement
                    key={event.id}
                    date={event.time}
                    icon={<FaCalendar />}
                    iconStyle={{ background: "#2563eb", color: "#fff" }}
                  >
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <h4 className="text-lg font-bold text-gray-800">
                        {event.title}
                      </h4>
                      <p className="text-gray-600 mb-1">{event.location}</p>
                      <p className="text-gray-600 mb-2">{event.reason}</p>
                      <button
                        onClick={() => handleRegister(event)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all"
                      >
                        Đăng ký
                      </button>
                    </div>
                  </VerticalTimelineElement>
                ))}
                ABET: <FaCalendar />
              </VerticalTimeline>
            ) : (
              <p className="text-gray-500 text-center">
                Không có sự kiện học thuật trong 30 ngày tới. Cập nhật hồ sơ để
                xem thêm!
              </p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              Trò chuyện với UniBot
            </h2>
            <p className="text-gray-600 mb-4">
              Hỏi UniBot về hội thảo, học bổng, hoặc điểm rèn luyện học thuật.
            </p>
            <div className="h-64 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                    {msg.events?.map((event) => (
                      <div
                        key={event.id}
                        className="mt-2 p-2 bg-gray-100 rounded"
                      >
                        <p className="font-bold">{event.title}</p>
                        <p>
                          {event.time} - {event.location}
                        </p>
                        <p>{event.reason}</p>
                        <button
                          onClick={() => handleRegister(event)}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mt-1"
                        >
                          Đăng ký
                        </button>
                      </div>
                    ))}
                  </span>
                </div>
              ))}
            </div>
            <form
              onSubmit={handleChatSubmit}
              className="flex items-center gap-4"
            >
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={({ value }) =>
                  setSuggestions(getSuggestions(value))
                }
                onSuggestionsClearRequested={() => setSuggestions([])}
                getSuggestionValue={(suggestion) => suggestion}
                renderSuggestion={renderSuggestion}
                inputProps={{
                  value: chatInput,
                  onChange: (e, { newValue }) => setChatInput(newValue),
                  placeholder: "Hỏi gì nhỉ? Ví dụ: Hội thảo ĐRL 1?",
                  className:
                    "flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                }}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>

          {showSeatingModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">
                  Chọn ghế cho {showSeatingModal.title}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {["A1", "A2", "B1", "B2"].map((seat) => (
                    <button
                      key={seat}
                      onClick={() => handleSelectSeat(showSeatingModal, seat)}
                      className="p-2 bg-gray-200 rounded hover:bg-blue-500 hover:text-white transition-all"
                    >
                      {seat}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowSeatingModal(null)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
