import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import getMovies from "../services/movieService.jsx";
import { useFilters } from "../contexts/filterContexts.jsx";
import Options from "./options.jsx";

const Navbar = lazy(() => import("./navbar.jsx"));
const MovieCards = lazy(() => import("./movieCards.jsx"));

function StreamsExplore() {
  const { selectedFilters, setSelectedFilters } = useFilters();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streams, setStreams] = useState([]);
  const [openFilter, setOpenFilter] = useState(null);

  const toggleFilters = useCallback((prevFilter) => {
    setOpenFilter((prev) => {
       return prev === prevFilter ? null : prevFilter;
    });
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

          const streamsList = res.data.data;
          const validatedStreams = [];

          for (const streams of streamsList) {
            if (
              streams &&
              typeof streams.title === "string" &&
              typeof streams.thumbnail === "string"
            ) {
              validatedStreams.push({
                ...streams,
                thumbnail: streams.thumbnail || "default.png",
                title: streams.title || "Untitled",
              });
            }
          }

          if (validatedStreams.length === 0 && streamsList.length > 0) {
            setErrors("Corrupted data received from the server");
            return;
          }

          setStreams((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(validatedStreams)) {
              return prev;
            }
            return validatedStreams;
          });
        })
        .catch((err) => {
          setLoading(false);
          if (err.name === "CanceledError" || err.name === "AbortError") {
            return;
          }

          if (!err.response) {
            setErrors("No response received from the server");
            return;
          }

          const message = err.response.data?.message || "Something went wrong";
          const statusCode = err.response.status;

          if ([400, 409, 500, 503, 422].includes(statusCode)) {
            setErrors(message);
          } else {
            setErrors("Unexpected Error occured");
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
        <Suspense fallback={<p>Loading ... </p>}>
          <Navbar />
        </Suspense>
      </header>
      <main>
        <aside>Advertisements</aside>
        <section>
          <h3>Filters</h3>
          <Options
            contents={["English", "Hindi", "Malayalam", "Tamil", "Telegu"]}
            onShow={() => toggleFilters("Languages")}
            expanded={openFilter === "Languages"}
            setSelectedFilters={setSelectedFilters}
          >
            Languages
          </Options>
          <Options
            contents={[
              "Action",
              "Horror",
              "Mystery",
              "Psychological",
              "Thrill",
              "Adventure",
              "Romance",
            ]}
            onShow={() => toggleFilters("Genre")}
            expanded={openFilter === "Genre"}
            setSelectedFilters={setSelectedFilters}
          >
            Genre
          </Options>
        </section>
        <section>
          <h3>Streams will appear here</h3>
          {errors && <p>{errors}</p>}
          {!loading && streams.length === 0 && <p>No streams found</p>}
          {streams.length > 0 && (
            <ul>
              {streams.map((stream) => {
                return (
                  <Suspense fallback={<p>loading...</p>} key={stream._id}>
                    <MovieCards movie={stream} />
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

export default StreamsExplore;
