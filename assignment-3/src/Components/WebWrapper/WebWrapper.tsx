import React from "react";

const WebWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="pt-16 w-full min-h-screen flex flex-col 
      bg-gradient-to-br from-[#fff8f0] via-[#ffe5b4] to-[#f8cba6]
      bg-[url('./assets/images/hero-bg.jpg')] bg-no-repeat bg-cover bg-center
      overflow-x-hidden text-[#3b2f2f]"
    >
      {children}
    </div>
  );
};

export default WebWrapper;
