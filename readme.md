# Sweet Shop Management System

A MERN-stack single-page application designed to manage and maintain sweet shop inventory efficiently. It allows users to browse and purchase sweets, while admins can fully manage stock operations including adding, updating, deleting, and restocking sweets. The UI is smooth and responsive, featuring real-time stock updates and cookie-based authentication. The admin dashboard becomes visible only when an admin is logged in.

## Technology Used

- MongoDB
- Express.js
- React.js
- Node.js
- Context API for global state management
- JWT Authentication
- Cookies for storing authentication tokens
- Vercel (deployment)
- Jest / React Testing Library (testing)

## Test Result File

##### Client
![alt text](<images/Screenshot 2025-12-14 164253.png>)

##### Server
![alt text](images/image-8.png)
![alt text](images/image-9.png)'
![alt text](images/image-10.png)

## Features

### User Features

- Explore sweets without logging in.
- Login required only when purchasing.
- View full details of any sweet.

### Admin Features

- Two roles: user and admin.
- Admin accounts must be created manually in the database.
- Admin can:
  - Add sweets
  - Update sweets
  - Delete sweets
  - Restock sweets
- Admin dashboard appears in the navbar only for admins.

### Application Features

- MERN-stack Single Page Application.
- Context API for consistent global state management.
- Backend and frontend logic fully tested.
- Pagination for fast sweet browsing.
- Cookie-based JWT authentication for secure sessions.
### Application Screenshots
#### Admin Login Screenshots
![alt text](images/image-7.png)
![alt text](images/image-1.png)
![alt text](images/image-2.png)
#### Login page
![alt text](images/image-3.png)
#### User Login Screenshots
![alt text](images/image-6.png)
![alt text](images/image-5.png)
## API Endpoints

### User APIs

- **POST** `/user/signup` – Register user  
- **POST** `/user/login` – Login user/admin  
- **GET** `/user/me` – Verify authentication and authorization  

### Sweet APIs (Public)

- **GET** `/sweet/` – Fetch all sweets (pagination)  
- **GET** `/sweet/search/` – Search sweets  
- **GET** `/sweet/:id` – Sweet details  

### Admin Sweet Management APIs (Protected)

- **POST** `/sweet/` – Add sweet  
- **PUT** `/sweet/` – Update sweet  
- **DELETE** `/sweet/` – Delete sweet  

### Inventory APIs

- **POST** `/inventory/:id/purchase` – Purchase sweet & update stock  
- **POST** `/inventory/:id/restocking` – Restock sweet  

## Live Link

**URL:** <https://sweetshopar.vercel.app>

## Admin Credentials

- **Email:** <admin@gmail.com>  
- **Password:** admin@123  
Users may create their own accounts for testing.

## Running the Project Locally

### Client Setup

- Run:

  ```bash
  npm i

- Create a `.env` file in the client directory and add the following content:

  ```bash
  VITE_BASE_URL=http://localhost:5173

- Then open terminal and run:

  ```bash
  npm run dev

### Server Setup

- Run:

  ```bash
  npm i

- Create a `.env` file in the client directory and add the following content:

  ```bash
  PORT=5000
  MONGO_URI=mongodb://127.0.0.1:27017/sweetshop
  NODE_ENV=development 
  JWT_SECRET=<your_secret_key> 
  FRONTEND_URL=http://localhost:5173

- Ensure mongo db server is install on your local machine

- Then open terminal and run:

  ```bash
  npm run dev

## My AI Usage

### AI Tools Used

- ChatGPT (only AI tool used)

### How I Used AI

#### Backend Development

- Generated backend test case structures for authentication, sweets, and inventory.

#### Frontend Development

- Generated logical test case formats.
- Improved UI structure and responsiveness.
- All business logic and core code were manually written.

#### Documentation

- Assisted in formatting and refining documentation, including this README.

### Reflection on AI Impact

- Faster test-case creation.
- Better UI layout suggestions.
- Helpful debugging through alternate perspectives.
- Cleaner and more professional documentation.
- Core logic remained fully handwritten for accuracy and control.
