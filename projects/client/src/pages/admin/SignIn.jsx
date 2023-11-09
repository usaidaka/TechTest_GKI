import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

import InputForm from "../../components/global/InputForm";
import axios from "../../api/axios";
import {
  getLocalStorage,
  setLocalStorage,
} from "../../utils/tokenGetterSetter";
import InputPassword from "../../components/global/InputPassword";
import Button from "../../components/global/Button";
import CoverSign from "../../components/global/CoverSign";
import ButtonOAuth from "../../components/global/ButtonOAuth";
import { userDocuments } from "../../features/userDoc";
import withSignedIn from "../withSignedIn";
import AlertNotification from "../../components/global/AlertNotification";

const SignIn = () => {
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const login = async (values) => {
    try {
      const response = await axios.post("/user/login", values);
      if (!response.data?.ok) {
        setErrMsg(response.error?.message);
      }
      setLocalStorage(response.data?.access_token);
      const access_token = getLocalStorage("access_token");
      userInformation(access_token);
      navigate("/admin");
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

  const formik = useFormik({
    initialValues: {
      user_identification: "",
      password: "",
    },
    onSubmit: login,
    validationSchema: yup.object().shape({
      user_identification: yup
        .string()
        .required("username / email is a required field"),
      password: yup
        .string()
        .min(6)
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_+=!@#$%^&*])(?=.{8,})/,
          "password must to contain at least 8 character, 1 number and 1 symbol"
        ),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
  };
  console.log(errMsg);

  if (errMsg) {
  }
  return (
    <>
      {errMsg ? (
        <div className="absolute right-0 bottom-0 m-10">
          <AlertNotification color="failure" msg={errMsg} setMsg={setErrMsg} />
        </div>
      ) : null}
      <div className="grid grid-cols-2 h-screen">
        <CoverSign />
        <div className="col-span-1 flex flex-col justify-center items-center">
          <div className="w-96  space-y-4">
            <div>
              <h1 className="text-4xl font-bold">Welcome, Admin!</h1>
              <h3 className="font-inter">
                Please enter your email or username and password to start using
                the application
              </h3>
            </div>
            <div className="">
              <form onSubmit={formik.handleSubmit}>
                <InputForm
                  onChange={handleForm}
                  label="username/email"
                  placeholder="username/email"
                  name="user_identification"
                  type="text"
                  value={formik.values.user_identification}
                  isError={!!formik.errors.user_identification}
                  errorMessage={formik.errors.user_identification}
                />
                <InputPassword
                  name="password"
                  label="password"
                  onChange={handleForm}
                  value={formik.values.password}
                  isError={!!formik.errors.password}
                  errorMessage={formik.errors.password}
                  placeholder="password"
                />
                <div className="mb-4 mt-4 flex justify-center">
                  <Button
                    buttonSize="medium"
                    buttonText="Sign in"
                    type="submit"
                    bgColor="bg-blue3"
                    colorText="text-white"
                    fontWeight="font-semibold"
                  />
                </div>
              </form>
              <ButtonOAuth />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withSignedIn(SignIn);
