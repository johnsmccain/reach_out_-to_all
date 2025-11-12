import React from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Event } from "../types";
import { format } from "date-fns";

const Events = () => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [activeTab, setActiveTab] = React.useState<
    "past" | "current" | "future"
  >("current");

  React.useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("type", activeTab)
        .order("date", { ascending: activeTab !== "past" });

      if (data) {
        setEvents(
          data.map((event) => ({
            ...event,
            imageUrl: event.image_url,
            videoUrl: event.video_url,
          }))
        );
      }
    };

    fetchEvents();
  }, [activeTab]);

  return (
    <div className="space-y-8 sm:space-y-12">
      <section className="relative h-[200px] sm:h-[300px] rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3"
            alt="Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl sm:text-5xl font-bold mb-2 sm:mb-4">
              Events
            </h1>
            <p className="text-lg sm:text-xl">
              Join us in our mission activities and events around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Event Tabs */}
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-gray-200">
          {(["past", "current", "future"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
            </button>
          ))}
        </div>

        {/* Event List */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-40 sm:h-48 object-cover"
                />
              )}
              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 text-sm sm:text-base">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {format(new Date(event.date), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm sm:text-base">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {format(new Date(event.date), "h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm sm:text-base">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {event.videoUrl && (
                  <div className="mt-4">
                    <a
                      href={event.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm sm:text-base inline-flex items-center cursor-pointer"
                    >
                      Watch Event Video
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No events found for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
