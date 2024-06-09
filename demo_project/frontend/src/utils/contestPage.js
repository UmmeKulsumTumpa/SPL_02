import axios from 'axios';

export const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
};

export const calculateLength = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime; // difference in milliseconds
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60)); // difference in hours
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // difference in minutes

    return `${diffHrs}h ${diffMins}m`;
};

export const filterContestsByStatus = (contests, currentTime, status) => {
    return contests.filter(contest => {
        const startTime = new Date(contest.startTime);
        const endTime = new Date(contest.endTime);
        if (status === 'upcoming') {
            return endTime > currentTime && startTime > currentTime;
        } else if (status === 'running') {
            return startTime <= currentTime && endTime > currentTime;
        } else if (status === 'previous') {
            return endTime < currentTime;
        }
        return false;
    });
};

export const calculateCountdown = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = start - now;

    if (diffMs <= 0) return 'Started';

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffDays}d ${diffHrs}h ${diffMins}m`;
};

export const registerUserForContest = async (contestId, username) => {
    try {
        const response = await axios.post(`http://localhost:8000/api/approved_contest/register/${contestId}`, { username });
        return response.data;
    } catch (error) {
        console.error('Error registering user for contest:', error);
        return null;
    }
};

export const isUserRegistered = async (contestId, username) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/approved_contest/is_registered/${contestId}`, { params: { username } });
        return response.data.isRegistered;
    } catch (error) {
        console.error('Error checking user registration status:', error);
        return false;
    }
};
