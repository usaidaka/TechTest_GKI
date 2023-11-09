import React, { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import {
  getLocalStorage,
  setLocalStorage,
} from "../../utils/tokenGetterSetter";
import { Link, useLocation, useNavigate } from "react-router-dom";
import google from "../../assets/google.png";
import axios from "../../api/axios";
import { useDispatch } from "react-redux";
import { userDocuments } from "../../features/userDoc";

const ButtonOAuth = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const { googleSignIn, user } = UserAuth();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  const userInformation = async (access_token) => {
    try {
      const response = await axios.get("/user/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (!response.data?.ok) {
        setErrMsg(response.error?.message);
      }
      console.log("response dr login", response);
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

  useEffect(() => {
    if (user != null && Object.keys(user).length !== 0) {
      console.log("user oAuth", user);
      const loginByGmail = async () => {
        try {
          const response = await axios.post("/user/register-by-gmail", {
            username: user.displayName,
            email: user.email,
            phone: "unregistered",
          });
          console.log("response oauth", response);
          if (response.data.ok) {
            setLocalStorage(response.data?.access_token);
            const access_token = getLocalStorage("access_token");
            userInformation(access_token);
            navigate("/admin");
          }
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
      loginByGmail();
    }
  }, [navigate, user]);

  const handleGoogleSign = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      setErrMsg(error.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mx-8 lg:rounded-lg ">
      <div className="flex justify-center items-center w-full">
        <hr className="border-2 border-gray-200 rounded-full w-full" />
        <h1 className="text-gray-300">OR</h1>
        <hr className="border-2 border-gray-200 rounded-full w-full" />
      </div>

      <button
        className="border-2  gap-x-2 bg-slate-200 rounded-lg w-full flex items-center"
        onClick={handleGoogleSign}
        type="button"
      >
        <div className="flex justify-center items-center w-full">
          <img src={google} alt="google" className="w-10 " />
          {currentPath === "/signup" ? (
            <h1 className="text-sm">Sign up with Google </h1>
          ) : (
            <h1 className="text-sm">Sign in with Google </h1>
          )}
        </div>
      </button>
      {currentPath === "/signup" ? (
        <h1 className="mt-2 text-xs my-4 text-grayText">
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold">
            Sign In
          </Link>
        </h1>
      ) : (
        <h1 className="mt-2 text-xs my-4 text-grayText">
          Dont have an account yet?{" "}
          <Link to="/signup" className="font-semibold">
            Sign Up
          </Link>
        </h1>
      )}
    </div>
  );
};

export default ButtonOAuth;
