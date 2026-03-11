import React from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Event } from "../types";
import { format, isPast, isToday } from "date-fns";
import EventDetailModal from "../components/EventDetailModal";

const Events = () => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [activeTab, setActiveTab] = React.useState<
    "past" | "current" | "future"
  >("current");
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Helper function to categorize events based on date
  const categorizeEvent = (eventDate: string): "past" | "current" | "future" => {
    const date = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDateOnly = new Date(date);
    eventDateOnly.setHours(0, 0, 0, 0);

    if (isPast(eventDateOnly) && !isToday(eventDateOnly)) {
      return "past";
    } else if (isToday(eventDateOnly)) {
      return "current";
    } else {
      return "future";
    }
  };

  React.useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: activeTab === "past" ? false : true });

      if (data) {
        const mappedEvents = data.map((event) => ({
          ...event,
          imageUrl: event.image_url,
          videoUrl: event.video_url,
        }));

        // Filter events based on active tab
        const filteredEvents = mappedEvents.filter(
          (event) => categorizeEvent(event.date) === activeTab
        );

        setEvents(filteredEvents);
      }
    };

    fetchEvents();
  }, [activeTab]);

  return (
    <div className="space-y-8 sm:space-y-12">
      <section className="relative h-50 sm:h-150  overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3"
            alt="Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-30" />
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
        <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-gray-200 dark:border-gray-700">
          {(["past", "current", "future"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-6 rounded py-2 sm:py-3 text-base sm:text-lg font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "bg-linear-to-r from-blue-600 to-blue-500 dark:from-red-600 dark:to-red-500 text-white border-blue-600 dark:border-red-600"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
            </button>
          ))}
        </div>

        {/* Event List */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
              onClick={() => handleEventClick(event)}
            >
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-40 sm:h-48 object-cover"
                />
              )}
              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span className="truncate">
                      {format(new Date(event.date), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 shrink-0 text-blue-600 dark:text-red-400" />
                    <span className="truncate">
                      {format(new Date(event.date), "h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 shrink-0 text-blue-600 dark:text-red-400" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {event.videoUrl && (
                  <div className="mt-4">
                    <a
                      href={event.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm sm:text-base inline-flex items-center cursor-pointer"
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
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No events found for this category.
            </p>
          </div>
        )}
      </div>
      
      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

    </div>
  );
};

export default Events;
