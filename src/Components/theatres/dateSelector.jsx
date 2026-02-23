import {useState } from "react";
function DateSelector(){
    return (
        <>
        <label htmlFor="movieDates">Select the Dates</label>
        <input type="date" id="movie-dates"/>
        </>
    )

}
export default DateSelector;