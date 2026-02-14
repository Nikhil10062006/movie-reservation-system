import { useState } from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import MovieReservation from "./Components/movieReservation.jsx";
import Signup from "./Components/signup.jsx";
import Home from "./Components/home.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservation" element={<MovieReservation />} />
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
