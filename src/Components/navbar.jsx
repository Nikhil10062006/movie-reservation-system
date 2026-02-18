import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import Button from "./button.jsx";
function Navbar() {
  const navigate=useNavigate();
  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Search for Movies,Events,Plays,Sports and Activities"
        />
        <Button onClick={() => navigate('/select-location')}>Location</Button>
        <Button>Profile</Button>
        <Button onClick={() => navigate('/signup')}>Signup</Button>
      </div>
      <div>
        <Button onClick={() => navigate('/movies-explore')}>Movies</Button>
        <Button onClick={() => navigate('/streams-explore')}>Stream</Button>
        <Button onClick={() => navigate('/events-explore')}>Events</Button>
        <Button onClick={() => navigate('/plays-explore')}>Plays</Button>
        <Button onClick={() => navigate('/sports-explore')}>Sports</Button>
        <Button onClick={() => navigate('/activities-explore')}>Activities</Button>
        <Button onClick={() => navigate('/list-your-events')}>ListYourShow</Button>
        <Button onClick={() => navigate('/corporates')}>Corporates</Button>
        <Button onClick={() => navigate('/offers')}>Offers</Button>
        <Button onClick={() => navigate('/gift-cards')}>Gift Cards</Button>
      </div>
    </>
  );
}

export default Navbar;
