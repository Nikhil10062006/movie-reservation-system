import { useState, useEffect } from "react";

const TOTAL_SEATS = 20;

function MovieReservation() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState(
    JSON.parse(localStorage.getItem("reservedSeats")) || []
  );

  useEffect(() => {
    localStorage.setItem("reservedSeats", JSON.stringify(reservedSeats));
  }, [reservedSeats]);

  const toggleSeat = (seatNumber) => {
    if (reservedSeats.includes(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const confirmReservation = () => {
    setReservedSeats([...reservedSeats, ...selectedSeats]);
    setSelectedSeats([]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2> Movie Reservation System</h2>
      <p>Total Seats: {TOTAL_SEATS}</p>
      <p>Available Seats: {TOTAL_SEATS - reservedSeats.length}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 60px)",
          gap: "10px",
        }}
      >
        {Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1).map((seat) => {
          const isReserved = reservedSeats.includes(seat);
          const isSelected = selectedSeats.includes(seat);

          return (
            <button
              key={seat}
              onClick={() => toggleSeat(seat)}
              disabled={isReserved}
              style={{
                padding: "10px",
                backgroundColor: isReserved
                  ? "#888"
                  : isSelected
                  ? "#4caf50"
                  : "#ddd",
                cursor: isReserved ? "not-allowed" : "pointer",
              }}
            >
              {seat}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "20px" }}>
        <p>Selected Seats: {selectedSeats.join(", ") || "None"}</p>
        <button
          onClick={confirmReservation}
          disabled={selectedSeats.length === 0}
        >
          Confirm Reservation
        </button>
      </div>
    </div>
  );
}

export default MovieReservation;
