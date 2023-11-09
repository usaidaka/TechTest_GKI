import React, { useState } from "react";
import { Button, Modal } from "flowbite-react";
import FormAddUser from "../admin/form/FormAddUser";
import FormEditUser from "../admin/form/FormEditUser";
import FormCreateProduct from "../admin/form/FormCreateProduct";
import FormEditProduct from "../admin/form/FormEditProduct";
import FormCreateCategory from "../admin/form/FormCreateCategory";
import FormEditCategory from "../admin/form/FormEditCategory";

const ModalForm = ({ button, modalUseFor, refetch, data }) => {
  const [openModal, setOpenModal] = useState(false);

  let modalForm;
  let titleForm;
  let formSize;
  switch (modalUseFor) {
    case "addUser":
      modalForm = (
        <FormAddUser refetch={refetch} onClose={() => setOpenModal(false)} />
      );
      titleForm = "Add User";
      formSize = "md";
      break;
    case "editUser":
      modalForm = (
        <FormEditUser
          refetch={refetch}
          onClose={() => setOpenModal(false)}
          data={data}
        />
      );
      titleForm = "Edit User";
      formSize = "md";
      break;
    case "createProduct":
      modalForm = (
        <FormCreateProduct
          onClose={() => setOpenModal(false)}
          refetch={refetch}
        />
      );
      titleForm = "Create Product";
      formSize = "3xl";
      break;
    case "editProduct":
      modalForm = (
        <FormEditProduct
          onClose={() => setOpenModal(false)}
          data={data}
          refetch={refetch}
        />
      );
      titleForm = "Edit Product";
      formSize = "3xl";
      break;
    case "createCategory":
      modalForm = <FormCreateCategory onClose={() => setOpenModal(false)} />;
      titleForm = "Create Category";
      formSize = "lg";
      break;
    case "editCategory":
      modalForm = <FormEditCategory onClose={() => setOpenModal(false)} />;
      titleForm = "Edit Category";
      formSize = "lg";
      break;

    default:
      break;
  }

  return (
    <>
      <div onClick={() => setOpenModal(true)}>{button}</div>
      <Modal
        size={formSize}
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>{titleForm}</Modal.Header>
        <Modal.Body>{modalForm}</Modal.Body>
      </Modal>
    </>
  );
};

export default ModalForm;
