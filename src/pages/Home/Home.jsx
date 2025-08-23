/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../constant/pathnames";
import events from "../../constant/eventData";
import Banner from "../../components/Banner";
import EventCard from "../../components/EventCard";
import ExploreEvents from "../../components/ExploreEvents";
import EventFeatures from "../../components/EventFeatures";
import WhyUniFlow from "../../components/WhyUniFlow";
import SearchFilter from "../../components/SearchFilter";
import CallToAction from "../../components/CallToAction";
import Testimonials from "../../components/Testimonials";
import UpcomingEvents from "../../components/UpcomingEvents";
import QuickStats from "../../components/QuickStats";

function Home() {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    role: "student",
    preferences: ["academic", "entertainment"],
    major: "Công nghệ thông tin"
  });

  useEffect(() => {
    const updateAuthState = () => {
      try {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth);
          setAuth({
            isLoggedIn: !!parsedAuth.username,
            role: parsedAuth.role || "",
            preferences: parsedAuth.preferences || [],
            major: parsedAuth.major || ""
          });
        } else {
          setAuth({
            isLoggedIn: false,
            role: "",
            preferences: [],
            major: ""
          });
        }
      } catch (err) {
        console.error("Auth parse error:", err);
        setAuth({
          isLoggedIn: false,
          role: "",
          preferences: [],
          major: ""
        });
      }
    };

    updateAuthState();
    window.addEventListener("storage", updateAuthState);
    return () => window.removeEventListener("storage", updateAuthState);
  }, []);

  useEffect(() => {
  }, []);

  const getPersonalizedEvents = () => {
    if (!events || !Array.isArray(events) || events.length === 0) {
      console.warn("No valid events data found");
      return [];
    }

    if (!auth.isLoggedIn || !auth.preferences.length) {
      return events.slice(0, 3);
    }

    const preferenceToTagMap = {
      academic: "học tập",
      entertainment: "giải trí",
      movie: "phim"
    };

    const userPreferenceTags = auth.preferences.map(
      (pref) => preferenceToTagMap[pref] || pref
    );

    const personalized = events
      .filter((event) => {
        const eventTags = event.tags || [];
        const matchesPreference = userPreferenceTags.some((tag) =>
          eventTags.includes(tag)
        );
        const matchesMajor =
          auth.major === "Công nghệ thông tin" && eventTags.includes("cntt");
        return matchesPreference || matchesMajor;
      })
      .slice(0, 3);

    return personalized.length > 0 ? personalized : events.slice(0, 3);
  };

  const filteredEvents = (events && Array.isArray(events) ? events : []).filter(
    (event) => {
      const matchesType = filterType === "all" || event.type === filterType;
      const matchesSearch = event.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-inter">
      <Banner />

      <div className="px-6 py-12 md:px-16 max-w-7xl mx-auto">
        <ExploreEvents />
        <UpcomingEvents />

        {auth.isLoggedIn && auth.role === "student" && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-800 mb-8 text-center animate-fade-in">
              Sự kiện được cá nhân hóa bởi AI
            </h2>
            {getPersonalizedEvents().length === 0 ? (
              <div className="text-center text-gray-600 text-lg">
                <p className="mb-4">Chưa có sự kiện phù hợp với bạn!</p>
                <Link
                  to={PATHS.ALL_EVENTS}
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  Khám phá tất cả sự kiện ngay
                </Link>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {getPersonalizedEvents().map((event) => (
                  <EventCard key={event.id} event={event} showAIBadge={true} />
                ))}
              </div>
            )}
          </section>
        )}

        {auth.isLoggedIn && <EventFeatures />}

        <SearchFilter
          filterType={filterType}
          setFilterType={setFilterType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-800 mb-8 text-center animate-fade-in">
            Sự kiện nổi bật
          </h2>
          {filteredEvents.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              Không tìm thấy sự kiện phù hợp. Hãy thử thay đổi bộ lọc!
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.slice(0, 8).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
          <div className="text-center mt-10 flex justify-center gap-4 flex-wrap">
            {filteredEvents.length > 8 && (
              <Link
                to={PATHS.ALL_EVENTS}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
              >
                Xem tất cả sự kiện
              </Link>
            )}
          </div>
        </section>

        <Testimonials />
        <QuickStats />
        <WhyUniFlow />
        <CallToAction auth={auth} />
      </div>

      <style>{`
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fade-in 0.6s ease-out;
  }
`}</style>

    </div>
  );
}

export default Home;
