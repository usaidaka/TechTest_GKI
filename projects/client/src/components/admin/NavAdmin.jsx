import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";
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
    <div className="w-72 h-screen">
      <div className="flex justify-center items-center mt-5">
        <img src={buLogo} alt="" className="w-20" />
      </div>
      <Sidebar aria-label="Default sidebar example">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              icon={HiChartPie}
              className={`${isCurrentPath === "/admin" ? "bg-slate-200" : ""}`}
            >
              <Link to="/admin">Dashboard</Link>
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiUser}
              className={`${
                isCurrentPath === "/admin/manajemen-user" ? "bg-slate-200" : ""
              }`}
            >
              <Link to="/admin/manajemen-user">Manajemen Users</Link>
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiShoppingBag}
              className={`${
                isCurrentPath === "/admin/manajemen-produk"
                  ? "bg-slate-200"
                  : ""
              }`}
            >
              <Link to="/admin/manajemen-produk">Manajem Products</Link>
            </Sidebar.Item>
            <Sidebar.Item
              href="#"
              icon={HiArrowSmLeft}
              className="hover:bg-red-500 hover:text-white "
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default NavAdmin;
