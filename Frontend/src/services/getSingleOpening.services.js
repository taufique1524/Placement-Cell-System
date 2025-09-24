import axios from "axios";
import { baseUrl } from "../constants.js";

async function getSingleOpening(_id) {
    try {
        const response = await axios
            .get(`${baseUrl}/api/opening/getSingleOpening/${_id}`,
            {
                headers: {
                    token: localStorage.getItem("token")
                }
            })

            // console.log("data from services: ",response?.data);
            return response?.data?.opening;
    } catch (error) {
        console.log(error);
        throw new Error(error)

    }
}

export {getSingleOpening}