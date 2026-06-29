
Amazon Clone | Full-Stack MERN E-Commerce Platform

A full-stack Amazon-inspired e-commerce platform built using the MERN Stack (MongoDB, Express.js, React.js, Node.js). 
This application provides a complete online shopping experience with secure authentication, shopping cart management, 
order processing, inventory management, and an admin dashboard.

The project demonstrates full-stack web development concepts including REST APIs, 
JWT authentication, role-based authorization, Redux state management, MongoDB transactions, and responsive UI design.

Live Demo 
https://amazon-clone-rho-ebon.vercel.app

Demo Admin Account

Email: shainaagarwal333@gmail.com
Password: Admin@123

1)Features

1.1) Customer Features

* User Registration & Login
* JWT Authentication
* Secure Password Encryption using bcrypt
* Browse Products using Search Bar
* Product Categories
* Filtering based on Ratings
* Filtering based on Categories
* Filtering based on Price Range
* Filtering based on Availability 
* Sorting based on Price Low to High
* Sorting based on Price High to Low
* Sorting based on Highest Rated
* Product Ratings
* Shopping Cart
* Update Cart Quantity
* Remove Products from Cart
* Checkout Process
* Save Shipping Address and Billing Address
* User Profile Management
* Order History
* View Individual Orders
* Responsive User Interface
* View Product Details with Pagination support


1.2) Admin Features

* Secure Admin Dashboard
* Add New Products
* Manage Product Inventory
* View Registered Users
* View Customer Orders
* Product Stock Management
* Role-Based Access Control
* Reduce in stock can be seen after placing order


1.3) Product Management

* Product Catalog
* Product Images
* Categories
* Ratings
* Price Management
* Stock Tracking
* Pagination Support


1.4) Order Management

* Place Orders
* Multiple Products per Order
* Shipping Address Storage
* Payment Status
* Order History
* Automatic Stock Reduction
* MongoDB Transactions


1.5) Security Features

* JWT Authentication
* Protected Routes
* Admin Authorization
* Password Hashing (bcrypt)
* Input Validation (Express Validator)
* Rate Limiting



2)Tech Stack

2.1) Frontend

* React 19
* Vite
* Redux Toolkit
* React Redux
* React Router DOM
* Axios
* CSS3


2.2) Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (jsonwebtoken)
* bcryptjs
* Express Validator
* Express Rate Limit
* dotenv


3) Installation

3.1) Clone the Repository

git clone https://github.com/ShainaAgarwal/Amazon-clone.git


3.2)Install Backend Dependencies

 cd backend
 npm install


3.3) Install Frontend Dependencies

cd frontend
npm install



4)Running the Project

4.1) Start Backend

npm start


4.2) Start Frontend

npm run dev



5) Environment Variables

Create a .env file inside the backend folder.

env
PORT=5003

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key



6) Screenshots

6.1) Home Page
<img width="1439" height="791" alt="image" src="https://github.com/user-attachments/assets/da22bd01-e9d8-4bd4-8e1c-0435b298ea9f" />



6.2) Login Page
<img width="614" height="639" alt="image" src="https://github.com/user-attachments/assets/e5c8a0bb-e3ee-4c6f-b44d-b53878a53f79" />





6.3) Registration Page
<img width="760" height="689" alt="image" src="https://github.com/user-attachments/assets/930d7eb3-3aa6-40c7-a6ee-8c095c2866ee" />





6.4) Shopping Cart
<img width="1440" height="592" alt="image" src="https://github.com/user-attachments/assets/a1a03d00-df55-4100-b8ce-ed42b2b4ed3c" />



6.5) Checkout
<img width="1440" height="798" alt="image" src="https://github.com/user-attachments/assets/53dfcf1e-feeb-47d3-8b24-b0547a2ba4f9" />

<img width="1440" height="808" alt="image" src="https://github.com/user-attachments/assets/1900dab5-8e62-461e-9d79-6829ba642b75" />



6.6) User Profile
<img width="1439" height="810" alt="image" src="https://github.com/user-attachments/assets/d40f6460-08f0-4e30-92f7-995b8cd87ee9" />



6.7) Order History
<img width="1440" height="614" alt="image" src="https://github.com/user-attachments/assets/3f6442c9-f2fe-489b-b2fb-4c88465a6028" />



6.8) Admin Dashboard
<img width="1440" height="812" alt="image" src="https://github.com/user-attachments/assets/79b58dd1-b0ce-426c-b4bc-4ed9d046379d" />

<img width="1440" height="812" alt="image" src="https://github.com/user-attachments/assets/bfd438cf-f8e2-4a3b-a709-da644bf4bac9" />



6.9) Product Management
Before placing order( iphone 15 stock = 14)
<img width="1440" height="612" alt="image" src="https://github.com/user-attachments/assets/b3f5f336-8eed-45a7-9630-77422040936d" />

After placing order( iphone 15 stock = 13)
<img width="1415" height="481" alt="image" src="https://github.com/user-attachments/assets/2843cb3f-e063-4505-8dab-1c92a2551859" />



6.10) Inventory Management
<img width="1421" height="410" alt="image" src="https://github.com/user-attachments/assets/fcc802f1-3eae-4598-a4a0-6757fe9be29b" />



7) Project Architecture


React + Redux
       │
       ▼
    Axios API
       │
       ▼
Express.js REST APIs
       │
       ▼
JWT Authentication
       │
       ▼
MongoDB + Mongoose



8) Deployment
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas


9) Future Improvements

* Stripe/Razorpay Payment Integration
* Product Reviews
* Email Notifications
* Product Recommendations
* Admin Analytics Dashboard



Author

Shaina Agarwal

B.Tech Graduate | MERN Stack Developer

GitHub: https://github.com/ShainaAgarwal

