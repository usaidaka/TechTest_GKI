import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import CardProduct from "../global/CardProduct";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const NewestProduct = () => {
  const [newestProduct, setNewestProduct] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const fetchNewestProduct = async () => {
      try {
        const response = await axios.get("/admin/product-newest");
        setNewestProduct(response.data?.data);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrMsg(error.response.data.message);
        } else {
          setErrMsg("An error occurred while fetching data.");
        }
      }
    };
    fetchNewestProduct();
  }, []);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1024, min: 800 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  const productsReady = newestProduct.map((product) => (
    <CardProduct
      src={`${process.env.REACT_APP_API_BASE_URL}${product?.image_product}`}
      category={product?.Category?.name}
      name={product.name}
      desc={product.description}
      price={product.price}
      isActive={product.is_active}
      key={product.id}
    />
  ));

  return (
    <div className="space-y-2">
      <h1 className="ml-4 font-lobster font-bold">Newest Product</h1>
      <div className="z-0 relative">
        <Carousel
          responsive={responsive}
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {productsReady}
        </Carousel>
      </div>
    </div>
  );
};

export default NewestProduct;
