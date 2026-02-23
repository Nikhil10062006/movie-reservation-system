import { useState } from "react";
function TheatreFilters() {
  return (
    <>
      <label htmlFor="price">Price Range</label>
      <label htmlFor="format">Special format</label>
      <label htmlFor="timing">Preffered Time</label>
      <label htmlFor="sort">Sort By</label>
      <select id="price" name="price">
        <option value="0-100">0 - 100</option>
        <option value="0-100">100 - 200</option>
        <option value="0-100">200 - 300</option>
        <option value="0-100">300 - 400</option>
      </select>
      <select id="format" name="format">
        <option value="dolby-atomos">Dolby Atomos</option>
      </select>
      <select id="timing" name="timing">
        <option value="Morning">Morning 12:00 a.m. - 11:59 a.m.</option>
        <option value="AfterNoon">AfterNoon 12:00 p.m. - 3:59 p.m.</option>
        <option value="Evening">Evening 4:00 p.m. - 6:59 p.m.</option>
        <option value="Night">Night 7:00 p.m. - 11:59 p.m.</option>
      </select>
      <select id="sort" name="sort">
        <option value="Relevance">Relevance</option>
        <option value="Popularity">Popularity</option>
        <option value="Distance">Distance</option>
      </select>
      <input type="text" placeholder="Enter the cinema name or area" />
    </>
  );
}
export default TheatreFilters;
