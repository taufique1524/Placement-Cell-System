import axios from "axios";
import { baseUrl } from "../constants.js";

async function getAllBranches (){
    try {
        const res = await axios.get(`${baseUrl}/api/branch/getBranches`)
        return res?.data
    } catch (error) {
        console.log(error);
        throw new Error(error)

    }
}

export default getAllBranches