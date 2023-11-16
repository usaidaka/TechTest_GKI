import React, { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalForm from "../global/ModalForm";
import ModalDeleteConfirmation from "../global/ModalDeleteConfirmation";
import { Badge } from "flowbite-react";
import emptyImage from "../../assets/emptyimage.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";
import { userDocuments } from "../../features/userDoc";
import { getLocalStorage } from "../../utils/tokenGetterSetter";

const TableBodyUsersList = ({ body, refetch }) => {
  const [errMsg, setErrMsg] = useState("");
  const access_token = getLocalStorage("access_token");
  const dispatch = useDispatch();
  const userDoc = useSelector((state) => state.userDocument.value);

  let adminPermission = false;
  if (userDoc === undefined) {
    adminPermission = false;
  }
  adminPermission = userDoc.Role?.name === "Admin";

  useEffect(() => {
    const userInformation = async () => {
      try {
        const response = await axios.get("/user/profile", {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (!response.data?.ok) {
          setErrMsg(response.error?.message);
        }

        dispatch(userDocuments(response.data?.data));
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
    userInformation();
  }, [access_token, dispatch]);

  return (
    <>
      {body?.map((user, idx) => (
        <tr
          key={idx}
          className={`
            ${idx % 2 === 0 ? "bg-gray-100" : "bg-white"} text-gray-700
          `}
        >
          <td className="py-2 px-4">
            <div className="flex items-center gap-2">
              <img
                src={
                  user.image_profile
                    ? `${process.env.REACT_APP_API_BASE_URL}${user.image_profile}`
                    : emptyImage
                }
                alt=""
                class
                className="w-10 h-10 border-2 object-cover border-blue-200 hover:border-4 hover:border-blue-600 rounded-full transition-all"
              />

              <span> {user.username}</span>
            </div>
          </td>
          <td className="py-2 px-4">{user.email}</td>
          <td className="py-2 px-4">{user.phone}</td>
          <td className="py-2 px-4">{user.Role?.name}</td>
          <td className={`py-2 px-4 `}>
            <span
              className={` ${
                user.is_active ? "bg-green-600" : "bg-red-600"
              } text-white px-2 rounded-full font-inter text-sm`}
            >
              {user.is_active ? "active" : "inactive"}
            </span>
          </td>
          <td className="py-2 px-4  ">
            {user.deletedAt ? (
              <Badge color="failure" className="w-fit">
                Deleted
              </Badge>
            ) : adminPermission ? (
              <div className="flex gap-2">
                <ModalForm
                  button={
                    <button className="bg-blue-600 w-7 h-7  text-white p-2 rounded-full flex justify-center items-center">
                      <FaUserEdit className="text-xl " />
                    </button>
                  }
                  modalUseFor="editUser"
                  refetch={refetch}
                  data={user}
                />
                <ModalDeleteConfirmation
                  button={
                    <button className="bg-red-600 w-7 h-7 text-white p-2 rounded-full flex justify-center items-center">
                      <MdDelete className="text-sm " />
                    </button>
                  }
                  modalUseFor="deleteUser"
                  refetch={refetch}
                  data={user}
                />
              </div>
            ) : (
              <Badge color="blue" className="w-fit">
                Admin Access
              </Badge>
            )}
          </td>
        </tr>
      ))}
    </>
  );
};

export default TableBodyUsersList;
