import React, { useState } from "react";
import AppointmentCard from "../component/AppointmentCard";

const STATUSES = ["all", "pending", "confirmed", "paid", "cancelled"];

const AppointmentList = ({ appointments, loading, onCancel, onReschedule }) => {
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered =
    filterStatus === "all"
      ? appointments
      : appointments.filter((a) => a.status === filterStatus);
  if (loading)
    return (
      <div className="text-center py-10 text-lg text-gray-500 animate-pulse">
        Loading appointments...
      </div>
    );

  if (filtered.length === 0)
    return (
      <div className="text-center py-10 text-gray-400">
        No{" "}
        <span className="capitalize font-medium text-gray-600">
          {filterStatus}
        </span>{" "}
        appointments.
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-semibold border 
              ${
                filterStatus === s
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-blue-100 hover:text-blue-600"
              }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((appt) => (
          <AppointmentCard
            key={appt.$id}
            appointment={appt}
            onCancel={onCancel}
            onReschedule={onReschedule}
          />
        ))}
      </div>
    </div>
  );
};

export default AppointmentList;
