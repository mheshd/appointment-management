import React, { useState } from "react";
import authservice from "../Appwrite/Auth";
import { Link } from "react-router-dom";

const Forgetpassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authservice.sendRecoveryEmail(email);
      setMessage("✅ Check your inbox for password-reset instructions!");
    } catch (err) {
      console.error("Recovery error:", err);
      setMessage("❌ Failed to send reset email. Try again.");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">Forgot Password</h2>
          <p className="mt-1 text-purple-200">
            No worries, we'll get you back on track.
          </p>
        </div>

        <div className="p-8 space-y-6">
          {message ? (
            <div className="text-center text-green-600 font-medium">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500">
            <Link to="/log-in" className="text-purple-600 hover:underline">
              Back to Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forgetpassword;
