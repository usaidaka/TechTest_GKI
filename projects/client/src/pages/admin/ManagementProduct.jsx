import React, { useCallback, useEffect, useState } from "react";
import { GiFireBottle } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import ModalForm from "../../components/global/ModalForm";
import CardProduct from "../../components/global/CardProduct";
import { Pagination } from "flowbite-react";
import axios from "../../api/axios";
import ModalDeleteConfirmation from "../../components/global/ModalDeleteConfirmation";
import withAuth from "../withAuth";
import { useSelector } from "react-redux";

const ManagementProduct = () => {
  const [productsList, setProductsList] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const userDoc = useSelector((state) => state.userDocument.value);
  let adminPermission = false;
  if (userDoc === undefined) {
    adminPermission = false;
  }
  adminPermission = userDoc.Role?.name === "Admin";

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(
        `/admin/product-list?page=${currentPage}&perPage=5`
      );
      setProductsList(response.data?.rows);
      setTotalPage(response.data?.pagination?.totalPages);
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
  }, [currentPage]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  function handlePage(page) {
    setCurrentPage(page);
  }

  return (
    <div className="bg-slate-100 w-full">
      <div className=" m-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl  font-inter">Product Management</h1>
          {adminPermission ? (
            <ModalForm
              button={
                <button className="bg-blue-500 text-white px-5 py-2 rounded-md flex justify-between items-center gap-2">
                  Add Product
                  <span>
                    <GiFireBottle className="text-2xl" />
                  </span>
                </button>
              }
              modalUseFor="createProduct"
              refetch={fetchProduct}
            />
          ) : null}
        </div>
        <div className="flex bg-white rounded-lg gap-2 p-5">
          {productsList.map((product, idx) => (
            <div className={`shadow-card-1 rounded-lg `} key={idx}>
              <CardProduct
                src={`${process.env.REACT_APP_API_BASE_URL}${product.image_product}`}
                category={product.Category?.name}
                name={product.name}
                desc={product.description}
                price={product.price}
                key={product.id}
                isDeleted={product.deletedAt}
              />
              <div className="flex gap-x-2 justify-end p-4 rounded-lg">
                {product.deletedAt || !adminPermission ? null : (
                  <>
                    <ModalForm
                      button={
                        <button className="bg-blue-600 text-white p-2 rounded-full flex justify-between items-center">
                          <FaEdit className="text-sm " />
                        </button>
                      }
                      modalUseFor="editProduct"
                      refetch={fetchProduct}
                      data={product}
                    />
                    <ModalDeleteConfirmation
                      button={
                        <button className="bg-red-600 text-white p-2 rounded-full flex justify-between items-center">
                          <MdDelete className="text-sm " />
                        </button>
                      }
                      modalUseFor="deleteProduct"
                      refetch={fetchProduct}
                      data={product}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePage}
          totalPages={totalPage}
          layout="navigation"
        />
      </div>
    </div>
  );
};

export default withAuth(ManagementProduct);
