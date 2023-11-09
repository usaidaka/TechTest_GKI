import { Button } from "flowbite-react";
import React, { useState } from "react";
import axios from "../../../api/axios";
import { getLocalStorage } from "../../../utils/tokenGetterSetter";

const DeleteFormProduct = ({ onClose, data, refetch }) => {
  const [errMsg, setErrMsg] = useState("");
  const access_token = getLocalStorage("access_token");
  const deleteProduct = async () => {
    try {
      const response = await axios.delete(`/admin/product/${data.id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      console.log(response);
      if (!response.data.ok) {
        setErrMsg(response.data.message);
      }
      onClose();
      refetch();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data?.message
      ) {
        setErrMsg(error.response?.data?.message);
      } else {
        setErrMsg("An error occurred while fetching data.");
      }
    }
  };
  return (
    <div>
      <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
        Are you sure you want to delete {data.name}?
      </h3>
      <div className="flex justify-center gap-4">
        <Button
          color="failure"
          onClick={() => {
            deleteProduct();
          }}
        >
          {"Yes, I'm sure"}
        </Button>
        <Button color="gray" onClick={() => onClose()}>
          No, cancel
        </Button>
      </div>
    </div>
  );
};

export default DeleteFormProduct;
