import { useState } from "react";
function DateSelector({ selectedFilters, setSelectedFilters }) {
  function handleDateChange(e) {
    const { name, value } = e.target;
    setSelectedFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  return (
    <div>
      <label htmlFor="movieDates">Select the Dates</label>
      <input
        type="date"
        id="movieDates"
        name="date"
        value={selectedFilters.date}
        onChange={handleDateChange}
      />
    </div>
  );
}
export default DateSelector;
