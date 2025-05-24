import React from "react";
import authservice from "../Appwrite/Auth";
import { useNavigate } from "react-router-dom";

const Logout = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authservice.Logout();
      setIsLoggedIn(false); // Update auth state
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
