import { useState, lazy, Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import getTheatreDetails from "../services/movieTheatreService.jsx";
import normalizeTheatreDetails from "../utils/normalizeTheatreDetails.jsx";
const Navbar = lazy(() => import("../components/navbar.jsx"));

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

  return (
    <>
      <header>
        <Suspense fallback={<p>Loading ... </p>}>
          <Navbar />
        </Suspense>
      </header>
      <main>
        
      </main>
    </>
  );
}
export default MovieTheatre;
