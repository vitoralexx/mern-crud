//
import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

//
import axios from "axios";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import useUserStore from "../../store/useUserStore";

const DeleteUserPopUp = ({ isOpen, setIsOpen, selectedUser }) => {

  //
  const navigate = useNavigate();

  //
  const { deleteUser } = useUserStore();

  //
  const [isDeleting, setIsDeleting] = React.useState(false);

  // delete user
  const handleDeleteUser = async () => {

    if (!selectedUser?._id) {
      console.error("No user ID provided for deletion");
      toast.error("Erro: usuário inválido");
      return;
      setIsDeleting(true);
    }

    try {
      await deleteUser(selectedUser._id);
      toast.success("Usuário excluído com sucesso!");
      setIsOpen(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Erro ao excluir o usuário.");
    } finally {
      setIsDeleting(false);
    }
  };

  // cancel
  const handleCancel = () => {
    console.log("Cancel button clicked", typeof setIsOpen);
    if (typeof setIsOpen === "function") {
      setIsOpen(false); // Close dialog
    }
  };

  // close
  const handleClose = () => {
    console.log("X icon button clicked", typeof setIsOpen);
    if (typeof setIsOpen === "function") {
      setIsOpen(false); // Close dialog
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden border border-gray-300 rounded-md bg-white p-6 text-left align-middle shadow-md transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    Excluir usuário
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    aria-label="Fechar"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-600">
                    Tem certeza que deseja excluir permanentemente esse usuário? Atenção: após excluir esse usuário o mesmo não poderá ser recuperado.
                  </p>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm hover:bg-gray-50 whitespace-nowrap hover:cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleDeleteUser}
                    className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm hover:bg-blue-700 whitespace-nowrap hover:cursor-pointer"
                  >
                    Excluir
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

DeleteUserPopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
};

export default DeleteUserPopUp;