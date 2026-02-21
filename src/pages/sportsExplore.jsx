import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import Options from "../components/options.jsx";
import getMovies from "../services/movieService.jsx";
import { useFilters } from "../contexts/filterContexts.jsx";

const Navbar = lazy(() => import("../components/navbar.jsx"));
const MovieCards = lazy(() => import("../components/movies/movieCards.jsx"));

function SportsExplore() {
  const { selectedFilters, setSelectedFilters } = useFilters();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sports, setSports] = useState([]);
  const [openFilter, setOpenFilter] = useState(null);
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
            setErrors("No response received from the server");

            return;
          }

          const sportsList = res.data.data;
          const validatedSports = [];

          for (const sports of sportsList) {
            if (
              sports &&
              typeof sports._id === "string" &&
              typeof sports.title === "string" &&
              typeof sports.location === "string" &&
              typeof sports.thumbnail === "string" &&
              typeof sports.price === "string"
            ) {
              validatedSports.push({
                ...activity,
                thumbnail: sports.thumbnail || "default.png",
                title: sports.title || "Untitled",
              });
            }
          }

          if (validatedSports.length === 0 && sportsList.length > 0) {
            setErrors("Coorupted Data received from the server");
            return;
          }

          setSports((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(validatedSports)) {
              return prev;
            }
            return validatedSports;
          });
        })
        .catch((err) => {
          setLoading(false);

          if (!err.response) {
            setErrors("Network Error");
            return;
          }

          const message = err.response.data?.message || "Something went wrong";
          const statusCode = err.response.status;

          if ([400, 409, 500, 503, 422].includes(statusCode)) {
            setErrors(message);
          } else {
            setErrors("Unknown Error Occured");
          }
        });
    }, 300);

    return () => {
      clearTimeout(timeOutId);
      controller.abort();
    };
  }, [selectedFilters]);

  const toggleFilters = useCallback((prevFilter) => {
    setOpenFilter((prev) => (prev === prevFilter ? null : prevFilter));
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
          <h3>Filters</h3>
          <Options
            onShow={() => toggleFilters("Date")}
            expanded={openFilter === "Date"}
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
            onShow={() => toggleFilters("Categories")}
            expanded={openFilter === "Categories"}
            contents={["Cricket", "MotorSports"]}
            setSelectedFilters={setSelectedFilters}
          >
            Categories
          </Options>
          <Options
            onShow={() => toggleFilters("Price")}
            setSelectedFiters={setSelectedFilters}
            expanded={openFilter === "Price"}
            contents={["Free", "0 - 500", "500 - 2000", "Above 2000"]}
          >
            Price
          </Options>
        </section>
        <section>
          <h4>Sports will appear here</h4>
          {errors && <p>{errors}</p>}
          {!loading && sports.length === 0 && <p>No Sports found</p>}
          {sports.length > 0 && (
            <ul>
              {sports.map((sport) => {
                return (
                  <Suspense key={sport._id} fallback={<p>Loading ... </p>}>
                    <MovieCards movie={sport} />
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

export default SportsExplore;
