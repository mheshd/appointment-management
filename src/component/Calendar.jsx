import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import databasesService from "../Appwrite/Database";

const Calendar = ({
  businessId,
  mode = "customer",
  onSelectSlot,
  refreshKey = 0,
}) => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    if (!businessId) return;

    const fetchSlots = async () => {
      try {
        // 1) Fetch all slots for this business
        let slots = await databasesService.listAvailableSlots(businessId);

        // 2) Remove any slots in the past
        const now = new Date();
        const futureSlots = [];
        for (const slot of slots) {
          const slotTime = new Date(slot.dateTime);
          if (slotTime < now) {
            // auto-delete expired slot
            await databasesService.deleteSlot(slot.$id);
          } else {
            futureSlots.push(slot);
          }
        }
        slots = futureSlots;

        // 3) Map to FullCalendar events
        const fcEvents = slots.map((slot) => ({
          id: slot.$id,
          title: slot.isBooked ? "Booked" : "Available",
          start: slot.dateTime,
          backgroundColor: slot.isBooked ? "#d9534f" : "#5cb85c",
          borderColor: slot.isBooked ? "#c9302c" : "#4cae4c",
          textColor: "#ffffff",
          extendedProps: { isBooked: slot.isBooked },
        }));

        setEvents(fcEvents);
        setSelectedEventId(null);
      } catch (error) {
        console.error("Error loading slots:", error.message);
      }
    };

    fetchSlots();
  }, [businessId, mode, refreshKey]);

  // Handle click on an event
  const handleEventClick = (info) => {
    const clicked = events.find((e) => e.id === info.event.id);
    if (!clicked || clicked.extendedProps.isBooked) return;

    if (clicked.id === selectedEventId) {
      // deselect
      setSelectedEventId(null);
      onSelectSlot(null);
    } else {
      // select
      setSelectedEventId(clicked.id);
      onSelectSlot({ slotId: clicked.id, dateTime: clicked.start });
    }
  };

  // Custom rendering so selected slot gets a ring
  const renderEventContent = (eventInfo) => {
    const isSelected = eventInfo.event.id === selectedEventId;
    return (
      <div
        className={`rounded px-2 py-1 text-sm font-medium ${
          isSelected ? "ring-2 ring-black" : ""
        }`}
        style={{
          backgroundColor: eventInfo.event.backgroundColor,
          border: `1px solid ${eventInfo.event.borderColor}`,
          color: eventInfo.event.textColor,
        }}
      >
        {eventInfo.event.title}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-xl border border-gray-200 p-4 md:p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {mode === "business" ? "Manage Slots" : "Appointment Calendar"}
        </h2>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          timeZone="UTC"
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          events={events}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
        />
      </div>
    </div>
  );
};

export default Calendar;
