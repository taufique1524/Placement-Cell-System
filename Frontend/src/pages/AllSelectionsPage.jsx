import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { IoMdDoneAll } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useData } from '../context/DataContext.jsx';
import { handleDelete } from "../handlers/AllSelectionsPage.handler.js";
import Modal from '../components/Modal';
import { getAllSelections } from "../services/getAllSelections.services.js";
import axios from "axios";
import { baseUrl } from "../constants.js";

function AllSelectionsPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { selections: allSelections = [], user: loggedInUserDetails = {}, actions } = useData();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectionToDelete, setSelectionToDelete] = useState(null);

  // New delete handler
  const handleAdminDelete = async (_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("You are not logged in. Please log in as an admin to delete selections.");
        setTimeout(() => setErrorMessage(""), 5000);
        return;
      }
      // Always use the full backend URL for DELETE
          // const response = await axios.delete(`http://localhost:5000/api/selection/deleteSelection/${_id}`, {
          //   headers: { token }
          // });

      const response = await axios.delete(
        `${baseUrl}/api/selection/deleteSelection/${_id}`,
        { headers: { token } }
      );
      if (response?.data?.success === 1) {
        // Fetch updated selections
        const updated = await getAllSelections();
        if (updated && updated.newSelection) {
          actions.setSelections(updated.newSelection);
        }
        setSuccessMessage(response.data.message || "Deleted successfully");
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setErrorMessage(response?.data?.message || "Delete failed. Please try again.");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      setErrorMessage("Delete failed. See console for details.");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <Sidebar loggedInUserDetails={loggedInUserDetails}>
      {successMessage !== "" && (
        <p className=" sticky top-20 bg-green-100 w-full p-2 ml-4 flex flex-row text-black dark:text-black">
          <IoMdDoneAll size={20} color="green" />
          {successMessage}
        </p>
      )}
      {errorMessage !== "" && (
        <p className=" sticky top-20 bg-red-100 w-full p-2 ml-4 flex flex-row text-black dark:text-black">
          <RxCross2 size={20} color="red" />
          {errorMessage}
        </p>
      )}
      <div className=" shadow-md sm:rounded-lg mt-28 w-full">
        <div className="mb-8 flex justify-center text-xl">
          <b>Placed Students</b>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Enrolment No
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Branch
              </th>
              <th scope="col" className="px-6 py-3">
                Company Name
              </th>
              <th scope="col" className="px-6 py-3">
                Offer Type
              </th>
              {loggedInUserDetails?.userType === "admin" && (
                <th scope="col" className="px-6 py-3">
                  Delete
                </th>
              )}
            </tr>
          </thead>
          {allSelections.length > 0
            ? allSelections.map((ele) => {
                return (
                  <tbody key={ele?._id}>
                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {ele?.studentDetails?.enrolmentNo}
                      </th>
                      <td className="px-6 py-4">
                        {ele?.studentDetails?.name}
                      </td>
                      <td className="px-6 py-4">
                        {ele?.studentDetails?.branch?.branchCode || ele?.studentDetails?.branch || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {ele?.companyDetails?.companyName}
                      </td>
                      <td className="px-6 py-4">
                        {ele?.companyDetails?.offerType}
                      </td>
                      {loggedInUserDetails?.userType === 'admin' && <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectionToDelete(ele?._id);
                            setShowConfirmModal(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                          title="Delete selection"
                        >
                          <MdDelete size={24} />
                        </button>
                      </td>}
                    </tr>
                  </tbody>
                );
              })
            : ""}
        </table>
        {allSelections.length === 0 && (
          <h1 className="text-red-700 text-3xl flex justify-center items-center">
            No selections yet
          </h1>
        )}
      </div>
      {/* Inline Modal for confirmation */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: 32,
            borderRadius: 8,
            minWidth: 300,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to remove this student from the selected list?</h2>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  if (!selectionToDelete) return;
                  const token = localStorage.getItem("token");
                  try {
                    const response = await fetch(
                      `${baseUrl}/api/selection/deleteSelection/${selectionToDelete}`,
                      {
                        method: "DELETE",
                        headers: { token }
                      }
                    );
                    const data = await response.json();
                    if (data.success === 1) {
                      const updated = await getAllSelections();
                      if (updated && updated.newSelection) {
                        actions.setSelections(updated.newSelection);
                      }
                      setSuccessMessage(data.message || "Deleted successfully");
                      setTimeout(() => setSuccessMessage(""), 5000);
                    } else {
                      setErrorMessage(data.message || "Delete failed. Please try again.");
                      setTimeout(() => setErrorMessage(""), 5000);
                    }
                  } catch (err) {
                    setErrorMessage("Delete failed. See console for details.");
                    setTimeout(() => setErrorMessage(""), 5000);
                  }
                  setShowConfirmModal(false);
                  setSelectionToDelete(null);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}

export default AllSelectionsPage;
