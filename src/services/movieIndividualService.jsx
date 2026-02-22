import axios from "axios";
const API = axios.create({
    baseURL :import.meta.env.VITE_API_URL || "http://localhost:5000"
});

function getMoviesById(id,signal){
    return API.get(`/api/movies/${id}`,{signal:signal});

}
export default getMoviesById;

