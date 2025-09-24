import axios from "axios";
import { baseUrl } from "../constants.js";

async function deleteSelection(_id) {
    try {
        const response = await axios
            .delete(`${baseUrl}/api/selection/deleteSelection/${_id}`, {
                headers: {
                    token: localStorage.getItem("token")
                }
            })
        return response?.data;
    } catch (error) {
        // Return backend error response if available
        if (error?.response?.data) {
            return error.response.data;
        }
        // Otherwise, return a generic error
        return { success: 0, message: "Delete failed. Network or server error." };
    }
}

export {deleteSelection}