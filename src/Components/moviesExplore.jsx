import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar.jsx";
function Options({ children, onShow, expanded, contents, setSelectedFilters }) {
  return (
    <div>
      <button
        aria-expanded={expanded}
        aria-controls={children}
        onClick={onShow}
        type="button"
      >
        {children}
      </button>
      {expanded && (
        <div>
          <ul id={children}>
            {contents.map((content, idx) => (
              <li key={content}>
                <button
                  onClick={() => {
                    setSelectedFilters((prevFilters) => {
                      const alreadySelected =
                        prevFilters[children].includes(content);
                      if (alreadySelected) {
                        return {
                          ...prevFilters,
                          [children]: prevFilters[children].filter(
                            (item) => item !== content,
                          ),
                        };
                      } else {
                        return {
                          ...prevFilters,
                          [children]: [...prevFilters[children], content],
                        };
                      }
                    });
                  }}
                >
                  {content}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MoviesExplore() {
  const [openFilter, setOpenFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    Languages: [],
    Genre: [],
    Format: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = {};
    for (let category in selectedFilters) {
      if (selectedFilters[category].length > 0) {
        params[category] = selectedFilters[category].join(",");
      }
    }

    axios
      .get("http://localhost:5000/api/movies", {
        params: params,
      })
      .then((res) => {
        setLoading(false);
        setError(null);
        if (res.data.data.length > 0) {
          setMovies(res.data.data);
        }
      })
      .catch((err) => {
        if (!err.response) {
          setError("Network Error");
          return;
        }
        const statusCode = err.response.status;
        const message = err.response.data?.message || "Something went wrong";
        setLoading(false);
        if ([400, 409, 500, 503, 422].includes(statusCode)) {
          setError(message);
        } else {
          setError("Unexpected Error Occurred");
        }
      });
  }, [selectedFilters]);

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>
        <aside>Advertisements</aside>
        <section>
          <h4>Filters</h4>
          <Options
            expanded={openFilter === "Languages"}
            contents={["Tamil", "English", "Malayalam", "Hindi", "Telegu"]}
            onShow={() => {
              setOpenFilter(openFilter === "Languages" ? null : "Languages");
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
              setOpenFilter(openFilter === "Genre" ? null : "Genre");
            }}
            setSelectedFilters={setSelectedFilters}
          >
            Genre
          </Options>
          <Options
            expanded={openFilter === "Format"}
            contents={["2D", "3D"]}
            onShow={() => {
              setOpenFilter(openFilter === "Format" ? null : "Format");
            }}
            setSelectedFilters={setSelectedFilters}
          >
            Format
          </Options>
        </section>
        <section>
          <h3>Movies in Vellore</h3>
          <div onClick={() => navigate("/upcoming-movies")}>Coming soon</div>
          <div>
            <h3>Movies will appear here</h3>
            {error && <p>{error}</p>}
            {movies.length > 0 && (
              <ul>
                {movies.map((movie) => {
                  return (
                    <li id="cards" key={movie._id}>
                      <p>{movie.thumbnail}</p>
                      <h4>{movie.title}</h4>
                      <p>{movie.language}</p>
                    </li>
                  );
                })}
              </ul>
            )}
            {!loading && movies.length === 0 && <p>No movies found </p>}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MoviesExplore;
