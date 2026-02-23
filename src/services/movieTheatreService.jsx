import axios from "axios";
import {API} from "./movieService.jsx";

function getTheatreDetails(id,signal){
    return API.get(`/api/showtime-theatre/${id}`,{signal});

}

export default getTheatreDetails;