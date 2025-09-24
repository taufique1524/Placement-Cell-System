import axios from "axios";
import { baseUrl } from "../constants.js";

/**
 * Gets the data of a single announcement.
 *
 * @param {string} id The ID of the announcement to retrieve.
 * @returns {Promise<Object>} The data of the announcement.
 */
const getSingleAnnouncementData = async (id) => {
    try {
        const _id = id;
        const response = await axios.get(`${baseUrl}/api/announcements/${_id}`, {
            headers: {
                token: localStorage.getItem('token'),
            },
        });

        // console.log(response);

        return response?.data;
    } catch (error) {
        console.log('error');
        throw new Error(error)

    }
};

export default getSingleAnnouncementData;