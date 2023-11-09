import { Button } from "flowbite-react";
import React from "react";
import { UserAuth } from "../../../context/AuthContext";
import { logout } from "../../../utils/tokenGetterSetter";
import { useNavigate } from "react-router-dom";

const ModalSignOut = ({ onClose }) => {
  const { logOutAuth } = UserAuth();
  const navigate = useNavigate();
  const handleLogOut = () => {
    logOutAuth();
    logout();
    navigate("/");
  };
  return (
    <div>
      <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
        Are you sure you want to sign out
      </h3>
      <div className="flex justify-center gap-4">
        <Button color="failure" onClick={() => handleLogOut()}>
          {"Yes, I'm sure"}
        </Button>
        <Button color="gray" onClick={() => onClose()}>
          No, cancel
        </Button>
      </div>
    </div>
  );
};

export default ModalSignOut;
