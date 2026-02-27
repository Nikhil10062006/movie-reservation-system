function filterTheatres(theatres, selectedFilters, debouncedSearch) {
  if (!theatres.length) return [];

  let updatedTheatres = [...theatres];
  if (debouncedSearch.trim() !== "") {
    const searchLower = debouncedSearch.toLowerCase();
    updatedTheatres = updatedTheatres.filter((theatre) =>
      theatre.name.toLowerCase().includes(searchLower),
    );
  }

  return updatedTheatres
    .map((theatre) => {
      let filteredShows = [...theatre.shows];

      if (selectedFilters.price) {
        const [min, max] = selectedFilters.price
          .split("-")
          .map((num) => Number(num.trim()));

        filteredShows = filteredShows.filter(
          (show) => show.price >= min && show.price <= max,
        );
      }

      if (selectedFilters.time) {
        filteredShows = filteredShows.filter((show) => {
          const date = new Date(`1970-01-01 ${show.time}`);
          const hour = date.getHours();

          if (selectedFilters.time === "Morning") return hour >= 0 && hour < 12;
          else if (selectedFilters.time === "Afternoon")
            return hour >= 12 && hour < 16;
          else if (selectedFilters.time === "Evening")
            return hour >= 16 && hour < 19;
          else if (selectedFilters.time === "Night")
            return hour >= 19 && hour < 24;

          return true;
        });
      }

      return {
        ...theatre,
        shows: filteredShows,
      };
    })
    .filter((theatre) => theatre.shows.length > 0);
}

export default filterTheatres;
