import axios from "axios";
import { baseUrl } from "../constants.js";

const deleteOpening = async (_id) => {
    try {
        const response = await axios
            .delete(`${baseUrl}/api/opening/deleteOpening/${_id}`, {
                headers: {
                    token: localStorage.getItem("token")
                }
            })
        const data = response?.data
        // console.log("deleted data: ",data);

        return data;
    }
    catch (error) {
        console.log(error);
        throw new Error(error)

    }
}

export { deleteOpening }