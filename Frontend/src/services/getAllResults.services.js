import axios from "axios";
import { baseUrl } from "../constants.js";

const getAllResults = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/announcements/getallannouncements/${true}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (response?.status === 200) {
        return response?.data;
      } else {
        return {};
      }
    } catch (error) {
      throw new Error(error)

    }
  };

  export {getAllResults}