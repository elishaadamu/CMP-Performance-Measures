import React from "react";
import Logo from "./assets/MPO_Logo.jpg";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <img src={Logo} className="w-20 pt-1" alt="Logo" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            CMP Performance Measures
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
