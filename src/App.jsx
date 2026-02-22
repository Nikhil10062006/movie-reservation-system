import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MovieReservation from "./pages/movieReservation.jsx";
import Signup from "./pages/signup.jsx";
import Home from "./pages/home.jsx";
import MoviesExplore from "./pages/moviesExplore.jsx";
import FilterProvider from "./contexts/filterContexts.jsx";
import EventsExplore from "./pages/eventsExplore.jsx";
import ActivitiesExplore from "./pages/activitiesExplore.jsx";
import PlaysExplore from "./pages/playsExplore.jsx";
import SportsExplore from "./pages/sportsExplore.jsx";
import StreamsExplore from "./pages/streamsExplore.jsx";
import MoviesIndividual from "./pages/moviesIndividual.jsx";
function App() {
  return (
    <BrowserRouter>
      <FilterProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservation" element={<MovieReservation />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/movies-explore" element={<MoviesExplore />} />
          <Route path="/events-explore" element={<EventsExplore />} />
          <Route path="/activities-explore" element={<ActivitiesExplore />} />
          <Route path="/streams-explore" element={<StreamsExplore />} />
          <Route path="/plays-explore" element={<PlaysExplore />} />
          <Route path="/sports-explore" element={<SportsExplore />} />
          <Route path="/movies/:id" element={<MoviesIndividual />} />

          <Route path="/location" element={<Location />} />
        </Routes>
      </FilterProvider>
    </BrowserRouter>
  );
}

export default App;
