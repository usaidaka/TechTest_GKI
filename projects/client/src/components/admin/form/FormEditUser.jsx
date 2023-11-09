import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToggleSwitch } from "flowbite-react";

import InputForm from "../../global/InputForm";
import axios from "../../../api/axios";
import Button from "../../../components/global/Button";
import InputPassword from "../../global/InputPassword";
import { getLocalStorage } from "../../../utils/tokenGetterSetter";
import AlertNotification from "../../global/AlertNotification";

const FormEditUser = ({ refetch, onClose, data }) => {
  console.log(data);
  const [errMsg, setErrMsg] = useState("");
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const access_token = getLocalStorage("access_token");

  const [isActive, setIsActive] = useState(data.is_active);

  const editUser = async (values) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("password", values.password);
    formData.append("confirm_password", values.confirm_password);
    formData.append("file", image);
    try {
      const response = await axios.patch(`/admin/user/${data.id}`, formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!response.data.ok) {
        setErrMsg(response.data.message);
      }
      refetch();
      onClose();
    } catch (error) {
      setErrMsg(error.response.data?.message);
      if (
        error.response &&
        error.response.data &&
        error.response.data?.message &&
        error.response.data?.errors[0]?.msg
      ) {
        setErrMsg(error.response.data?.errors[0]?.msg);
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
    onSubmit: editUser,
    validationSchema: yup.object().shape({
      username: yup
        .string()
        .required("username is required")
        .min(3)
        .max(20)
        .matches(/^[a-zA-Z0-9_-]+$/, "Username can't contain spaces"),
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
        .required("password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_+=!@#$%^&*])(?=.{8,})/,
          "The password must contain 6 character with uppercase, lowercase, numbers and special characters"
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

  const handleFile = (e) => {
    const selectedImage = e.target.files[0];
    setShowImage(URL.createObjectURL(selectedImage));
    setImage(selectedImage);
  };

  const inputPhotoRef = useRef();

  return (
    <>
      {errMsg ? (
        <div className="absolute mx-auto w-full top-0 right-0.5">
          <AlertNotification color="failure" msg={errMsg} setMsg={setErrMsg} />
        </div>
      ) : successMsg ? (
        <div className="absolute right-14 top-0 m-10">
          <AlertNotification
            color="success"
            msg={successMsg}
            setMsg={setSuccessMsg}
          />
        </div>
      ) : null}

      <div>
        <form action="" onSubmit={formik.handleSubmit} className="space-y-2 ">
          <div className="w-full flex justify-center items-center">
            <div className="w-32 h-32 overflow-hidden flex flex-col  justify-center items-center">
              <img
                src={
                  showImage
                    ? showImage
                    : `${process.env.REACT_APP_API_BASE_URL}${data.image_profile}`
                }
                alt="upload profile"
                className="w-32 h-32 border-2 object-cover border-blue-200 hover:border-4 hover:border-blue-600 rounded-full transition-all"
                onClick={() => inputPhotoRef.current.click()}
              />
              <input
                type="file"
                onChange={handleFile}
                name="image"
                accept="image/png, image/jpg, image/jpeg"
                required
                className="rounded-full m-4 hidden"
                ref={inputPhotoRef}
              />
            </div>
          </div>
          <InputForm
            width="w-full"
            label="username"
            onChange={handleForm}
            placeholder={`${data.username}`}
            name="username"
            type="text"
            value={formik.values.username}
            isError={!!formik.errors.username}
            errorMessage={formik.errors.username}
          />
          <InputForm
            width="w-full"
            label="email"
            onChange={handleForm}
            placeholder={`${data.email}`}
            name="email"
            type="text"
            value={formik.values.email}
            isError={!!formik.errors.email}
            errorMessage={formik.errors.email}
          />
          <InputForm
            width="w-full"
            label="phone"
            onChange={handleForm}
            placeholder={`${data.phone}`}
            name="phone"
            type="text"
            value={formik.values.phone}
            isError={!!formik.errors.phone}
            errorMessage={formik.errors.phone}
          />
          <InputPassword
            name="password"
            onChange={handleForm}
            label="password"
            placeholder="password"
            value={formik.values.password}
            isError={!!formik.errors.password}
            errorMessage={formik.errors.password}
          />
          <InputPassword
            name="confirm_password"
            onChange={handleForm}
            label="confirm_password"
            placeholder="confirm password"
            value={formik.values.confirm_password}
            isError={!!formik.errors.confirm_password}
            errorMessage={formik.errors.confirm_password}
          />
          <ToggleSwitch
            checked={isActive}
            label={`${isActive ? "active" : "inactive"}`}
            onChange={() => setIsActive(!isActive)}
          />
          <div className="flex justify-evenly">
            <Button
              type="submit"
              buttonText="Create"
              buttonUseFor={"confirm"}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default FormEditUser;
