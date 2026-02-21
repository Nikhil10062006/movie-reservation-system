import { memo } from "react";
const MovieCards = memo(function MovieCards({ movie, key }) {
  return (
    <li className="cards" key={key}>
      <img src={movie.thumbnail} alt={movie.title} loading="lazy" />
      <h4>{movie.title}</h4>
      <p>{movie.language}</p>
    </li>
  );
});
export default MovieCards;
