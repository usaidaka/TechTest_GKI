import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import InputForm from "../../global/InputForm";
import axios from "../../../api/axios";
import { getLocalStorage } from "../../../utils/tokenGetterSetter";
import { ToggleSwitch } from "flowbite-react";
import Button from "../../global/Button";
import AlertNotification from "../../global/AlertNotification";

const FormEditProduct = ({ refetch, onClose, data }) => {
  const [isActive, setIsActive] = useState(false);
  const [category, setCategory] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const access_token = getLocalStorage("access_token");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("/admin/category");
        if (!response.data?.ok) {
          setErrMsg(response.error?.message);
        }

        setCategory(response.data?.data);
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
    fetchCategory();
  }, []);

  const editProduct = async (values) => {
    values.category_id = Number(selectedCategory);
    values.is_active = isActive;

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", Number(values.price));
      formData.append("category_id", Number(selectedCategory));
      formData.append("description", values.description);
      formData.append("file", image);
      formData.append("is_active", isActive);
      const response = await axios.patch(
        `/admin/product/${data.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (response.data.ok) {
        refetch();
        onClose();
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

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 5000,
      category_id: 1,
      description: "",
      is_active: true,
    },
    onSubmit: editProduct,
    validationSchema: yup.object().shape({
      name: yup.string().required("name is required").min(3).max(20),
      price: yup.number().required("price is required"),
      category_id: yup.number().required("category is required"),
      description: yup
        .string()
        .required("description number is required")
        .min(5),
      is_active: yup.boolean().optional(),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleFile = (e) => {
    const selectedImage = e.target.files[0];
    setShowImage(URL.createObjectURL(selectedImage));
    setImage(selectedImage);
  };

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
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

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-6 h-96">
          <div className="col-span-2 flex flex-col items-center border-r-2">
            <div
              className="w-52 h-52 border-2 border-dashed border-blue-200 hover:border-4 hover:border-blue-600 overflow-hidden flex flex-col  justify-center items-center  transition-all"
              onClick={() => inputPhotoRef.current.click()}
            >
              <img
                src={
                  showImage
                    ? showImage
                    : `${process.env.REACT_APP_API_BASE_URL}${data.image_product}`
                }
                alt="upload profile"
                className="w-full object-cover "
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
            <h1 className="text-xs ml-2 text-gray-600">
              Image is required. Please upload image with size less than 2MB
            </h1>
          </div>
          <div className="col-span-4 font-inter space-y-2 ml-4 ">
            <InputForm
              onChange={handleForm}
              label="name"
              placeholder={`${data.name}`}
              name="name"
              type="text"
              value={formik.values.name}
              isError={!!formik.errors.name}
              errorMessage={formik.errors.name}
            />
            <InputForm
              onChange={handleForm}
              label="price"
              placeholder={`${data.price}`}
              name="price"
              type="number"
              value={formik.values.price}
              isError={!!formik.errors.price}
              errorMessage={formik.errors.price}
            />
            <label htmlFor="" className="text-xs ">
              Category
            </label>
            <select
              id="category"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-strong focus:focus:border-green-strong block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-strong dark:focus:focus:border-green-strong"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
            >
              <option value={0}>select a category</option>
              {category.map((category) => (
                <option
                  key={category.id}
                  defaultValue="Choose a category"
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
            <InputForm
              onChange={handleForm}
              label="description"
              placeholder={`${data.description}`}
              name="description"
              type="text"
              value={formik.values.description}
              isError={!!formik.errors.description}
              errorMessage={formik.errors.description}
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
          </div>
        </div>
      </form>
    </>
  );
};

export default FormEditProduct;
