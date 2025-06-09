import React, { useEffect, useState } from "react";
import databasesService from "../Appwrite/Database";
import authservice from "../Appwrite/Auth";
import AppointmentForm from "./AppointmentForm";
import Calendar from "../component/Calendar";
import AppointmentList from "./AppointmentList";

const Dashboard = () => {
  const [customerId, setCustomerId] = useState(null);
  const [userDoc, setUserDoc] = useState({});
  const [selectedBizId, setSelectedBizId] = useState("");
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "" });
  const [purpose, setPurpose] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [reschedulingAppt, setReschedulingAppt] = useState(null);
  const [rescheduleSlot, setRescheduleSlot] = useState(null);

  // 1) On mount, get current user and their document
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authservice.getUser();
        if (user) {
          setCustomerId(user.$id);
          const doc = await databasesService.getUserByAppwriteId(user.$id);
          setUserDoc(doc || {});
          setCustomerInfo({ name: doc.name, email: doc.email });
        }
      } catch (error) {
        console.error("Error fetching user doc:", error);
      }
    };
    loadUser();
  }, []);

  // 2) Load this customer’s existing appointments when customerId changes
  useEffect(() => {
    if (!customerId) return;
    const loadAppointments = async () => {
      setLoadingAppts(true);
      try {
        const appts = await databasesService.listAppointmentsByCustomer(
          customerId
        );
        setAppointments(appts);
      } catch (error) {
        console.error("Error listing customer appts:", error);
      } finally {
        setLoadingAppts(false);
      }
    };
    loadAppointments();
  }, [customerId]);

  // When calendar slot is clicked, select it
  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  // Called when the "Book Appointment" button is pressed
  const handleBookAppointment = async () => {
    if (!selectedSlot || !selectedBizId || !purpose) return;
    try {
      // 1) Create the appointment document
      await databasesService.createAppointment({
        customerId,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        businessId: selectedBizId,
        dateTime: selectedSlot.dateTime,
        purpose,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      // 2) Mark that slot as booked
      await databasesService.bookSlot(selectedSlot.slotId);

      // 3) Clear selection & refresh calendar
      setSelectedSlot(null);
      setSelectedBizId((b) => b);

      // 4) Reload appointments list
      const appts = await databasesService.listAppointmentsByCustomer(
        customerId
      );
      setAppointments(appts);
    } catch (error) {
      console.error("Booking error:", error.message);
    }
  };

  // Called when the customer clicks "Cancel" on an appointment
  const handleCancelAppointment = async (appointmentId) => {
    try {
      await databasesService.updateAppointmentStatus(
        appointmentId,
        "cancelled"
      );
      setAppointments((prev) =>
        prev.map((a) =>
          a.$id === appointmentId ? { ...a, status: "cancelled" } : a
        )
      );
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const handleReschedule = (appointment) => {
    setReschedulingAppt({
      id: appointment.$id,
      businessId: appointment.businessId,
    });
    setRescheduleSlot(null);
  };

  const handleRescheduleSlot = async ({ slotId, dateTime }) => {
    setRescheduleSlot({ slotId, dateTime });
  };

  const confirmReschedule = async () => {
    if (!reschedulingAppt || !rescheduleSlot) return;
    try {
      const { id, businessId } = reschedulingAppt;
      const { slotId, dateTime } = rescheduleSlot;
      // a) Free the old slot? (optional: if you tracked old slotId)
      // b) Book the new slot
      await databasesService.bookSlot(slotId);

      // c) Update the appointment’s dateTime
      await databasesService.updateAppointmentDate(id, dateTime);

      setReschedulingAppt(null);
      setRescheduleSlot(null);
      const appts = await databasesService.listAppointmentsByCustomer(
        customerId
      );
      setAppointments(appts);
    } catch (error) {
      console.error("Reschedule error:", error);
    }
  };

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold">Customer Dashboard</h2>

      {/* 1. AppointmentForm */}
      <AppointmentForm
        selectedBizId={selectedBizId}
        onBusinessChange={(biz) => {
          setSelectedBizId(biz);
          setSelectedSlot(null);
        }}
        onCustomerInfoChange={setCustomerInfo}
        onPurposeChange={setPurpose}
        selectedSlot={selectedSlot}
        onBook={handleBookAppointment}
      />

      {/* 2. Calendar */}

      {selectedBizId && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Pick a Slot</h3>
          <Calendar
            businessId={selectedBizId}
            mode="customer"
            onSelectSlot={handleSlotClick}
          />
          {selectedSlot && (
            <p className="mt-2">
              Selected:{" "}
              <strong>
                {new Date(selectedSlot.dateTime).toLocaleString()}
              </strong>
            </p>
          )}
        </div>
      )}

      {/* 3. AppointmentList */}
      <div>
        <h3 className="text-xl font-semibold mb-2">My Appointments</h3>
        <AppointmentList
          appointments={appointments}
          loading={loadingAppts}
          onCancel={handleCancelAppointment}
          onReschedule={(appointmentId) => {
            const appointment = appointments.find(
              (a) => a.$id === appointmentId
            );
            handleReschedule(appointment);
          }}
        />
      </div>

      {/* Reschedule Panel */}
      {reschedulingAppt && (
        <div className="bg-indigo-50 rounded-lg shadow-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold">Reschedule Appointment</h3>
          <p>
            Pick a new slot for appointment{" "}
            <strong>{reschedulingAppt.id}</strong>
          </p>
          <Calendar
            businessId={reschedulingAppt.businessId}
            mode="customer"
            onSelectSlot={handleRescheduleSlot}
          />
          {rescheduleSlot && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p>
                New slot:{" "}
                <strong>
                  {new Date(rescheduleSlot.dateTime).toLocaleString()}
                </strong>
              </p>
              <button
                onClick={confirmReschedule}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Confirm Reschedule
              </button>
              <button
                onClick={() => setReschedulingAppt(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
