import axios from "axios";
import { baseUrl } from "../constants.js";

const getUserData = async(id)=>{
    try{
        const _id = id;
        // console.log(_id);
        const response = await axios.get(
            `${baseUrl}/api/user/otherUserProfile/${_id}`,
            {
                headers:{
                    token:localStorage.getItem("token")
                }
            }
        )

        // console.log(response?.data);
        return response?.data;
        
    }
    catch(error){
        console.log("error in fetching userData",error);
        throw new Error(error)

    }
}
export{
    getUserData,
}