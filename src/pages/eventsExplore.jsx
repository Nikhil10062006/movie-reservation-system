import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import Options from "../components/options.jsx";
import { useFilters } from "../contexts/filterContexts.jsx";
import getMovies from "../services/movieService.jsx";

const Navbar = lazy(() => import("../components/navbar.jsx"));
const MovieCards = lazy(() => import("../components/movies/movieCards.jsx"));

function EventsExplore() {
  const [openFilter, setOpenFilter] = useState(null);
  const { selectedFilters, setSelectedFilters } = useFilters();
  const [errors, setErrors] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedFilter = localStorage.getItem("filters");
    if (savedFilter) {
      setSelectedFilters(JSON.parse(savedFilter));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(selectedFilters));
    setLoading(true);
    setErrors(null);
    const controller = new AbortController();
    const timeOutId = setTimeout(() => {
      getMovies(selectedFilters, controller.signal)
        .then((res) => {
          setLoading(false);
          if (!res || !res.data || !Array.isArray(res.data.data)) {
            setErrors("Response Not received from the server");
            return;
          }
          const eventsList = res.data.data;
          const validateEvents = [];

          for (const event of eventsList) {
            if (
              event &&
              typeof event._id === "string" &&
              typeof event.thumbnail === "string" &&
              typeof event.location === "string" &&
              typeof event.price === "string" &&
              typeof event.title === "string"
            ) {
              validateEvents.push({
                ...event,
                thumbnail: event.thumbnail || "default.jpg",
                title: event.title || "Untitled",
              });
            }
          }
          setLoading(false);
          if (validateEvents.length === 0 && eventsList.length > 0) {
            setErrors("Corrupted Data received from the server");

            return;
          }

          setEvents((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(validateEvents)) {
              return prev;
            }
            return validateEvents;
          });
        })
        .catch((err) => {
          setLoading(false);
          if (err.name === "CanceledError" || err.name === "AbortedError") {
            return;
          }

          if (!err.response) {
            setErrors("No response received from the server.");
            return;
          }

          const statusCode = err.response.status;
          const message = err.response.data?.message || "Something went wrong";
          setLoading(false);
          if ([400, 409, 500, 503, 422].includes(statusCode)) {
            setErrors(message);
          } else {
            setErrors("Unexpected Error Occurred");
          }
        });
    }, 300);

    return () => {
      clearTimeout(timeOutId);
      controller.abort();
    };
  }, [selectedFilters]);

  const toggleFilters = useCallback((prevFilter) => {
    setOpenFilter((prev) => {
      return prev === prevFilter ? null : prevFilter;
    });
  }, []);

  return (
    <div>
      <header>
        <Suspense fallback={<p> Loading...</p>}>
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
            onShow={() => toggleFilters("Languages")}
            expanded={openFilter === "Languages"}
            contents={["English", "Malayalam", "Hindi", "Tamil", "Telegu"]}
            setSelectedFilters={setSelectedFilters}
          >
            Languages
          </Options>
          <Options
            expanded={openFilter === "Categories"}
            contents={[
              "Music Shows",
              "Kids",
              "Comedy Shows",
              "WorkShops",
              "Exhibitions",
              "Performance",
            ]}
            onShow={() => toggleFilters("Categories")}
            setSelectedFilters={setSelectedFilters}
          >
            Categories
          </Options>
          <Options
            onShow={() => toggleFilters("Price")}
            contents={["Free", "0 - 500", "501 - 2000", "Above 2000"]}
            expanded={openFilter === "Price"}
            setSelectedFilters={setSelectedFilters}
          >
            Price
          </Options>
        </section>
        <section>
          <h3>Events will appear here</h3>
          {!loading && events.length == 0 && <p>No events found</p>}
          {events.length > 0 && (
            <ul>
              {events.map((event, idx) => {
                return (
                  <Suspense fallback={<p>Loading...</p>} key={event._id}>
                    <MovieCards movie={event} />
                  </Suspense>
                );
              })}
            </ul>
          )}

          {errors && <p>{errors}</p>}
        </section>
      </main>
    </div>
  );
}

export default EventsExplore;
