import { useState, useEffect, lazy, Suspense } from "react";
import {useParams} from "react-router-dom";
import getMoviesById from "../services/movieIndividualService.jsx";
import normalizeMovieData from "../utils/normalizeMovieData.jsx";
import MovieBanner from "../components/movies/movieBanner.jsx";
import BookButton from "../components/movies/bookButton.jsx";
import ErrorBoundary from "../components/errorBoundary.jsx";
import useMovieSEO from "../hooks/useMovieSEO.jsx";
const Navbar = lazy(() => import("../components/navbar.jsx"));
const MovieDetails = lazy(
  () => import("../components/movies/movieDetails.jsx"),
);
const MovieCast = lazy(() => import("../components/movies/movieCast.jsx"));

function MoviesIndividual() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [movie, setMovie] = useState(null);
  useEffect(() => {
    setLoading(true);
    setErrors(null);
    setMovie(null);
    const controller = new AbortController();

    getMoviesById(id, controller.signal)
      .then((res) => {
        setLoading(false);
        if (!res?.data?.data) {
          setErrors("No movie data found");
          return;
        }

        const movieData = res.data.data;

        const validatedMovie = normalizeMovieData(movieData);
        if (!validatedMovie) {
          setErrors("Unmatched Data Format");
          return;
        }
        setMovie(validatedMovie);
      })
      .catch((err) => {
        setLoading(false);
        if (err.name === "CanceledError" || err.name === "AbortError") {
          return;
        }
        if (!err.response) {
          setErrors("Network Error");
          return;
        }

        const message = err.response.data?.message;
        const statusCode = err.response.status;

        if ([400, 409, 500, 503, 422].includes(statusCode)) {
          setErrors(message);
        } else {
          setErrors("Unexpected Error Occurred");
        }
      });

    return () => {
      controller.abort();
    };
  }, [id]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useMovieSEO(movie);
  if (loading) {
    return <p>Loading ...</p>;
  }
  // if (errors) {
  //   return <p>{errors}</p>;
  // }
  return (
    <div>
      <header>
        <Suspense fallback={<p>Loading...</p>}>
          <Navbar />
        </Suspense>
      </header>
      <main>
        {movie && (
          <>
            <ErrorBoundary fallback={<p>Unable to load movie banner.</p>}>
              <MovieBanner movie={movie} />
            </ErrorBoundary>
            <ErrorBoundary fallback={<p>Unable to load movie details.</p>}>
              <Suspense fallback={<p>Loading...</p>}>
                <MovieDetails movie={movie} />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={<p>Unable to load movie cast details.</p>}>
              <Suspense fallback={<p>Loading...</p>}>
                <MovieCast movie={movie} />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={<p>Unable to load book button.</p>}>
              <BookButton movie={movie} />
            </ErrorBoundary>
          </>
        )}
      </main>
    </div>
  );
}
export default MoviesIndividual;
