import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import authservice from "../Appwrite/Auth";

const Resetpassword = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const userId = search.get("userId");
  const secret = search.get("secret");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [message, setMessage] = useState("");

  // If either param is missing, send them back to “Forgot password”
  useEffect(() => {
    if (!userId || !secret) {
      navigate("/forget-password");
    }
  }, [userId, secret]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPw) {
      return setMessage("❌ Passwords don’t match.");
    }

    try {
      await authservice.resetPassword(userId, secret, newPassword, confirmPw);
      setMessage("✅ Password reset! Redirecting to login…");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Reset failed:", err);
      setMessage("❌ Reset failed—maybe that link expired?");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 via-teal-500 to-blue-500 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">Reset Password</h2>
          <p className="mt-1 text-green-200">Choose a strong new password.</p>
        </div>

        <div className="p-8 space-y-6">
          {message ? (
            <div className="text-center text-blue-600 font-medium">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
              >
                Set New Password
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500">
            <Link to="/log-in" className="text-blue-600 hover:underline">
              Back to Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resetpassword;
