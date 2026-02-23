import { useState } from "react";
function TheatreCards({ theatre }) {
  return (
    <li key={theatre.id}>
      <p>{theatre.name}</p>
      {theatre.shows.map((show) => {
        return (
          <>
            <p>{show.time}</p>
            <p>{show.price}</p>
          </>
        );
      })}
    </li>
  );
}
export default TheatreCards;
