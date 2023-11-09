import React from "react";
import CarouselBanner from "../../components/user/CarouselBanner";
import banner1 from "../../assets/banner1.png";
import banner2 from "../../assets/banner2.png";
import banner3 from "../../assets/banner3.png";
import banner4 from "../../assets/banner4.png";
import banner5 from "../../assets/banner5.png";
import NewestProduct from "../../components/user/NewestProduct";
import AvailableProduct from "../../components/user/AvailableProduct";

const imageUrls = [banner1, banner2, banner3, banner4, banner5];
const Home = () => {
  return (
    <div className=" lg:mx-72 mt-6 ">
      <div className=" h-full space-y-4">
        <div className="flex justify-center items-center w-full">
          <CarouselBanner imageUrls={imageUrls} carouselSize="home" />
        </div>
        <NewestProduct />
        <AvailableProduct />
      </div>
    </div>
  );
};

export default Home;
