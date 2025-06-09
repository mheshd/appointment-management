import React, { useEffect, useState } from "react";
import databasesService from "../Appwrite/Database";
import AppointmentCard from "../component/AppointmentCard";

const STATUSES = ["all", "pending", "confirmed", "paid", "cancelled"];

const AppointmentReport = ({ businessId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const appts = await databasesService.listAppointmentsByBusiness(
        businessId
      );
      setAppointments(appts);
    } catch (error) {
      console.error("Error listing appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchAppointments();
    }
  }, [businessId]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await databasesService.updateAppointmentStatus(appointmentId, newStatus);
      await fetchAppointments(); // Refresh data
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filtered =
    filterStatus === "all"
      ? appointments
      : appointments.filter((a) => a.status === filterStatus);

  return (
    <div className="w-full px-4 md:px-8 py-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm 
              ${
                filterStatus === s
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10 text-gray-500 text-lg animate-pulse">
          Loading appointments...
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No{" "}
          <span className="capitalize font-semibold text-gray-500">
            {filterStatus}
          </span>{" "}
          appointments found.
        </div>
      )}

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading &&
          filtered.map((appt) => (
            <AppointmentCard
              key={appt.$id}
              appointment={appt}
              onChangeStatus={handleStatusChange}
            />
          ))}
      </div>
    </div>
  );
};

export default AppointmentReport;
