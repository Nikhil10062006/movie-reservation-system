import { useState, useEffect, lazy, Suspense,useCallback } from "react";
import Options from "./options.jsx";
import getMovies from "../services/movieService.jsx";
import { useFilters } from "../contexts/filterContexts.jsx";

const Navbar = lazy(() => import("./navbar.jsx"));
const MovieCards = lazy(() => import("./movieCards.jsx"));

function ActivitiesExplore() {
  const { selectedFilters, setSelectedFilters } = useFilters();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
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
          if (!res || !res.data || !Array.isArray(res.data.data)) {
            setErrors("No response received from the server");
            setLoading(true);
            return;
          }

          const activitiesList = res.data.data;
          const validatedActivities = [];

          for (const activity of activitiesList) {
            if (
              activity &&
              typeof activity._id === "string" &&
              typeof activity.title === "string" &&
              typeof activity.location === "string" &&
              typeof activity.thumbnail === "string" &&
              typeof activity.price === "string"
            ) {
              validatedActivities.push({
                ...activity,
                thumbnail: activity.thumbnail || "default.png",
                title: activity.title || "Untitled",
              });
            }

            if (validatedActivities.length === 0 && activitiesList.length > 0) {
              setErrors("Coorupted Data received from the server");
              setLoading(false);
              return;
            }

            setActivities((prev) => {
              if (
                JSON.stringify(prev) === JSON.stringify(validatedActivities)
              ) {
                return prev;
              }
              return validatedActivities;
            });
          }
        })
        .catch((err) => {
          setLoading(false);

          if (!err.response) {
            setErrors("Network Error");
            return;
          }

          const message = err.response.data?.message || "Something went wrong";
          const statusCode = err.response.statusCode;

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
          <h4>Activities will appear here</h4>
          {errors && <p>{errors}</p>}
          {!loading && activities.length === 0 && <p>No movies found</p>}
          {activities.length > 0 && (
            <ul>
              {activities.map((activity) => {
                return (
                  <Suspense key={activity._id} fallback={<p>Loading ... </p>}>
                    <MovieCards movie={activity} />
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

export default ActivitiesExplore;
