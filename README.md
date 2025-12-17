Movie Reservation System

A simple React-based movie seat reservation system that allows users to select available seats and confirm bookings.
The project focuses on implementing the core seat reservation logic with persistence using browser storage(Temporary).

🚧 Project Status: Prototype Phase — Core booking logic implemented. UI enhancements and backend integration planned and are to be implemented in the upcoming days .

Features Implemented:

* Display total and available seats
* Select and deselect seats dynamically
* Prevent selection of already reserved seats
* Confirm seat reservations
* Persist reserved seats using browser LocalStorage
* Simple grid-based seat layout

Tech Stack:
* Frontend: React.js
* Storage: Browser LocalStorage
* Styling: Inline CSS (prototype)

How to Run:

1.Clone the repository:

git clone https://github.com/Nikhil10062006/movie-reservation-system
cd movie-reservation-system


2.Install dependencies:

npm install
# or
yarn install


3.Start the development server:

npm run dev
# or
yarn dev


4.Open your browser at http://localhost:5173 (Vite default)

5.Select available seats and confirm the reservation.

Project Logic Overview:

*Seats are generated dynamically based on a fixed total count.
*Reserved seats are stored in LocalStorage to prevent double booking.
*Selected seats are merged into reserved seats upon confirmation.
*UI updates automatically based on seat status.

Roadmap / Future Improvements:

User Authentication & Authorization:
* Implement user signup and login functionality
* Introduce role-based access control (Admin and Regular User)
* Restrict movie and showtime management features to Admin users

Movie & Showtime Management:
* Allow Admins to add, update, and delete movies
* Store movie details such as title, description, poster image, and genre
* Add support for multiple showtimes per movie
* Implement scheduling and management of showtimes
  
Reservation Management
* Allow users to view movies and available showtimes for a selected date
* Display real-time seat availability for each showtime
* Enable users to view their reservations and cancel upcoming bookings
* Provide Admins with access to all reservations, seating capacity, and revenue data

Backend & Data Persistence
* Replace LocalStorage with a backend and database for persistent storage
* Design proper data models and relationships between users, movies, showtimes, and reservations
* Implement mechanisms to prevent overbooking in concurrent reservation scenarios

Reporting & Analytics
* Add basic reporting  Admins (total bookings, occupancy, revenue)
* Generate summaries for movies and

UI & UX Improvements
* Improve seat layout visualization
* Enhance UI with better styling and animations
* Add user-friendly error handling and confirmations


Notes:

This is a minimum viable product (MVP) to demonstrate core functionality of the website.

The project is actively under development; additional features and UI improvements will be done in the upcoming days .
