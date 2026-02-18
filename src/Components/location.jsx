import { useState } from "react";

function Location() {
  return (
    <div>
      <input type="text" placeholder="Enter the city" />
      <button></button>
      {navigator.geolocation && navigator.geolocation.coordinates}
    </div>
  );
}
export default Location;
