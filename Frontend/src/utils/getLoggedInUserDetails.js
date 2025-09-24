import axios from "axios";
import { baseUrl } from "../constants.js";

export const getLoggedInUserDetails = async () => {
    try {
        // Check if token exists
        const token = localStorage.getItem('token');
        
        if (!token) {
            return { success: 0, message: "Please log in first" };
        }

        // Set up headers with token in multiple formats to ensure compatibility
        const headers = {
            token: token,
            'Authorization': `Bearer ${token}`
        };
        
        const response = await axios.get(`${baseUrl}/api/user/loggedInUserDetails`, {
            headers: headers,
            // Add timeout to avoid hanging requests
            timeout: 10000
        });
        
        // Check if the response has the new format with success field
        if (response.data && response.data.success === 1 && response.data.user) {
            // Store isAdmin status in localStorage for easy access
            localStorage.setItem('isAdmin', response.data.user.isAdmin);
            return {
                ...response.data.user,
                success: 1
            };
        }
        
        // Handle legacy format where the user data is directly in the response
        if (response.data && response.data._id) {
            // Store isAdmin status in localStorage for easy access
            localStorage.setItem('isAdmin', response.data.isAdmin);
            return {
                ...response.data,
                success: 1
            };
        }
        
        // If we got here, the response format is unexpected
        return { 
            success: 0, 
            message: "Invalid response format from server" 
        };
    } catch (error) {
        
        // Handle specific error cases
        if (error.response?.status === 400 || error.response?.status === 401) {
            localStorage.removeItem('token'); // Clear invalid token
            return { success: 0, message: "Session expired. Please log in again." };
        }
        
        if (error.response?.status === 500) {
            
            // Check if the error is related to ObjectId casting (branch reference)
            if (error.response?.data?.message?.includes("Cast to ObjectId failed") || 
                error.response?.data?.message?.includes("branch")) {
                
                // We can still return some basic user info from the token
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        // Decode the token to get basic user info
                        const base64Url = token.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const tokenData = JSON.parse(window.atob(base64));
                        
                        // Store isAdmin status in localStorage for easy access
                        localStorage.setItem('isAdmin', tokenData.isAdmin);
                        
                        return { 
                            success: 1,
                            _id: tokenData._id,
                            email: tokenData.email,
                            isAdmin: tokenData.isAdmin,
                            enrolmentNo: tokenData.enrolmentNo,
                            // Add placeholder values for required fields
                            name: "User",
                            branch: "Unknown",
                            usingFallback: true
                        };
                    } catch (tokenError) {
                    }
                }
            }
            
            return { 
                success: 0, 
                message: "Server error. Please try again later." 
            };
        }
        
        if (error.code === 'ECONNABORTED') {
            return { 
                success: 0, 
                message: "Request timed out. Please check your connection." 
            };
        }
        
        return { 
            success: 0, 
            message: error.response?.data?.message || "Failed to fetch user details" 
        };
    }
}