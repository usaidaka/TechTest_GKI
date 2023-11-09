import React from "react";
import buLogo from "../../assets/buLogo.png";

const CoverSign = () => {
  return (
    <div className="col-span-1 bg-blue-200 flex flex-col justify-center items-center">
      <div className="w-96 space-y-4">
        <img src={buLogo} alt="" className="w-96 h-96 animate-spin-slow" />
        <h1 className="text-center font-josefin font-bold text-sm">
          Elevate Your Senses, Embrace Your Uniqueness, and Leave a Lasting
          Impression Wherever You Go.
        </h1>
        <h1 className="text-center font-poppins text-xl">Always Be You!</h1>
      </div>
    </div>
  );
};

export default CoverSign;
