import { memo } from "react";
const TheatreFilters = memo(function TheatreFilters({
  selectedFilters,
  setSelectedFilters,
}) {
  function handlleFilterschange(e) {
    const { name, value } = e.target;
    setSelectedFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  return (
    <>
      <label htmlFor="price">
        Price Range{" "}
        <select
          id="price"
          name="price"
          value={selectedFilters.price}
          onChange={handlleFilterschange}
        >
          <option value="0-100">0 - 100</option>
          <option value="100-200">100 - 200</option>
          <option value="200-300">200 - 300</option>
          <option value="300-400">300 - 400</option>
        </select>
      </label>
      <label htmlFor="format">
        Special format{" "}
        <select
          id="format"
          name="format"
          value={selectedFilters.format}
          onChange={handlleFilterschange}
        >
          <option value="dolby-atomos">Dolby Atomos</option>
        </select>
      </label>
      <label htmlFor="timing">
        Preffered Time{" "}
        <select
          id="timing"
          name="time"
          value={selectedFilters.time}
          onChange={handlleFilterschange}
        >
          <option value="Morning">Morning 12:00 a.m. - 11:59 a.m.</option>
          <option value="Afternoon">AfterNoon 12:00 p.m. - 3:59 p.m.</option>
          <option value="Evening">Evening 4:00 p.m. - 6:59 p.m.</option>
          <option value="Night">Night 7:00 p.m. - 11:59 p.m.</option>
        </select>
      </label>
      <label htmlFor="sortby">
        Sort By{" "}
        <select
          id="sortby"
          name="sortby"
          value={selectedFilters.sortby}
          onChange={handlleFilterschange}
        >
          <option value="Relevance">Relevance</option>
          <option value="Popularity">Popularity</option>
          <option value="Distance">Distance</option>
        </select>
      </label>

      <input
        type="text"
        placeholder="Enter the cinema name or area"
        name="search"
        value={selectedFilters.search}
        onChange={handlleFilterschange}
      />
    </>
  );
});
export default TheatreFilters;
