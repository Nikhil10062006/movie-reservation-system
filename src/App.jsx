import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MovieReservation from "./Components/movieReservation.jsx";
import Signup from "./Components/signup.jsx";
import Home from "./Components/home.jsx";
import MoviesExplore from "./Components/moviesExplore.jsx";
import FilterProvider from "./contexts/filterContexts.jsx";
import Location from "./Components/location.jsx";
import EventsExplore from "./Components/eventsExplore.jsx";
import ActivitiesExplore from "./Components/activitiesExplore.jsx"
import PlaysExplore from "./Components/playsExplore.jsx"
import SportsExplore from "./Components/sportsExplore.jsx";
import StreamsExplore from "./Components/streamsExplore.jsx"
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
          <Route path="/activities-explore" element={<ActivitiesExplore/>} />
          <Route path="/streams-explore" element={<StreamsExplore/>} />
          <Route path="/plays-explore" element={<PlaysExplore/>} />
          <Route path="/sports-explore" element={<SportsExplore/>} />

          <Route path="/location" element={<Location />} />
        </Routes>
      </FilterProvider>
    </BrowserRouter>
  );
}

export default App;
