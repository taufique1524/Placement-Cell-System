import axios from "axios";
import { baseUrl } from "../constants.js";

async function getAllOpenings(){
    try {
        const response = await axios.get(`${baseUrl}/api/opening/getAllOpenings`,{
            headers:{
                token:localStorage.getItem("token")
            }
        }) 

        return response?.data?.allOpenings

    } catch (error) {
        throw new Error(error)

    }
}

export {getAllOpenings}