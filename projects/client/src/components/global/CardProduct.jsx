import React from "react";
import { Badge } from "flowbite-react";
import { Link } from "react-router-dom";
import { rupiahFormat } from "../../utils/formatter";

const CardProduct = ({
  src,
  category,
  name,
  desc,
  price,
  isActive = true,
  isDeleted = null,
}) => {
  console.log(isActive);
  return (
    <div className="bg-white flex flex-col justify-center items-center font-inter">
      <div className="w-36 md:w-52 h-full  flex flex-col items-center hover:shadow-card-1 transition-all ease-out duration-400 rounded-lg m-3">
        <div className="w-full h-36 md:h-52 lg:h-40 overflow-hidden rounded-t-lg">
          <img
            src={src}
            alt="product"
            className="w-full h-full object-center object-cover"
          />
        </div>
        <div className=" w-full h-28 flex flex-col justify-end  p-4 mt-10">
          <div className="flex gap-2">
            {isDeleted ? (
              <Badge color="failure" className="w-fit">
                Deleted
              </Badge>
            ) : (
              <Badge color="purple" className="w-fit">
                {category}
              </Badge>
            )}
            {isActive ? (
              <Badge color="success" className="w-fit">
                Active
              </Badge>
            ) : (
              <Badge color="pink" className="w-fit">
                Inactive
              </Badge>
            )}
          </div>
          <h2 className="text-xs md:text-base lg:text-base font-bold">
            {name}
          </h2>
          {desc?.length > 20 ? (
            <h4 className="text-xs text-ellipsis text-gray-400">
              {desc?.slice(0, 20)}...
            </h4>
          ) : (
            <h4 className="text-xs text-ellipsis text-gray-400">{desc}</h4>
          )}
          <p className="text-xs md:text-md lg:text-md font-semibold mt-2 text-blue-500">
            {rupiahFormat(price)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
