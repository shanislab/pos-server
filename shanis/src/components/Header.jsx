import React from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Header = ({ openMenu, setOpenMenu }) => {
  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-6 z-50 ">
      {/* LOGO */}
      <h1 className="text-[22px] text-white font-semibold">apreatif</h1>

      {/* Desktop NAV */}
      <nav className="hidden md:flex gap-12 text-[11px] tracking-wide text-gray-200">
        <a href="#" className="hover:text-white">WORK</a>
        <a href="#" className="hover:text-white">ABOUT</a>
        <a href="#" className="hover:text-white">PASSION</a>
        <a href="#" className="hover:text-white">BLOG</a>
        <a href="#" className="hover:text-white">CONTACT</a>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-3xl text-white active:scale-90 transition"
        onClick={() => setOpenMenu(!openMenu)}
      >
        {openMenu ? <FiX className="text-white" /> : <FiMenu className="text-white" />}
      </button>
    </header>
  );
};

export default Header;
