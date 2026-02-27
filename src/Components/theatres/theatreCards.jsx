import { useState } from "react";
import {useNavigate} from "react-router-dom";
function TheatreCards({ theatre }) {
  const navigate = useNavigate();
  return (
    <li>
      <p>{theatre.name}</p>
      {theatre.shows.map((show) => {
        return (
          <div key={show.showId}>
            <button onClick={() => navigate("/reservation")}>{show.time}</button>
            <p>{show.price}</p>
          </div>
        );
      })}
    </li>
  );
}
export default TheatreCards;
