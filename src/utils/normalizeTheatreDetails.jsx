function normalizeTheatreDetails(theatre) {
  // Basic validation
  if (
    !theatre ||
    typeof theatre !== "object" ||
    typeof theatre.id !== "string" ||
    typeof theatre.name !== "string"
  ) {
    return null;
  }

  return {
    id: theatre.id,
    name: theatre.name,

    shows: Array.isArray(theatre.shows)
      ? theatre.shows
          .filter(
            (show) =>
              show &&
              typeof show.showId === "string" &&
              typeof show.time === "string" &&
              typeof show.price === "number",
          )
          .map((show) => ({
            showId: show.showId,
            time: show.time,
            price: show.price,
          }))
      : [],
  };
}

export default normalizeTheatreDetails;
