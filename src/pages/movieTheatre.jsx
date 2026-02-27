import { useState, lazy, Suspense, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import getTheatreDetails from "../services/movieTheatreService.jsx";
import normalizeTheatreDetails from "../utils/normalizeTheatreDetails.jsx";
import TheatreFilters from "../components/theatres/thatreFilters.jsx";
import TheatreList from "../components/theatres/theatreList.jsx";
import DateSelector from "../components/theatres/dateSelector.jsx";
import MovieSummary from "../components/theatres/movieSummary.jsx";
import useTheatreSEO from "../hooks/useTheatreSEO.jsx";
import filterTheatres from "../utils/filterTheatres.jsx";

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

  const filteredTheatres = useMemo(() => {
    return filterTheatres(theatres, selectedFilters, debouncedSearch);
  }, [theatres, selectedFilters, debouncedSearch]);

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

  useTheatreSEO(id);

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
            <TheatreList theatres={filteredTheatres} />
          </>
        )}
        <button
          onClick={() => {
            setSelectedFilters({
              date: "",
              price: "",
              format: "",
              time: "",
              sortby: "",
              search: "",
            });
          }}
        >
          Reset Filters
        </button>
      </main>
    </>
  );
}
export default MovieTheatre;
