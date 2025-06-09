import React, { useEffect, useState } from "react";
import Navbar from "./nav/Navbar";

import authservice from "./Appwrite/Auth";
import { Route, Routes } from "react-router-dom";
import Login from "./authentication/Login";
import Signup from "./authentication/Signup";
import Logout from "./authentication/Logout";
import BusinessDashboard from "./bussiness/BusinessDashboard";
import Dashboard from "./costumer/Dashboard";
import Home from "./Home";
import Forgetpassword from "./authentication/Forgetpassword";
import Resetpassword from "./authentication/Resetpassword";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkuser = async () => {
      try {
        const user = await authservice.getUser();
        console.log(user, "userid");

        setIsLoggedIn(!!user);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkuser();
  }, []);
  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/signup"
          element={<Signup setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/logout"
          element={<Logout setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/forget-password" element={<Forgetpassword />} />
        <Route path="/reset-password" element={<Resetpassword />} />

        <Route path="/BusinessDashboard" element={<BusinessDashboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App;
