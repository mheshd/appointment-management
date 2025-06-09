import React, { useEffect, useState } from "react";
import authservice from "../Appwrite/Auth";
import databasesService from "../Appwrite/Database";
import Calendar from "../component/Calendar";
import AppointmentReport from "./AppointmentReport";
import SlotManager from "./SlotManager";

const BusinessDashboard = () => {
  const [businessId, setBusinessId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loaduser = async () => {
      try {
        const user = await authservice.getUser();
        if (user) {
          setBusinessId(user.$id);
        }
      } catch (error) {
        console.error("Error getting current user:", error);
      }
    };
    loaduser();
  }, []);

  if (!businessId) {
    return <div>Loading business data…</div>;
  }

  // Called when SlotManager successfully adds a slot
  const handleSlotAdded = () => setRefreshKey((n) => n + 1);

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold">Business Dashboard</h2>
      <SlotManager businessId={businessId} onSlotAdded={handleSlotAdded} />

      {/* 2. Calendar (business mode): show all slots (blue/“Available” & red/“Booked”) */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Manage Slots</h3>
        <Calendar
          businessId={businessId}
          mode="business"
          refreshKey={refreshKey}
          onSlotClick={async ({ slotId }) => {
            await databasesService.deleteSlot(slotId);
            handleSlotAdded();
          }}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Appointments Report</h3>
        <AppointmentReport businessId={businessId} />
      </div>
    </div>
  );
};

export default BusinessDashboard;
