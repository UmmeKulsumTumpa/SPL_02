import axios from 'axios';

// Validate email format using a regex pattern
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Check if username already exists in the database
export const checkUsernameExists = async (username) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/admin/checkUserExist/${username}`);
        //console.log(response.statusText);
        return response.data.exists;
    } catch (error) {
        console.error("Error checking username:", error);
        return false;
    }
};
