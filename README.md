# CRUD WITH EMAIL VALIDATION

This project includes email validation using Nodemailer with OTP, PostgreSQL as the database, file uploads using Multer, and authentication using JWT and Bcrypt for password encryption.

## Table of Contents

- [Installation](#installation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [License](#license)

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Set up the environment variables in a `.env` file (see below).

4. Run migrations and seeders to set up the database:

    ```bash
    npm run migrate
    npm run seed
    ```

## Project Structure

Sure, here is a sample README for your project that includes email validation using Nodemailer with OTP, PostgreSQL as the database, file uploads using Multer, and authentication using JWT and Bcrypt for password encryption.

markdown
Copy code
# Project Title

This project includes email validation using Nodemailer with OTP, PostgreSQL as the database, file uploads using Multer, and authentication using JWT and Bcrypt for password encryption.

## Table of Contents

- [Installation](#installation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [License](#license)

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Set up the environment variables in a `.env` file (see below).

4. Run migrations to set up the database:

    ```bash
    npm run migrate
 
    ```

## Project Structure

- project-root/
- │
- ├── src/
- │   ├── entity              # Contains entity definitions
- │   ├── helper              # Helper functions and utilities
- │   ├── migration           # Database migration files
- │   ├── router              # Route definitions
- │   ├── schema              # schema definitions
- │   ├── seeders             # Seed data for the database
- │   ├── data-source.ts      # Data source configuration
- │   ├── index.ts            # Entry point of the application
- │   ├── test.config.ts      # Configuration for testing
- │   └── server.ts           # Server configuration and initialization
- │
- ├── uploads/                # Directory for file uploads
- │
- ├── .gitattributes          # Git attributes configuration
- │
- ├── .gitignore              # Specifies files and directories to be ignored by Git
- │
- ├── README.md               # Project documentation and instructions
- │
- ├── nodemon.json            # Nodemon configuration file
- │
- ├── package.json            # Project metadata, scripts, and dependencies
- │
- ├── tsconfig.json           # TypeScript configuration file
- │
- └── yarn.lock               # Yarn lock file for dependency management






## Environment Variables

Create a `.env` file in the root of the project and add the following variables:

```env
PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.your-email-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

## Scripts
npm start: Start the server
npm run dev: Start the server in development mode
npm run migrate: Run database migrations
npm run seed: Seed the database
npm test: Run tests

## License
This project is licensed under the MIT License.

