import React from "react";
import buLogo from "../../assets/android-chrome-512x512.png";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";

const Footer = () => {
  return (
    <div className="border-t-2 h-72 grid grid-cols-6 px-10 py-5 gap-5">
      <div className="col-span-2 flex flex-col justify-evenly items-center w-72 ml-16 ">
        <img src={buLogo} alt="" className="w-16" />
        <p className="text-center">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero,
          quaerat?
        </p>
        <div className="flex gap-3 text-3xl">
          <FaFacebookSquare />
          <FaSquareXTwitter />
          <AiFillInstagram />
        </div>
      </div>
      <div className="cols-span-1 ">
        <h1 className="font-inter text-xl">Service</h1>
        <ul className="mt-5 font-josefin">
          <li>HELP</li>
          <li>QUESTION AND ANSWER</li>
          <li>CONTACT US</li>
          <li>HOW TO SELL</li>
        </ul>
      </div>
      <div className="cols-span-1 ">
        <h1 className="font-inter text-xl">Our Profile</h1>
        <ul className="mt-5 font-josefin">
          <li>ABOUT US</li>
          <li>CAREER</li>
          <li>BLOG</li>
          <li>PRIVACY POLICY</li>
          <li>TERMS AND CONDITIONS</li>
        </ul>
      </div>
      <div className="cols-span-1 ">
        <h1 className="font-inter text-xl">Partners</h1>
        <ul className="mt-5 font-josefin">
          <li>SUPPLIER</li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
