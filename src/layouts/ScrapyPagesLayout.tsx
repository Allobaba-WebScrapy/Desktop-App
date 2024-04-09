import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/global/Navbar";
const ScrapyPagesLayout: React.FC = () => {
  // navbar on scroll effect
  const [navStyle, setNavStyle] = useState("mt-2");
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrolledDown = prevScrollPos < currentScrollPos;

      setPrevScrollPos(currentScrollPos);

      // Show the navbar if scrolling up or at the top

      if (window.scrollY > 10) {
        if (!isScrolledDown) {
          setNavStyle("mt-0 px-0  rounded-none");
        } else {
          setNavStyle("display-none  hidden");
        }
      } else {
        setNavStyle("bg-none mt-2");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);
  
  return (
    <div >
      <div className={[
          "fixed z-10 w-full   shadow-lg px-2 rounded-lg duration-300 transition-all bg-card",
          navStyle,
        ].join(" ")} >

        <Navbar />
      </div>
      <div className="pt-20">

        <Outlet />
      </div>
    </div>
  );
};

export default ScrapyPagesLayout;