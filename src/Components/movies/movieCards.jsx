import { memo } from "react";
import {useNavigate} from "react-router-dom";
const MovieCards = memo(function MovieCards({ movie }) {
  const navigate = useNavigate();
  return (
    <li className="cards"  onClick={()=>{ navigate(`/movies/${movie._id}`)}}>
      <img src={movie.thumbnail} alt={movie.title} loading="lazy" />
      <h4>{movie.title}</h4>
      <p>{movie.language}</p>
    </li>
  );
});
export default MovieCards;
