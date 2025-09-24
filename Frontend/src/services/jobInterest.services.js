import axios from "axios";
import { baseUrl } from "../constants.js";

// Express interest in a job opening
export async function expressInterest(openingId, isInterested, reason = "") {
    try {
        const response = await axios.post(
            `${baseUrl}/api/job-interest/express`,
            {
                openingId,
                isInterested,
                reason
            },
            {
                headers: {
                    token: localStorage.getItem("token")
                }
            }
        );
        return response?.data;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

// Get interest status for a user and opening
export async function getInterestStatus(openingId) {
    try {
        const response = await axios.get(
            `${baseUrl}/api/job-interest/status/${openingId}`,
            {
                headers: {
                    token: localStorage.getItem("token")
                }
            }
        );
        return response?.data;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

// Get statistics for a job opening (admin only)
export async function getOpeningStatistics(openingId) {
    try {
       // console.log('getOpeningStatistics: Making request for openingId:', openingId);
        const token = localStorage.getItem("token");
      //  console.log('getOpeningStatistics: Token exists:', !!token);
        
        const response = await axios.get(
            `${baseUrl}/api/job-interest/statistics/${openingId}`,
            {
                headers: {
                    token: localStorage.getItem("token")
                }
            }
        );
      //     console.log('getOpeningStatistics: Response received:', response.data);
        return response?.data;
    } catch (error) {
        console.error('getOpeningStatistics: Error:', error);
        console.error('getOpeningStatistics: Error response:', error.response?.data);
        throw new Error(error);
    }
}