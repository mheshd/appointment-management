// src/Home.jsx
import React from "react";

const Home = () => {
  // You can swap out this URL for any Pexels image you like
  const backgroundUrl =
    "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-center bg-cover"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      {/* Centered content */}
      <div className="relative  flex flex-col items-center justify-center h-full px-4 text-center text-white">
        <h1 className="text-4xl  sm:text-5xl md:text-6xl font-extrabold drop-shadow-lg">
          Welcome to My-Appoitment
        </h1>
        <p className="mt-4 max-w-xl text-lg sm:text-xl drop-shadow">
          Schedule, manage, and track appointments effortlessly with our secure
          and intuitive platform.
        </p>
        <button
          onClick={() => (window.location.href = "/signup")}
          className="mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-700 transition rounded-full text-lg font-medium drop-shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
