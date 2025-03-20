// src/components/Navbar.jsx

import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export const NavbarComponent = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all ${
        scrolled ? "bg-gray-900 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <a href="#home">
          <img src={logo} alt="Logo" className="w-36 h-auto" />
        </a>

        {/* Navigation Links */}
        <div className="hidden lg:flex space-x-6">
          {["about", "pricing", "contact", "blog", "faq"].map((link) => (
            <a
              key={link}
              href={`#${link}`}
              className={`text-white text-lg font-medium ${
                activeLink === link
                  ? "opacity-100"
                  : "opacity-75 hover:opacity-100"
              }`}
              onClick={() => onUpdateActiveLink(link)}
            >
              {link.charAt(0).toUpperCase() + link.slice(1)}
            </a>
          ))}
        </div>

        {/* Login & Sign Up Buttons */}
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-gray-900 transition"
            onClick={() => console.log("Login")}
          >
            Login
          </button>
          <button
            className="px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-200 transition"
            onClick={() => console.log("Sign Up")}
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          {/* Hamburger Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default NavbarComponent;
