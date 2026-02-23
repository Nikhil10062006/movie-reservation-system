import axios from "axios";
import {API} from "./movieService.jsx";

function getMoviesById(id,signal){
    return API.get(`/api/movies/${id}`,{signal:signal});

}
export default getMoviesById;

