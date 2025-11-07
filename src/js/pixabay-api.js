import axios from 'axios';

const BASE_URL = "https://pixabay.com/api";
const API_KEY = "52901164-552010a54c9c54893e8a3cd4c";

axios.defaults.baseURL = BASE_URL;

function getImagesByQuery({ page = 1, per_page = 20, q = "" } = {}) {
    return axios
    .get("/", {
         params: {
        page,
        per_page,
        q,
        key: API_KEY,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
         },
    }).then(({ data }) => data);
}

export default getImagesByQuery;