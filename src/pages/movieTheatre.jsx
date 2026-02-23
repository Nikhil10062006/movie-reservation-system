import { useState, lazy, Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import getTheatreDetails from "../services/movieTheatreService.jsx";
import normalizeTheatreDetails from "../utils/normalizeTheatreDetails.jsx";
import TheatreFilters from "../components/theatres/thatreFilters.jsx";
import TheatreList from "../components/theatres/theatreList.jsx";
import DateSelector from "../components/theatres/dateSelector.jsx";
import MovieSummary from "../components/theatres/movieSummary.jsx";

const Navbar = lazy(() => import("../components/navbar.jsx"));
const TheatreCards = lazy(
  () => import("../components/theatres/theatreCards.jsx"),
);

function MovieTheatre() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [theatres, setTheatres] = useState([]);

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
          setErrors("Invalid fromat");
          return;
        }
        setTheatres(validatedtheatreList);
      })
      .catch((err) => {
        setLoading(false);

        if (!err.response) {
          setErrors("Network Error");
          return;
        }

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
            }
          ]
        setTheatres(dummyTheatres);

        const message = err.response.data.message || "Something went wrong";
        const statusCode = err.response.status;

        if ([400, 409, 500, 503, 422].includes(statusCode)) {
          setErrors(message);
        } else {
          setErrors("Unexpected Error Occured");
        }
      });

    return () => {
      controller.abort();
    };
  }, [id]);

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
            <DateSelector />
            <TheatreFilters />
            <TheatreList theatres={theatres} />
          </>
        )}
      </main>
    </>
  );
}
export default MovieTheatre;
