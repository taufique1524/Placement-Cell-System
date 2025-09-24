import axios from "axios";
import { baseUrl } from "../constants.js";

async function updateAnnouncement(formContent,id){
    try {
        const _id = id; // id of the announcement
        const response = await axios.patch(`${baseUrl}/api/announcements/${_id}`,{formContent},{
            headers:{
                token:localStorage.getItem("token")
            }
        });
        // console.log(response);
        return response?.data;
    } catch (error) {
        console.log("error in updating announcement",error);
        throw new Error(error)

    }
}

export {updateAnnouncement}