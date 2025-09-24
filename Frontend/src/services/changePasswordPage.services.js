import axios from "axios";
import { baseUrl } from "../constants.js";

async function changePassword(formVal) {
    try {
        const response = await axios.post(`${baseUrl}/api/user/changePassword`,
            formVal,
            {
                headers: {
                    token: localStorage.getItem('token')
                }
            }
        )

        const data = response?.data;

        return data;

    } catch (error) {
        console.log(error);
        throw new Error(error)

    }
}

export { changePassword }