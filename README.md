# Quiz Management System Backend

This is the backend for a Quiz Management System application. It provides a RESTful API for managing users, quizzes, questions, and quiz attempts. The application is built with Node.js, Express, and MongoDB.

-----

## Features

  * **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens) for access and refresh tokens.
  * **Role-Based Access Control:** Differentiates between regular users and admins. Admin-only routes are protected to ensure only authorized personnel can manage quiz content.
  * **Quiz Management (Admin):** Admins can create, delete, and manage quizzes.
  * **Question Management (Admin):** Admins can add multiple-choice questions with correct answers to any quiz.
  * **Quiz Taking (User):** Authenticated users can fetch a list of all available quizzes and attempt any quiz.
  * **Scoring System:** Automatically calculates and saves the user's score upon quiz submission.
  * **Secure Password Handling:** User passwords are encrypted using bcrypt before being stored.
  * **Standardized API Responses:** Uses a consistent structure for API success and error responses.

-----

## Technologies Used

  * **Node.js:** JavaScript runtime environment.
  * **Express.js:** Web application framework for Node.js.
  * **MongoDB:** NoSQL database for storing application data.
  * **Mongoose:** Object Data Modeling (ODM) library for MongoDB and Node.js.
  * **JSON Web Token (JWT):** For generating and verifying access and refresh tokens.
  * **bcrypt:** Library for hashing passwords.
  * **cookie-parser:** Middleware to parse cookie headers.
  * **cors:** Middleware for enabling Cross-Origin Resource Sharing.
  * **dotenv:** For loading environment variables from a `.env` file.
  * **multer:** Middleware for handling `multipart/form-data`, used for file uploads (though current routes use `upload.none()`).

-----

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

  * [Node.js](https://nodejs.org/en/) (v14 or higher recommended)
  * [npm](https://www.npmjs.com/) (Node Package Manager)
  * A MongoDB database instance (you can use a local installation or a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

-----

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1\. Clone the Repository

```bash
git clone https://github.com/sk698/Quiz-Management.git
cd Quiz-Management
```

### 2\. Install Dependencies

Install all the required npm packages using the following command:

```bash
npm install
```

### 3\. Configure Environment Variables

This project uses a `.env` file to manage environment variables. You will need to create this file in the root of the project.

1.  Create a file named `.env` in the project's root directory.
2.  Copy the contents of the example below into your new `.env` file.
3.  Replace the placeholder values with your specific configuration details.

```env
# The port number your server will run on
PORT=8000

# Your MongoDB connection string.
# Replace this with the URI from your MongoDB Atlas cluster or local instance.
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>

# Secret keys for generating JWTs. These should be long, random, and secret strings.
ACCESS_TOKEN_SECRET=yourSuperSecretAccessTokenString
REFRESH_TOKEN_SECRET=yourSuperSecretRefreshTokenString

# Expiry times for the tokens
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
```
>#### Your folder Structure should look like this
```
Quiz-Management/
├── node_modules 
├── public                 
├── scr                
├── .env        <--- add this file 
├── .gitignore                
├── package-lock.json
├── package.json
└── README.md

```

### 4\. Run the Application

Once the dependencies are installed and the environment variables are configured, you can start the server:

```bash
npm run dev
```

The server should now be running at `http://localhost:8000` or the port you specified in your `.env` file.

-----

## API Endpoints

The base URL for all API routes is `/api/v1`.

### User Routes (`/api/v1/user`)

| Method | Endpoint              | Access  | Description                                        |
| :----- | :-------------------- | :------ | :------------------------------------------------- |
| `POST` | `/register`           | Public  | Register a new user.                               |
| `POST` | `/login`              | Public  | Log in an existing user and receive JWT tokens.    |
| `GET`  | `/logout`             | Private | Log out the user and clear their refresh token.    |
| `GET`  | `/refresh-token`      | Private | Get a new access token using a refresh token.      |
| `GET`  | `/changePassword`     | Private | Change the current user's password.                |

### Quiz Routes (`/api/v1/quiz`)

| Method   | Endpoint                      | Access       | Description                                              |
| :------- | :---------------------------- | :----------- | :------------------------------------------------------- |
| `POST`   | `/create`                     | Admin        | Create a new quiz. Requires a `title` in the body.       |
| `POST`   | `/:quizId/questions/add`      | Admin        | Add one or more questions to a specific quiz.            |
| `DELETE` | `/:quizId/delete`             | Admin        | Delete a quiz and all its associated questions.          |
| `GET`    | `/`                           | Public       | Get a list of all available quizzes.                     |
| `GET`    | `/:quizId`                    | Public       | Get all questions for a specific quiz (without answers). |
| `POST`   | `/:quizId/submit`             | Private      | Submit answers for a quiz and get the score.             |

-----

## Project Structure

```
src/
├── app.js                  # Express app configuration and middleware
├── constants.js            # Project-wide constants
├── index.js                # Main entry point: connects to DB and starts server
├── db/
│   └── db.js               # MongoDB connection logic
├── controllers/
│   ├── quiz.controller.js  # Logic for quiz creation, deletion, submission
│   ├── question.controller.js # Logic for adding/retrieving questions
│   └── user.controller.js  # Logic for user authentication and management
├── middlewares/
│   ├── auth.middleware.js  # JWT verification middleware
│   ├── multer.middleware.js # Multer configuration for file uploads
│   └── verifyAdmin.middleware.js # Middleware to check for admin role
├── models/
│   ├── question.model.js   # Mongoose schema for Questions
│   ├── quiz.model.js       # Mongoose schema for Quizzes
│   ├── quizAttempt.model.js # Mongoose schema for Quiz Attempts
│   └── user.model.js       # Mongoose schema for Users
├── routes/
│   ├── quiz.routes.js      # API routes for quizzes and questions
│   └── user.routes.js      # API routes for users
└── utils/
    ├── ApiError.js         # Custom error handling class
    ├── ApiResponse.js     # Custom response handling class
    └── asyncHandler.js     # Wrapper for handling async errors in controllers

```

------

# 🚀 Postman Collection & Admin Instructions

This guide explains how to test the API using the provided Postman collection, with a focus on using admin privileges. To test admin-only endpoints, you must first manually assign the admin role to a user in your MongoDB database.

-----
> 🔗 See the frontend variables and environment setup here:


- 🔗 [Postman Collection Link](https://lunar-comet-773607.postman.co/workspace/SACHIN-SHARMA's-Workspace~365b4ee6-8405-41b5-8372-f649b9cc9e5a/collection/48584832-6671f5af-abb6-4395-a96b-04691d9cfbaf?action=share&creator=48584832&active-environment=48584832-50dca7c1-d132-486f-b07b-c26d0c33be79)

- Import Quiz API Collection

-----

## 📝 Step-by-Step Guide for Admin Testing
### Step 1: Become an Admin (Manual Database Edit)
1. Register a New User: First, use the User > CreateUser request in Postman to register a new user. This user will have the default role of "user".

2. Connect to Your MongoDB Database: Open your database using a tool like MongoDB Compass or the MongoDB Atlas web interface.

3. Find the User: Navigate to your database, open the users collection, and find the document for the user you just registered.

4. Edit the Role: In that user's document, locate the role field. Change its value from "user" to "admin".

5. Save the change. This user now has admin privileges.

### Step 2: Get the Admin Access Token
1. Log In as the Admin: Back in Postman, use the User > Login request with the credentials of the user you just promoted to admin.

2. Copy the Access Token: From the successful login response, copy the accessToken value.

### Step 3: Set Up Your Postman Environment
1. Import the Collection: If you haven't already, import the collection using the link above.

2. Create an Environment: In the top-right of Postman, click the eye icon and select Add to create a new environment. Name it "Quiz API Admin".

3. Go to authorization -> Auth Type -> Bearer Token -> paste the accessToken value

4. Save the environment.

5. Activate the Environment: Make sure your "Quiz API Admin" environment is selected from the dropdown menu in the top-right corner.

### Step 4: Test the API
- You are now ready to test all endpoints.

- Admin-specific requests inside the Quiz > Admin folder will now be authorized correctly.

----

# Video Link
- 🔗 [Video Link](https://drive.google.com/file/d/1NQ5f1yw3WVwKKFveyqCQHCoqh0y8_lKs/view?usp=sharing)
