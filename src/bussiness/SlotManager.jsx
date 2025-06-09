import React, { useState } from "react";
import databasesService from "../Appwrite/Database";

const SlotManager = ({ businessId, onSlotAdded }) => {
  const [dateTime, setDateTime] = useState("");

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!dateTime) return;
    try {
      await databasesService.createSlot(businessId, dateTime);
      setDateTime("");
      onSlotAdded?.();
    } catch (error) {
      console.error("Error creating slot:", error);
    }
  };
  return (
    <div>
      <form onSubmit={handleCreateSlot} className="flex items-center space-x-2">
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
          className="border p-1 rounded"
        />
        <button
          type="submit"
          className="px-4 py-1 bg-blue-500 text-white rounded"
        >
          Add Slot
        </button>
      </form>
    </div>
  );
};

export default SlotManager;
