import { useEffect } from "react";
function useMovieSEO(movie) {
  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} | Movie Booking`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", `${movie.title}. Genre: ${movie.genre}.`);
      }
    }
  }, [movie]);
}
export default useMovieSEO;
