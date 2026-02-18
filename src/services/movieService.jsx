import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});
function getMovies(selectedFilters, signals) {
  const params = {};
  for (let category in selectedFilters) {
    if (selectedFilters[category].length > 0) {
      params[category] = selectedFilters[category].join(",");
    }
  }

  return API.get("/api/movies", { params, signal: signals });
}
export default getMovies;
