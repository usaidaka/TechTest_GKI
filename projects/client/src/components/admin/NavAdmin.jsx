import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiChartPie,
  HiShoppingBag,
  HiUser,
  HiArrowSmLeft,
} from "react-icons/hi";
import buLogo from "../../assets/android-chrome-192x192.png";

const NavAdmin = () => {
  const location = useLocation();
  const isCurrentPath = location.pathname;
  return (
    <div className="w-72 h-screen bg-white">
      <div className="flex justify-center items-center mt-5">
        <Link to="/admin">
          <img src={buLogo} alt="" className="w-20" />
        </Link>
      </div>
      <div className="h-fit mx-2 mt-5">
        <Link
          to="/admin"
          className={`${
            isCurrentPath === "/admin" ? "bg-slate-200" : ""
          } flex mx-1 justify-start px-2 py-2 rounded-md items-center gap-4`}
        >
          <span>
            <HiChartPie className="text-2xl text-gray-500" />
          </span>
          <p>Dashboard</p>
        </Link>
        <Link
          to="/admin/manajemen-user"
          className={`${
            isCurrentPath === "/admin/manajemen-user" ? "bg-slate-200" : ""
          } flex mx-1 justify-start px-2 py-2 rounded-md items-center gap-4`}
        >
          <span>
            <HiUser className="text-2xl text-gray-500" />
          </span>
          <p>Manajemen Users</p>
        </Link>
        <Link
          to="/admin/manajemen-produk"
          className={`${
            isCurrentPath === "/admin/manajemen-produk" ? "bg-slate-200" : ""
          } flex mx-1 justify-start px-2 py-2 rounded-md items-center gap-4`}
        >
          <span>
            <HiShoppingBag className="text-2xl text-gray-500" />
          </span>
          <p>Manajemen Produk</p>
        </Link>
        <Link
          to="/admin/manajemen-produk"
          className={`hover:bg-red-500 hover:text-white  flex mx-1 justify-start px-2 py-2 rounded-md items-center gap-4`}
        >
          <span>
            <HiArrowSmLeft className="text-2xl text-gray-500" />
          </span>
          <p>Sign Out</p>
        </Link>
      </div>
    </div>
  );
};

export default NavAdmin;
