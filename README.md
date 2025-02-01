# Cinema Web Application
---


## Team Members

**Abdullah Faisal AlFehaid**

**Faisal Youssef AlSogairy**

**Faisal Abdulrahman Alhassoun**

**Abdullah Abdulrahman AlWhaiby**

---

## Overview

**Cinema** is a full-stack web application for booking movies. It allows users to sign up, log in, browse movies, and reserve seats. Admins can add new movies. The app showcases a Node.js/Express backend, MongoDB data storage, EJS-based server-side views, and minimal vanilla JavaScript on the client side.

### Features

1. **User Authentication**  
    - Sign up and login system for secure user sessions.
2. **Admin Management**  
    - Admin user auto-created on first run (`admin@admin.com` / `admin123`).
    - Admin can add new movies.
3. **Movie Listings**  
    - View a list of available movies, with details and posters.
4. **Booking System**  
    - Users can select a seat, pick a date, and book a movie.
    - Users can see their bookings and delete them if needed.
5. **RESTful API + EJS**  
    - REST API routes return JSON.
    - EJS templates render user-facing pages (login, signup, booking form, etc.).
6. **Sessions**  
    - Uses `express-session` for authentication.

---

## Technologies Used

- **Node.js / Express.js** for server logic and routing.
- **MongoDB** with **Mongoose** for database operations.
- **EJS** for server-side templating.
- **Bootstrap** for responsive styling.
- **dotenv** for environment variable management.
- **ES6** JavaScript for cleaner syntax.

---

## Project Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/FAHOO20/cinema.git
    cd cinema
    ```
2. **Install dependencies**:
    ```bash
    npm install
    ```
3. **Set up MongoDB**:
    - Ensure MongoDB is installed and running locally (or have a remote MongoDB connection string).

4. **Configure environment variables** (optional):
    - Create a `.env` file (same level as `app.js`) and set your MongoDB URI:
      ```bash
      MONGO_URI=mongodb://127.0.0.1:27017/cinema
      ```
    - If you do **not** include `MONGO_URI` in your `.env`, you can manually change the `mongoose.connect()` call in `app.js` to the correct connection string.

*(**Note**: If `SESSION_SECRET` is not provided, the application will default to `"mysecretkey"`.)*

---

## Running the Application

1. **Start the server**:
    ```bash
    npm start
    ```
    By default, nodemon will watch your source files and automatically restart on changes. The app listens on [http://localhost:5000](http://localhost:5000).

2. **Admin Credentials**:
    - The project seeds an admin user with email `admin@admin.com` and password `admin123`.

3. **Visit the main pages**:
    - **Home**: [http://localhost:5000/](http://localhost:5000/)
    - **Movies**: [http://localhost:5000/movies](http://localhost:5000/movies)
    - **Sign Up**: [http://localhost:5000/signup](http://localhost:5000/signup)
    - **Login**: [http://localhost:5000/login](http://localhost:5000/login)
    - **New Movie** (Admin only): [http://localhost:5000/new-movie](http://localhost:5000/new-movie)

---

## Screenshots

1. **Home Page**  
![Image](https://github.com/user-attachments/assets/12c51ad6-7c55-4c1d-b9a9-6cdb7207775c)

3. **Add Movie**
   ![Image](https://github.com/user-attachments/assets/d2be2030-93f7-4be5-91d4-b68621579608)

3. **Booking**
![Image](https://github.com/user-attachments/assets/4ca86861-22a2-42a1-8e34-985904b2cff2)
   
4. **My Bookings**
![Image](https://github.com/user-attachments/assets/0c5edf6d-8508-40dc-808f-465bdf5a3935)

---


## Future Improvements

- Add an admin dashboard for managing all bookings and users.
- Implement seat availability checks (disable or mark seats already taken).
- Enhance UI/UX design (animations, better seat layout, etc.).
- Deploy to a cloud platform (e.g., Heroku, Railway, or Docker-based hosting).

---

## Resources

- **Node.js Docs**: [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)
- **Express.js Docs**: [https://expressjs.com/](https://expressjs.com/)
- **MongoDB Docs**: [https://docs.mongodb.com/](https://docs.mongodb.com/)
- **Mongoose Docs**: [https://mongoosejs.com/](https://mongoosejs.com/)
- **EJS**: [https://ejs.co/](https://ejs.co/)
- **Bootstrap**: [https://getbootstrap.com/](https://getbootstrap.com/)

---

**Enjoy the cinema booking experience!**
