import { useState } from "react";
import TheatreCards from "./theatreCards";
function TheatreList({ theatres }) {
  return (
    <ul>
      {theatres.map((theatre) => {
        return <TheatreCards theatre={theatre} />;
      })}
    </ul>
  );
}
export default TheatreList;
