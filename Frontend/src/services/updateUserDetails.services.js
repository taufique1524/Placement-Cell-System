import axios from "axios";
import { baseUrl } from "../constants.js";

async function updateUserDetails(id, formVal) {
    const formData = new FormData();
    formData.append('email', formVal.email);
    if (!formVal.isAdmin) {
        formData.append('resume', formVal.resume);
        formData.append('skills', formVal.skills || '');
        formData.append('linkedIn', formVal.linkedIn || '');
        formData.append('github', formVal.github || '');
        formData.append('cgpa', formVal.cgpa || 0);
    }
    formData.append('dob', formVal.dob);
    formData.append('mobile', formVal.mobile);
    formData.append('gender', formVal.gender);
    if (formVal.profileImage) {
        formData.append('profileImage', formVal.profileImage);
    }
   

    try {

        const response = await axios.patch(`${baseUrl}/api/user/updateUserDetails/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    token: localStorage.getItem('token')
                }
            }
        )

        // console.log('uuu',response?.data);
        return response?.data
    } catch (error) {
        console.log(error);
        throw new Error(error)

    }
}

export { updateUserDetails }