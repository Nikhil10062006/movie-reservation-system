import { memo,useMemo } from "react";
const DateSelector = memo(function DateSelector({
  selectedFilters,
  setSelectedFilters,
}) {
  function handleDateChange(e) {
    const { name, value } = e.target;
    setSelectedFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();
    const min = today.toISOString().split("T")[0];

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 6);
    const max = nextWeek.toISOString().split("T")[0];

    return {minDate:min,maxDate:max};
  },[]);
  return (
    <div>
      <label htmlFor="movieDates">Select the Dates</label>
      <input
        type="date"
        id="movieDates"
        name="date"
        value={selectedFilters.date}
        onChange={handleDateChange}
        min={minDate}
        max={maxDate}
      />
    </div>
  );
});
export default DateSelector;
