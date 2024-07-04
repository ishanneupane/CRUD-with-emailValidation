# CRUD WITH EMAIL VALIDATION

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

4. Run migrations and seeders to set up the database:

    ```bash
    npm run migrate
    npm run seed
    ```

## Project Structure

src/
├── entity/
│ └── User.ts
├── helper/
│ └── email.ts
├── router/
│ ├── authRouter.ts
│ ├── fileRouter.ts
│ └── otpRouter.ts
├── migration/
│ └── 20220701000000-create-user.ts
├── schema/
│ └── userSchema.ts
├── seeders/
│ └── seed-users.ts
├── data-source.ts
├── index.ts
├── jest.config.ts
├── server.ts
