import { useState, lazy, Suspense, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import getTheatreDetails from "../services/movieTheatreService.jsx";
import normalizeTheatreDetails from "../utils/normalizeTheatreDetails.jsx";
import TheatreFilters from "../components/theatres/thatreFilters.jsx";
import TheatreList from "../components/theatres/theatreList.jsx";
import DateSelector from "../components/theatres/dateSelector.jsx";
import MovieSummary from "../components/theatres/movieSummary.jsx";

const Navbar = lazy(() => import("../components/navbar.jsx"));

function MovieTheatre() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    date: "",
    price: "",
    format: "",
    time: "",
    sortby: "",
    search: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const filterTheatres = useMemo(() => {
    if (!theatres.length) return [];

    let updatedTheatres = [...theatres];
    if (debouncedSearch.trim() !== "") {
      const searchLower = debouncedSearch.toLowerCase();
      updatedTheatres = updatedTheatres.filter((theatre) =>
        theatre.name.toLowerCase().includes(searchLower),
      );
    }

    return updatedTheatres
      .map((theatre) => {
        let filteredShows = [...theatre.shows];

        if (selectedFilters.price) {
          const [min, max] = selectedFilters.price
            .split("-")
            .map((num) => Number(num.trim()));

          filteredShows = filteredShows.filter(
            (show) => show.price >= min && show.price <= max,
          );
        }

        if (selectedFilters.time) {
          filteredShows = filteredShows.filter((show) => {
            const date = new Date(`1970-01-01 ${show.time}`);
            const hour = date.getHours();

            if (selectedFilters.time === "Morning")
              return hour >= 0 && hour < 12;
            else if (selectedFilters.time === "Afternoon")
              return hour >= 12 && hour < 16;
            else if (selectedFilters.time === "Evening")
              return hour >= 16 && hour < 19;
            else if (selectedFilters.time === "Night")
              return hour >= 19 && hour < 24;

            return true;
          });
        }

        return {
          ...theatre,
          shows: filteredShows,
        };
      })
      .filter((theatre) => theatre.shows.length > 0);
  }, [theatres, selectedFilters,debouncedSearch]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErrors(null);
    getTheatreDetails(id, controller.signal)
      .then((res) => {
        setLoading(false);
        if (!res?.data?.data) {
          setErrors("No response received");
          return;
        }

        const validatedtheatreList = res.data.data
          .map(normalizeTheatreDetails)
          .filter(Boolean);
        if (validatedtheatreList.length === 0) {
          setErrors("Invalid format");
          return;
        }
        setTheatres(validatedtheatreList);
      })
      .catch((err) => {
        setLoading(false);
        const dummyTheatres = [
          {
            theatreId: "101",
            name: "PVR Phoenix",
            shows: [
              { showId: "1001", time: "10:00 AM", price: 250 },
              { showId: "1002", time: "1:30 PM", price: 300 },
            ],
          },
          {
            theatreId: "102",
            name: "INOX Marina",
            shows: [{ showId: "1003", time: "11:00 AM", price: 220 }],
          },
        ];
        setTheatres(dummyTheatres);

        if (!err.response) {
          setErrors("Network Error");
          return;
        }

        const message = err.response.data.message || "Something went wrong";
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
    const timeOutid = setTimeout(() => {
      setDebouncedSearch(selectedFilters.search);
    }, 300);
    return () => {
      clearTimeout(timeOutid);
    };
  }, [selectedFilters.search]);

  if (loading) {
    return <p>Loading...</p>;
  }

  // if (errors) {
  //   return <p>{errors}</p>;
  // }

  return (
    <>
      <header>
        <Suspense fallback={<p>Loading ... </p>}>
          <Navbar />
        </Suspense>
      </header>
      <main>
        {theatres.length > 0 && (
          <>
            <MovieSummary />
            <DateSelector
              setSelectedFilters={setSelectedFilters}
              selectedFilters={selectedFilters}
            />
            <TheatreFilters
              setSelectedFilters={setSelectedFilters}
              selectedFilters={selectedFilters}
            />
            <TheatreList theatres={filterTheatres} />
          </>
        )}
      </main>
    </>
  );
}
export default MovieTheatre;
