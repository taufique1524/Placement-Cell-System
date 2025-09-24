import { deleteSelection } from "../services/deleteSelection.services.js";
import { getAllSelections } from "../services/getAllSelections.services.js";

const handleDelete = async (_id, allSelections,
    setAllSelections, setSuccessMessage,
    setErrorMessage) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            setErrorMessage("You are not logged in. Please log in as an admin to delete selections.");
            setTimeout(() => setErrorMessage(""), 5000);
            return false;
        }
        const data = await deleteSelection(_id);
        if (data?.success === 1) {
            // After successful delete, fetch updated selections from backend
            const updated = await getAllSelections();
            if (updated && updated.newSelection) {
                setAllSelections(updated.newSelection);
            } else {
                // fallback: remove from local list
                const newAllSelections = allSelections.filter((ele) => ele?._id !== _id);
                setAllSelections(newAllSelections);
            }
            setSuccessMessage(data?.message);
            setTimeout(() => {
                setSuccessMessage("");
            }, 5000);
            return true;
        } else {
            if (data?.message && (data?.message.includes("Unauthorized") || data?.message.includes("forbidden") || data?.message.includes("Authentication") || data?.message.includes("admin"))) {
                setErrorMessage("You are not authorized to delete selections. Please log in as an admin.");
            } else {
                setErrorMessage(data?.message || "Delete failed. Please try again.");
            }
            setTimeout(() => {
                setErrorMessage("");
            }, 5000);
            return false;
        }
    } catch (error) {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            setErrorMessage("Session expired or unauthorized. Please log in as an admin.");
        } else {
            setErrorMessage('Delete failed. See console for details.');
        }
        setTimeout(() => setErrorMessage(""), 5000);
        return false;
    }
};

export {
    handleDelete
}