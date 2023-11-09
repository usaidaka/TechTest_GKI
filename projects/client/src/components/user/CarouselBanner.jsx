import React from "react";
import { Carousel } from "flowbite-react";

const CarouselBanner = ({ imageUrls, carouselSize }) => {
  return (
    <div className="w-full">
      <Carousel
        slideInterval={5000}
        className={`w-full h-32  lg:h-[20rem] transition-all duration-500 ease-in`}
        indicators={false}
        leftControl=" "
        rightControl=" "
      >
        {imageUrls.map((url, index) => (
          <img
            key={index}
            alt="Carousel Slide"
            src={url}
            className="object-cover w-fit h-full"
          />
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselBanner;
