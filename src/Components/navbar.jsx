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
        <Button>Location</Button>
        <Button>Profile</Button>
        <Button onClick={() => navigate('/signup')}>Signup</Button>
      </div>
      <div>
        <Button>Movies</Button>
        <Button>Stream</Button>
        <Button>Events</Button>
        <Button>Plays</Button>
        <Button>Sports</Button>
        <Button>Activities</Button>
        <Button>ListYourShow</Button>
        <Button>Corporates</Button>
        <Button>Offers</Button>
        <Button>Gift Cards</Button>
      </div>
    </>
  );
}

export default Navbar;
