import axios from "axios";
import { getAllAnnouncements } from "./getAllAnnouncements.services";
import { baseUrl } from "../constants.js";

const postAnnouncement = async (e, setValue, value,setAllAnnouncements) => {
    // add announcement
    e.preventDefault();
    const isResults = "false";
    try {
        //   console.log("data from add annc", localStorage.getItem("token"));
        const response = await axios.post(
            `${baseUrl}/api/announcements/addannouncement/${isResults}`,
            {
                content: value, // this is the announcement we need to send
            },
            {
                headers: {
                    token: localStorage.getItem("token"),
                },
            }
        );
        setValue("");
        const addedAnnouncement = response?.data?.data;
        setAllAnnouncements((prev)=>{ // update the all announcements without re calling the api
            return [addedAnnouncement,...prev]
        })
        // navigate('/allannouncements')
    } catch (error) {
        console.log("error in posting the comment", error);
        throw new Error(error)

    }
};

export { postAnnouncement }