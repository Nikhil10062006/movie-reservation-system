import { useState, useEffect, lazy, Suspense,useCallback } from "react";
import getMovies from "../services/movieService.jsx";
import { useFilters } from "../contexts/filterContexts.jsx";
import Options from "../components/options.jsx";
const Navbar = lazy(() => import("../components/navbar.jsx"));
const MovieCards = lazy(() => import("../components/movies/movieCards.jsx"));

function PlaysExplore() {
  const { selectedFilters, setSelectedFilters } = useFilters();
  const [openFilter, setOpenFilters] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plays, setPlays] = useState([]);
  const toggleFilters = useCallback((filterName) => {
    setOpenFilters((prev) => (prev === filterName ? null : filterName));
  }, []);
  useEffect(() => {
    const savedFilters = localStorage.getItem("filters");
    if (savedFilters) {
      setSelectedFilters(JSON.parse(savedFilters));
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErrors(null);
    const timeOutId = setTimeout(() => {
      getMovies(selectedFilters, controller.signal)
        .then((res) => {
          setLoading(false);
          if (!res || !res.data || !Array.isArray(res.data.data)) {
            setErrors("No response received");

            return;
          }

          const playsList = res.data.data;
          const validatedPlays = [];

          for (const plays of playsList) {
            if (
              plays &&
              typeof plays.title === "string" &&
              typeof plays.thumbnal === "string" &&
              typeof plays.language === "string" &&
              typeof plays.price === "string" &&
              typeof plays.location === "string"
            ) {
              validatedPlays.push({
                ...plays,
                thumbnail: plays.thumbnail || "default.png",
                title: plays.title || "Untitled",
              });
            }
        }

            if (validatedPlays.length === 0 && playsList.length > 0) {
              setErrors("Corrupted Data received from the server");
            }
            setPlays((prev) => {
              if (JSON.stringify(validatedPlays) === JSON.stringify(prev)) {
                return prev;
              }
              return validatedPlays;
            });
          
        })
        .catch((err) => {
            setLoading(false);
          if (err.name === "CanceledError" || err.name === "AbortError") {
            return;
          }

          if (!err.response) {
            setErrors("No response receioved from the server");
            
            return;
          }

          const message = err.response.data?.message || "Something went wrong";
          const statusCode = err.response.status;

          if ([400, 409, 500, 503, 422].includes(statusCode)) {
            setErrors(message);
            return;
          } else {
            setErrors("Unexpected Error Occured");
          }
        });
    }, 300);

    return () => {
      clearTimeout(timeOutId);
      controller.abort();
    };
  }, [selectedFilters]);
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
          <h3>Filters</h3>
          <Options
            expanded={openFilter === "Date"}
            onShow={() => toggleFilters("Date")}
            contents={[
              "Today",
              "Tomorrow",
              "Day After Tomorrow",
              "This weekend",
            ]}
            setSelectedFilters={setSelectedFilters}
          >
            Date
          </Options>
          <Options
            expanded={openFilter === "Categories"}
            onShow={() => toggleFilters("Categories")}
            contents={["Theatre"]}
            setSelectedFilters={setSelectedFilters}
          >
            Categories
          </Options>
          <Options
            expanded={openFilter === "Languages"}
            onShow={() => toggleFilters("Languages")}
            contents={[
              "Hindi",
              "Marathi",
              "Malayalam",
              "English",
              "Tamil",
              "Telegu",
            ]}
            setSelectedFilters={setSelectedFilters}
          >
            Language
          </Options>
          <Options
            expanded={openFilter === "Genre"}
            onShow={() => toggleFilters("Genre")}
            contents={["Drama", "Romance", "Action"]}
            setSelectedFilters={setSelectedFilters}
          >
            Genre
          </Options>
          <Options
            expanded={openFilter === "Price"}
            onShow={() => toggleFilters("Price")}
            contents={["Free", "0 - 500", "500-2000", "Above 2000"]}
            setSelectedFilters={setSelectedFilters}
          >
            Price
          </Options>
        </section>
        <section>
          <h3>Plays will appear here</h3>
          {errors && <p>{errors}</p>}
          {!loading && plays.length === 0 && (<p>No plays found</p>)}
          {plays.length > 0 && (
            <ul>
              {plays.map((play) => {
                return (
                  <Suspense fallback={<p>Loading...</p>} key={play._id}>
                    <MovieCards movie={play} />
                  </Suspense>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default PlaysExplore;
