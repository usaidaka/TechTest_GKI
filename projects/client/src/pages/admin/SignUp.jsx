import React, { useState } from "react";
import CoverSign from "../../components/global/CoverSign";
import InputForm from "../../components/global/InputForm";
import InputPassword from "../../components/global/InputPassword";
import Button from "../../components/global/Button";
import * as yup from "yup";
import ButtonOAuth from "../../components/global/ButtonOAuth";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { setLocalStorage } from "../../utils/tokenGetterSetter";
import buLogo from "../../assets/buLogo.png";
import { useFormik } from "formik";
import withSignedIn from "../withSignedIn";
import AlertNotification from "../../components/global/AlertNotification";

const SignUp = () => {
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const register = async (values) => {
    try {
      const response = await axios.post("/user/register", values);
      if (!response.data?.ok) {
        setErrMsg(response.error?.message);
      }
      setSuccessMsg(response.data?.message);
      setLocalStorage(response.data?.access_token);
      setLoading(true);
      setTimeout(() => {
        navigate("/signin");
      }, 4000);
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
      username: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
    onSubmit: register,
    validationSchema: yup.object().shape({
      username: yup.string().required("username / email is a required field"),
      email: yup.string().required("email is required").email(),
      phone: yup
        .string()
        .required("phone number is required")
        .min(10)
        .max(13)
        .matches(
          /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
          "Phone number is not valid"
        ),
      password: yup
        .string()
        .min(6)
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_+=!@#$%^&*])(?=.{8,})/,
          "password must to contain at least 8 character, 1 number and 1 symbol"
        ),
      confirm_password: yup
        .string()
        .oneOf(
          [yup.ref("password"), null],
          "Password confirmation must match the password"
        )
        .required("Password confirmation is required"),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <img src={buLogo} alt="" className="w-96 h-96 animate-spin-slow" />
        <h1 className="text-xl font-inter font-bold">
          Congrats! Register successful and please check your email.
        </h1>
      </div>
    );
  }

  return (
    <>
      {errMsg ? (
        <div className="absolute right-0 bottom-0 m-10">
          <AlertNotification color="failure" msg={errMsg} setMsg={setErrMsg} />
        </div>
      ) : successMsg ? (
        <div className="absolute right-0 bottom-0 m-10">
          <AlertNotification
            color="success"
            msg={successMsg}
            setMsg={setSuccessMsg}
          />
        </div>
      ) : null}
      <div className="grid grid-cols-2 h-screen">
        <CoverSign />
        <div className="col-span-1 flex flex-col justify-center items-center">
          <div className="w-96  space-y-4">
            <div>
              <h1 className="text-4xl font-bold">Hello, Candidate!</h1>
              <h3 className="font-inter">Please register your self</h3>
            </div>
            <div className="">
              <form onSubmit={formik.handleSubmit}>
                <InputForm
                  onChange={handleForm}
                  label="Username"
                  placeholder="username"
                  name="username"
                  type="text"
                  value={formik.values.username}
                  isError={!!formik.errors.username}
                  errorMessage={formik.errors.username}
                />
                <InputForm
                  onChange={handleForm}
                  label="Email"
                  placeholder="email"
                  name="email"
                  type="text"
                  value={formik.values.email}
                  isError={!!formik.errors.email}
                  errorMessage={formik.errors.email}
                />
                <InputForm
                  onChange={handleForm}
                  label="Phone"
                  placeholder="phone"
                  name="phone"
                  type="text"
                  value={formik.values.phone}
                  isError={!!formik.errors.phone}
                  errorMessage={formik.errors.phone}
                />
                <InputPassword
                  name="password"
                  label="Password"
                  onChange={handleForm}
                  value={formik.values.password}
                  isError={!!formik.errors.password}
                  errorMessage={formik.errors.password}
                  placeholder="password"
                />
                <InputPassword
                  name="confirm_password"
                  label="Confirm Password"
                  onChange={handleForm}
                  value={formik.values.confirm_password}
                  isError={!!formik.errors.confirm_password}
                  errorMessage={formik.errors.confirm_password}
                  placeholder="confirm password"
                  id="confirm_password"
                />
                <div className="mb-4 mt-4 flex justify-center">
                  <Button
                    buttonSize="medium"
                    buttonText="Sign up"
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

export default withSignedIn(SignUp);
