import { useEffect } from "react";

function useTheatreSEO(movieId) {
  useEffect(() => {
    if (!movieId) {
      document.title = "Select Theatre | Movie Booking";
      return;
    }
    document.title = `Show Timings | Movie ${movieId}`;

    let metaDescription = document.querySelector(
      'meta[name="description"]'
    );

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute(
      "content",
      `Browse theatre show timings and ticket prices for movie ${movieId}.`
    );
  }, [movieId]);
}

export default useTheatreSEO;