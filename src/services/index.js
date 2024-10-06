import axios from 'axios';

const client = axios.create({
    baseURL: process.env.REACT_APP_BASED_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    validateStatus: (status) => status >= 200 && status < 510,
});

// POST 메서드
export const postData = async (url, data = {}, config = {}) => {
    const response = await client.post(url, data, config);
    console.log("POSTDATA", response);
    return response;
};