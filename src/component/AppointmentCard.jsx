import React from "react";

const AppointmentCard = ({
  appointment,
  onCancel = null,
  onReschedule = null,
  onChangeStatus = null,
}) => {
  const {
    $id,
    customerName = "Unknown",
    customerEmail = "Unknown",
    dateTime = null,
    purpose = "No purpose",
    status = "pending",
    createdAt = new Date().toISOString(),
    updatedAt = null,
  } = appointment || {};

  const formattedDateTime = dateTime
    ? new Date(dateTime).toLocaleString()
    : "Unknown";
  const formattedCreatedAt = new Date(createdAt).toLocaleDateString();
  const formattedUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleDateString()
    : null;
  const capitalizedStatus =
    typeof status === "string" && status.length > 0
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Unknown";

  // Status badge colors
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    paid: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-800">{purpose}</h3>
          <p className="text-gray-600">
            <span className="font-medium">When:</span> {formattedDateTime}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Booked On:</span> {formattedCreatedAt}
          </p>
        </div>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
            statusClasses[status] || statusClasses.pending
          }`}
        >
          {capitalizedStatus}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-gray-700">
        <div>
          <p className="font-medium">Customer:</p>
          <p>{customerName}</p>
        </div>
        <div>
          <p className="font-medium">Email:</p>
          <p>{customerEmail}</p>
        </div>
      </div>

      {formattedUpdatedAt && (
        <p className="mt-4 text-sm text-gray-500">
          Last Updated: {formattedUpdatedAt}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {onCancel && status !== "cancelled" && (
          <button
            onClick={() => onCancel($id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cancel
          </button>
        )}

        {/* why reshudle btn is not display */}
        {onReschedule && status !== "cancelled" && (
          <button
            onClick={() => onReschedule($id)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Reschedule
          </button>
        )}

        {onChangeStatus && (
          <select
            value={status}
            onChange={(e) => onChangeStatus($id, e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
