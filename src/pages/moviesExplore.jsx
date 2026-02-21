import { useState, useEffect, memo, useCallback, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import getMovies from "../services/movieService.jsx";
import { useFilters } from "../contexts/filterContexts.jsx";
import Options from "../components/options.jsx";

const Navbar = lazy(() => import("../components/navbar.jsx"));
const MovieCards = lazy(() => import("../components/movies/movieCards.jsx"));

function MoviesExplore() {
  const [openFilter, setOpenFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const { selectedFilters, setSelectedFilters } = useFilters();
  const navigate = useNavigate();

  const toggleFilter = useCallback((filterName) => {
    setOpenFilter((prev) => (prev === filterName ? null : filterName));
  }, []);

  useEffect(() => {
    const raceController = new AbortController(); //Adding controllers
    localStorage.setItem("filters", JSON.stringify(selectedFilters));
    const timeOutId = setTimeout(() => {
      setLoading(true);
      setError(null);

      getMovies(selectedFilters, raceController.signal)
        .then((res) => {
          setLoading(false);
          setError(null);

          if (!res || !res.data || Array.isArray(res.data)) {
            setError("Invalid response from the server");
            return;
          }
          const moviesList = res.data.data;
          const validateMovies = [];

          for (const movie of moviesList) {
            if (
              movie &&
              typeof movie._id === "string" &&
              typeof movie.language === "string" &&
              typeof movie.thumbnail === "string" &&
              typeof movie.title === "string"
            ) {
              validateMovies.push({
                ...movie,
                title: movie.title || "Untitled",
                thumbnail: movie.thumbnail || "default.jpg",
              });
            }
          }

          if (validateMovies.length === 0 && moviesList.length > 0)
            setError("Corrupted Data received from the server");

          setMovies((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(validateMovies)) {
              return prev;
            }
            return validateMovies;
          });
        })
        .catch((err) => {
          if (err.name === "CanceledError" || err.name === "AbortError") {
            return;
          }
          setLoading(false);
          if (!err.response) {
            setError("Network Error");
            return;
          }
          const statusCode = err.response.status;
          const message = err.response.data?.message || "Something went wrong";
          if ([400, 409, 500, 503, 422].includes(statusCode)) {
            setError(message);
          } else {
            setError("Unexpected Error Occurred");
          }
        });
    }, 200);
    return () => {
      clearTimeout(timeOutId);
      raceController.abort();
    };
  }, [selectedFilters]);

  useEffect(() => {
    const savedFilter = localStorage.getItem("filters");
    if (savedFilter) {
      setSelectedFilters(JSON.parse(savedFilter));
    }
  }, []);

  return (
    <div>
      <header>
        <Suspense fallback={<p>Loading...</p>}>
          <Navbar />
        </Suspense>
      </header>
      <main>
        <aside>Advertisements</aside>
        <section>
          <h4>Filters</h4>
          <Options
            expanded={openFilter === "Languages"}
            contents={["Tamil", "English", "Malayalam", "Hindi", "Telegu"]}
            onShow={() => {
              toggleFilter("Languages");
            }}
            setSelectedFilters={setSelectedFilters}
          >
            Languages
          </Options>
          <Options
            expanded={openFilter === "Genre"}
            contents={[
              "Romantic",
              "Drama",
              "Comedy",
              "Thriller",
              "Action",
              "Crime",
              "Family",
              "Fantasy",
              "Social",
            ]}
            onShow={() => {
              toggleFilter("Genre");
            }}
            setSelectedFilters={setSelectedFilters}
          >
            Genre
          </Options>
          <Options
            expanded={openFilter === "Format"}
            contents={["2D", "3D"]}
            onShow={() => {
              toggleFilter("Format");
            }}
            setSelectedFilters={setSelectedFilters}
          >
            Format
          </Options>
        </section>
        <section>
          <h3>Movies in Vellore</h3>
          <div onClick={() => navigate("/upcoming-movies")}>Coming soon</div>
          <Suspense fallback={<p>Loading...</p>}>
            <div>
              <h3>Movies will appear here</h3>
              {error && <p>{error}</p>}
              {movies.length > 0 && (
                <ul>
                  {movies.map((movie) => {
                    return (
                      <Suspense loading={<p>Loading...</p>}>
                        <MovieCards key={movie._id} movie={movie} />
                      </Suspense>
                    );
                  })}
                </ul>
              )}
              {!loading && movies.length === 0 && <p>No movies found </p>}
            </div>
          </Suspense>
        </section>
      </main>
    </div>
  );
}

export default MoviesExplore;
