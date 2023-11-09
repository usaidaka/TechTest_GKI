import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import DeleteFormUser from "../admin/form/DeleteFormUser";
import DeleteFormProduct from "../admin/form/DeleteFormProduct";
import ModalSignOut from "../admin/form/ModalSignOut";

const ModalDeleteConfirmation = ({ refetch, button, modalUseFor, data }) => {
  const [openModal, setOpenModal] = useState(false);

  let modalForm;

  switch (modalUseFor) {
    case "deleteUser":
      modalForm = (
        <DeleteFormUser
          refetch={refetch}
          onClose={() => setOpenModal(false)}
          data={data}
        />
      );
      break;
    case "deleteProduct":
      modalForm = (
        <DeleteFormProduct
          refetch={refetch}
          onClose={() => setOpenModal(false)}
          data={data}
        />
      );
      break;
    case "signOut":
      modalForm = <ModalSignOut onClose={() => setOpenModal(false)} />;
      break;

    default:
      break;
  }

  return (
    <>
      <div onClick={() => setOpenModal(true)}>{button}</div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            {modalForm}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalDeleteConfirmation;
