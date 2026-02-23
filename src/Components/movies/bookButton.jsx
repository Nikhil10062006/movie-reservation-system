import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BookButton({ movie }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate(`/movies/${movie._id}/select-theatre`);
      }}
    >
      Book Tickets
    </button>
  );
}
export default BookButton;
