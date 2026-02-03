import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bg from "../assets/projects/programmer-night.webp";
import bg1 from "../assets/projects/herobg.webp";
import { FiMenu, FiX } from "react-icons/fi";
import Project from "../components/Project";
import AboutMe from "../components/AboutMe";
import ContactSection from "../components/ContactSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import logo from "../assets/projects/ms-removebg-preview.png";
import TestimonialSection from "../components/TestimonialSection";

gsap.registerPlugin(ScrollTrigger);

const HeroPage = () => {
  const bgRef = useRef(null);
  const textRef = useRef(null);
  const heroRef = useRef(null);
  const shadowRef = useRef(null);
  const highlightRef = useRef(null);

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    gsap.from(textRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    });

    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "+=100%",
      snap: 1,
    });

    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",

      onLeave: () => {
        gsap.to(heroRef.current, {
          rotateY: -95,
          skewY: -6,
          scale: 0.92,
          opacity: 0,
          transformOrigin: "right center",
          duration: 0.45,
          ease: "power2.inOut",
        });

        gsap.to(shadowRef.current, {
          opacity: 0.55,
          x: -120,
          filter: "blur(22px)",
          duration: 0.45,
          ease: "power2.inOut",
        });

        gsap.to(highlightRef.current, {
          opacity: 0.75,
          x: -50,
          duration: 0.45,
          ease: "power2.inOut",
        });
      },

      onEnterBack: () => {
        gsap.to(heroRef.current, {
          rotateY: 0,
          skewY: 0,
          scale: 1,
          opacity: 1,
          transformOrigin: "left center",
          duration: 0.45,
          ease: "power2.out",
        });

        gsap.to(shadowRef.current, {
          opacity: 0,
          x: 0,
          filter: "blur(0px)",
          duration: 0.45,
        });

        gsap.to(highlightRef.current, {
          opacity: 0,
          x: 0,
          duration: 0.45,
        });
      },
    });
  }, []);

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section
        ref={heroRef}
        className="relative w-full h-screen text-white overflow-hidden"
        style={{ perspective: "2000px" }}
      >
        <div
          ref={shadowRef}
          className="absolute inset-0 bg-black opacity-0 pointer-events-none"
          style={{ filter: "blur(0px)" }}
        ></div>

        <div
          ref={highlightRef}
          className="absolute inset-y-0 right-0 w-[120px] opacity-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, rgba(255,255,255,0.4), transparent)",
          }}
        ></div>

        <img
          src={bg1}
          className="absolute inset-0 w-full h-full object-cover md:hidden"
          alt="mobile-background"
        />

        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-black/70 to-transparent md:hidden"></div>

        <img
          ref={bgRef}
          src={bg}
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          alt="desktop-background"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#c8b57a]/40 via-[#0f1a1f]/40 to-[#0b0f13]/70"></div>

        {/* NAVBAR */}
        <header className="absolute top-0 left-0 w-full h-20 flex items-center justify-between px-8 z-30 fixed">
          <img src={logo} width={190} alt="logo" className="-ms-10 sm:ms-0" />

          <nav className="hidden md:flex gap-12 text-[11px] tracking-wide text-gray-200">
            <a href="#projects" className="hover:text-white">
              PROJECTS
            </a>
            <a href="#testimonials" className="hover:text-white">
              CLIENTS
            </a>
            <a href="#about" className="hover:text-white">
              ABOUT
            </a>
            <a href="#contact" className="hover:text-white">
              CONTACT
            </a>
          </nav>

          <button
            className="md:hidden text-2xl"
            onClick={() => setOpenMenu(!openMenu)}
          >
            {openMenu ? <FiX /> : <FiMenu />}
          </button>
        </header>

        {/* MOBILE MENU */}
        <div
          className={`absolute text-[12px] top-20 left-0 w-full bg-black/60 backdrop-blur-md z-30 py-6 flex flex-col items-center space-y-6 text-lg transition duration-300 ${
            openMenu
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0 pointer-events-none"
          }`}
        >
          <a href="#projects" className="hover:text-white">
            PROJECTS
          </a>
          <a href="#testimonials" className="hover:text-white">
            CLIENTS
          </a>
          <a href="#about" className="hover:text-white">
            ABOUT
          </a>
          <a href="#contact" className="hover:text-white">
            CONTACT
          </a>
        </div>

        {/* SOCIAL LINKS (FIXED CLICK ISSUE) */}
        <div className="absolute top-1/3 right-4 md:right-8 flex flex-col items-end z-40 space-y-16 cursor-pointer">

          {[
            { label: "Github", url: "https://github.com/shaanis" },
            { label: "Whatsapp", url: "https://wa.me/917356379172" },
            { label: "Instagram", url: "https://instagram.com/shaaaanis" },
            {
              label: "LinkedIn",
              url: "https://www.linkedin.com/in/mohammed-shanis-p-14893032b/",
            },
          ].map((item, index) => (
            <div key={index} className="relative h-6 w-20 flex justify-end ">
              {/* CLICKABLE HITBOX */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-50 -rotate-90 origin-right"
              ></a>

              {/* ROTATED TEXT (visual only, non-blocking) */}
              <span className="-rotate-90 origin-right text-[10px] md:text-xs text-gray-300 hover:text-white pointer-events-none">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* HERO TEXT */}
        <div
          ref={textRef}
          className="relative z-20 h-full flex flex-col justify-center px-10 md:px-20"
        >
          <p className="text-[20px] md:text-[28px] text-gray-200 font-light mb-3">
            Full stack developer
          </p>
          <h1 className="text-[35px] md:text-[70px] leading-[0.9] font-bold">
            Mohammed Shanis
          </h1>
        </div>

        {/* DOTS */}
        <div className="absolute bottom-24 w-full flex justify-center gap-4 z-20">
          <span className="w-[8px] h-[8px] rounded-full bg-white"></span>
          <span className="w-[8px] h-[8px] rounded-full border border-gray-200"></span>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-10 right-8 md:right-12 z-20 flex flex-col items-center">
          <span className="text-[10px] md:text-xs tracking-[5px] rotate-90 mb-4 text-gray-300">
            SCROLL
          </span>
          <span className="w-[1px] h-10 bg-gray-200"></span>
        </div>
      </section>

      <Project />
      <AboutMe />
      <FAQSection />
      <TestimonialSection />
      <ContactSection />
      <Footer />
    </>
  );
};

export default HeroPage;
