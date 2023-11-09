import React from "react";
import buLogo from "../../assets/android-chrome-512x512.png";
import InputSearch from "../global/InputSearch";
import { useLocation } from "react-router-dom";
import ButtonLink from "../global/ButtonLink";
import { useSelector } from "react-redux";
import { getLocalStorage } from "../../utils/tokenGetterSetter";
import { Badge } from "flowbite-react";

const NavUser = () => {
  const userDoc = useSelector((state) => state.userDocument.value);
  const access_token = getLocalStorage("access_token");
  const location = useLocation();
  const isAdmin = location.pathname.includes("admin");
  return (
    <div className="sticky top-0 w-full bg-white shadow-md h-12 flex justify-center items-center py-7 z-50">
      <div
        className={`${
          isAdmin
            ? "flex justify-between mx-10 w-full"
            : "grid grid-cols-3 w-full h-fit"
        } `}
      >
        <div className="col-span-1 ml-10">
          <img src={buLogo} alt="" className="w-10" />
        </div>
        {isAdmin ? null : (
          <div className="col-span-1 flex w-full justify-center">
            <InputSearch
              name="search-product"
              id="search-product"
              placeholder="Temukan Produk"
            />
          </div>
        )}
        {access_token && userDoc ? (
          <div className="col-span-1 flex items-center justify-center gap-4">
            <div className="w-10 rounded-full overflow-hidden border-2 border-blue-600">
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}${userDoc.image_profile}`}
                alt=""
                className="w-10 "
              />
            </div>
            <h1 className="font-inter">{userDoc.username}</h1>
            <Badge color="success" className="w-fit">
              {userDoc.Role?.name}
            </Badge>
          </div>
        ) : (
          <div className="col-span-1 flex justify-center gap-4">
            <ButtonLink buttonText="Sign In" to="/signin" />
            <ButtonLink buttonText="Sign Up" isStroke={true} to="/signup" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavUser;
