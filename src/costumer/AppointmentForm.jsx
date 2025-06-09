import React, { useEffect, useState } from "react";
import databasesService from "../Appwrite/Database";
const AppointmentForm = ({
  selectedBizId,
  onBusinessChange,
  onCustomerInfoChange,
  onPurposeChange,
  onBook,
  selectedSlot,
}) => {
  const [businesses, setBusinesses] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [purpose, setPurposeLocal] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const bizUsers = await databasesService.listBusinessUsers();
        setBusinesses(
          bizUsers.map((d) => ({
            userId: d.userId,
            businessName: d.businessName,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    onCustomerInfoChange?.({ name: customerName, email: customerEmail });
  }, [customerName, customerEmail, onCustomerInfoChange]);

  useEffect(() => {
    onPurposeChange?.(purpose);
  }, [purpose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onBook) onBook();
    // Clear input fields after booking
    setCustomerName("");
    setCustomerEmail("");
    setPurposeLocal("");
    setIsFormOpen(false);
  };

  const isDisabled = !selectedBizId || !purpose || !selectedSlot;

  if (!isFormOpen) {
    return (
      <div className="text-center my-6">
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Book Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mb-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Book Appointment</h2>
        <button
          onClick={() => setIsFormOpen(false)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Business selection */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Select Business *
            </label>
            <select
              value={selectedBizId}
              onChange={(e) => onBusinessChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            >
              <option value="">-- Select Business --</option>
              {businesses.map((b) => (
                <option key={b.userId} value={b.userId}>
                  {b.businessName}
                </option>
              ))}
            </select>
          </div>

          {/* Purpose */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Purpose *
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurposeLocal(e.target.value)}
              placeholder="Meeting purpose"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Your Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Your Email *
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsFormOpen(false)}
            className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isDisabled}
            className={`px-5 py-2.5 text-white font-medium rounded-lg transition ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
