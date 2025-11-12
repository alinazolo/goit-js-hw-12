import axios from 'axios';

const BASE_URL = "https://pixabay.com/api";
const API_KEY = "52901164-552010a54c9c54893e8a3cd4c";

axios.defaults.baseURL = BASE_URL;

async function getImagesByQuery({ page = 1, per_page = 20, q = "" } = {}) {
    try {
        const response = await axios.get("/", {
        params: {
        page,
        per_page,
        q,
        key: API_KEY,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
         },
    }); 
    return response.data;
    } catch(error) {
            console.error("Error fetching images:", error);
            throw error;
    }
}
  
export default getImagesByQuery;