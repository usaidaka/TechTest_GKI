import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "../../api/axios";
import CardProduct from "../global/CardProduct";
import buLogo from "../../assets/android-chrome-192x192.png";

const AvailableProduct = () => {
  const [list, setList] = useState([]);
  const [lastID, setLastID] = useState(0);
  const [tempID, setTempID] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await axios.get(
          `/user/product?lastID=${lastID}&limit=10`
        );
        console.log(response);
        const newList = response.data?.result;
        setList([...list, ...newList]);
        setTempID(response.data?.lastID);
        setHasMore(response.data?.hasMore);
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
    getList();
  }, [lastID]);

  const fetchMore = () => {
    setTimeout(() => {
      setLastID(tempID);
    }, 1000);
  };

  return (
    <div className="ml-4">
      <p className="font-libre font-bold">Available Product</p>
      <div>
        <InfiniteScroll
          dataLength={list.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={
            <div className="animate-bounce flex gap-4 mb-4 justify-center items-center">
              <img src={buLogo} alt="loading scroll" className="w-8" />
            </div>
          }
          endMessage={
            <div className="flex flex-col gap-4 mb-4 justify-center items-center">
              <img src={buLogo} alt="end scroll" className="w-8" />
            </div>
          }
        >
          <div className="flex flex-wrap">
            {list.map((product) => (
              <div key={product.id}>
                <CardProduct
                  src={`${process.env.REACT_APP_API_BASE_URL}${product?.image_product}`}
                  category={product?.Category?.name}
                  name={product.name}
                  desc={product.description}
                  price={product.price}
                  key={product.id}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AvailableProduct;
