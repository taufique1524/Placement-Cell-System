import axios from "axios";
import { baseUrl } from "../constants.js";

const getAllUsers = async (getAdminsOnly) => {
    // getAdminsOnly give you option to load only admins
    try {
        const response = await axios.get(
            `${baseUrl}/api/user/${getAdminsOnly}`,
            {
                headers: {
                    token: localStorage.getItem("token"),
                },
            }
        );

        return response?.data;
    } catch (error) {
        throw new Error(error)

    }
};

export { getAllUsers }