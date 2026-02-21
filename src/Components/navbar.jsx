import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
function Navbar() {
  const navigate=useNavigate();
  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Search for Movies,Events,Plays,Sports and Activities"
        />
        <button onClick={() => navigate('/select-location')}>Location</button>
        <button>Profile</button>
        <button onClick={() => navigate('/signup')}>Signup</button>
      </div>
      <div>
        <button onClick={() => navigate('/movies-explore')}>Movies</button>
        <button onClick={() => navigate('/streams-explore')}>Stream</button>
        <button onClick={() => navigate('/events-explore')}>Events</button>
        <button onClick={() => navigate('/plays-explore')}>Plays</button>
        <button onClick={() => navigate('/sports-explore')}>Sports</button>
        <button onClick={() => navigate('/activities-explore')}>Activities</button>
        <button onClick={() => navigate('/list-your-events')}>ListYourShow</button>
        <button onClick={() => navigate('/corporates')}>Corporates</button>
        <button onClick={() => navigate('/offers')}>Offers</button>
        <button onClick={() => navigate('/gift-cards')}>Gift Cards</button>
      </div>
    </>
  );
}

export default Navbar;
