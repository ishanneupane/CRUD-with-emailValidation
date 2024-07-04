CRUD WITH EMAIL VALIDATION
This project is a back-end that includes features such as email validation using nodemailer with OTP, PostgreSQL as the database, file uploads using multer, and authentication using JWT tokens and bcrypt for password encryption.

Table of Contents

Configuration
Usage
Features
API Endpoints
Contributing
License
Installation
Clone the repository:



Create a new database.
Run the necessary SQL scripts to create the required tables.
Set up environment variables:

Create a .env file in the root directory and add the following environment variables:


PORT=3000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
Configuration
Configure Nodemailer for email validation:

Update the EMAIL_SERVICE, EMAIL_USER, and EMAIL_PASS in the .env file with your email service provider's details.

Configure PostgreSQL:

Update the DATABASE_URL in the .env file with your PostgreSQL connection string.

Configure JWT:

Update the JWT_SECRET in the .env file with your secret key for JWT token generation.

Usage
Start the server:


npm start
Access the application at http://localhost:3000.

Features
Email Validation: Uses Nodemailer to send an OTP to the user's email for validation.
PostgreSQL Database: Stores user data securely.
File Upload: Uses Multer for handling file uploads.
Authentication: Implements JWT tokens for secure authentication and bcrypt for password encryption.
API Endpoints
User Registration
URL: /api/signup

Method: POST

Description: Registers a new user and sends an OTP for email validation.

Request Body:


{
  "email": "user@example.com",
  "password": "password123"
}
Response:


{
  "message": "User registered successfully. Please check your email for the OTP."
}
Email Validation
URL: /api/validate-otp

Method: POST

Description: Validates the user's email using the OTP.

Request Body:

{
  "email": "user@example.com",
  "otp": "123456"
}
Response:

{
  "message": "Email validated successfully."
}
User Login
URL: /api/login

Method: POST

Description: Authenticates the user and returns a JWT token.

Request Body:

{
  "email": "user@example.com",
  "password": "password123"
}
Response:


{
  "token": "your_jwt_token"
}
File Upload
URL: /api/upload

Method: POST

Description: Uploads a file.

Headers:

Authorization: Bearer your_jwt_token
Request: multipart/form-data

Response:


{
  "message": "File uploaded successfully."
}
Contributing
Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.

License
This project is licensed under the MIT License. See the LICENSE file for details.
