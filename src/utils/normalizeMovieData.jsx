function normalizeMovieData(movieData) {
  if (
    !movieData ||
    typeof movieData.title !== "string" ||
    typeof movieData.poster_url !== "string" ||
    typeof movieData.duration !== "number" ||
    typeof movieData.genre !== "string"
  ) {
    return null;
  }

  return {
    title: movieData.title || "Untitled",
    cast: Array.isArray(movieData.cast)
      ? movieData.cast
      : [movieData.cast || "Unknown Cast"],
    poster_url: movieData.poster_url || "default.png",
    genre: movieData.genre || "Unknown Genre",
    duration: movieData.duration || 0,
  };
}
export default normalizeMovieData;
