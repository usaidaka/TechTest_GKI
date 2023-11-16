import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TableGlobal from "../../components/global/TableGlobal";
import axios from "../../api/axios";
import { Pagination, ToggleSwitch } from "flowbite-react";
import ModalForm from "../../components/global/ModalForm";
import { BiSolidUserPlus } from "react-icons/bi";
import withAuth from "../withAuth";
import InputSearch from "../../components/global/InputSearch";
import { getLocalStorage } from "../../utils/tokenGetterSetter";
import { userDocuments } from "../../features/userDoc";

const UserManagement = () => {
  const [usersList, setUsersList] = useState([]);
  const [byStatus, setByStatus] = useState(true);
  const [byName, setByName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
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

  const fetchUserList = useCallback(async () => {
    try {
      const response = await axios.get(
        `/admin/user-list?role=&page=${currentPage}&perPage=10&byName=${byName}&byStatus=${byStatus}`
      );

      setTotalPage(response.data?.pagination?.totalPages);
      setUsersList(response.data?.rows);
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
  }, [byName, byStatus, currentPage]);

  useEffect(() => {
    fetchUserList();
  }, [currentPage, fetchUserList]);

  function handlePage(page) {
    setCurrentPage(page);
  }

  const head = [
    { title: "Username" },
    { title: "Email" },
    { title: "Phone Number" },
    { title: "Position" },
    { title: "Status" },
    { title: "Option" },
  ];

  return (
    <div className="bg-slate-100 w-full">
      <div className=" m-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-inter">Users Management</h1>
          {adminPermission ? (
            <ModalForm
              button={
                <button className="bg-blue-500 text-white px-5 py-2 rounded-md flex justify-between items-center gap-2">
                  Add User
                  <span>
                    <BiSolidUserPlus className="text-2xl" />
                  </span>
                </button>
              }
              modalUseFor="addUser"
              refetch={fetchUserList}
            />
          ) : null}
        </div>
        <div className="flex items-center gap-6">
          <InputSearch
            name="byName"
            id="byName"
            placeholder="Search user by name"
            onChange={(e) => setByName(e.target.value)}
          />
          <div className="">
            <ToggleSwitch
              checked={byStatus}
              label={`${byStatus ? "active" : "inactive"}`}
              onChange={() => setByStatus(!byStatus)}
            />
          </div>
        </div>

        <TableGlobal
          head={head}
          body={usersList}
          tableUseFor="UsersList"
          refetch={fetchUserList}
        />

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

export default withAuth(UserManagement);
