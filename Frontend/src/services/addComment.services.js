import axios from "axios";
import { baseUrl } from "../constants.js";

async function addComment(commentMessage, announcementId) {
    try {
        const res = await axios.post(
            `${baseUrl}/api/comments/addComment`,
            {
                content: commentMessage,
                announcementId // single announcement id
            },
            {
                headers: {
                    token: localStorage.getItem("token"),
                },
            }
        );

        const addedComment = res?.data?.data;
        return addedComment;
    } catch (error) {
        console.log(error);
        throw new Error(error)
    }
}
export { addComment }