import React from "react";
import buLogo from "../../assets/android-chrome-512x512.png";
import Button from "../global/Button";
import InputSearch from "../global/InputSearch";

const NavUser = () => {
  return (
    <div className="static w-full bg-white shadow-md h-12 flex justify-center items-center py-7">
      <div className="grid grid-cols-3 w-full h-fit ">
        <div className="col-span-1 ml-10">
          <img src={buLogo} alt="" className="w-10" />
        </div>
        <div className="col-span-1 flex w-full justify-center">
          <InputSearch
            name="search-product"
            id="search-product"
            placeholder="Temukan Produk"
          />
        </div>
        <div className="col-span-1 flex justify-center gap-4">
          <Button buttonText="MASUK" />
          <Button buttonText="DAFTAR" isStroke={true} />
        </div>
      </div>
    </div>
  );
};

export default NavUser;
