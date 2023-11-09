import React, { useCallback, useEffect, useState } from "react";
import TableGlobal from "../../components/global/TableGlobal";
import axios from "../../api/axios";
import { Pagination } from "flowbite-react";
import ModalForm from "../../components/global/ModalForm";
import { BiSolidUserPlus } from "react-icons/bi";
import withAuth from "../withAuth";
import { useSelector } from "react-redux";

const UserManagement = () => {
  const [usersList, setUsersList] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const userDoc = useSelector((state) => state.userDocument.value);
  let adminPermission = false;
  if (userDoc === undefined) {
    adminPermission = false;
  }
  adminPermission = userDoc.Role?.name === "Admin";

  const fetchUserList = useCallback(async () => {
    try {
      const response = await axios.get(
        `/admin/user-list?role=&page=${currentPage}&perPage=10`
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
  }, [currentPage]);

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
