import axios from "axios";
import { baseUrl } from "../constants.js";

async function getAllSelections(){
    try {
        const response = await axios
            .get(`${baseUrl}/api/selection/getAllSelections`,
                {
                    headers:{
                        token:localStorage.getItem("token")
                    }
                }
            )
        return response?.data;
        
    } catch (error) {
        throw new Error(error)

    }
}

export {getAllSelections}