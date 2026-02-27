import TheatreCards from "./theatreCards";
function TheatreList({ theatres }) {
  return (
    <ul>
      {theatres.map((theatre) => {
        return <TheatreCards theatre={theatre} key={theatre.theatreId}/>;
      })}
    </ul>
  );
}
export default TheatreList;
