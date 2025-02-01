// public/js/seatSelection.js
document.addEventListener("DOMContentLoaded", () => {
  const seats = document.querySelectorAll(".seat");
  const seatNumberInput = document.getElementById("seatNumberInput");

  seats.forEach((seat) => {
    seat.addEventListener("click", () => {
      // If seat is 'booked', ignore.
      if (seat.classList.contains("booked")) return;

      // Unselect any other seat that was previously selected
      document.querySelectorAll(".seat.selected").forEach((s) => {
        s.classList.remove("selected");
      });

      // Mark this seat as selected
      seat.classList.add("selected");

      // Put seat ID in hidden input
      seatNumberInput.value = seat.getAttribute("data-seat");
      console.log("Seat chosen:", seatNumberInput.value);
    });
  });
});
