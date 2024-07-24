# Database Setup Guide

This guide provides instructions to set up the MySQL database for the project.

## MySQL Installation

Follow the [MySQL Community Guide](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/) to install MySQL locally on your machine. The guide covers various platforms including Windows, macOS, and Linux.

## Add MySQL Credentials

Add the MySQL credentials to the `.env` file in the server directory of the project.

## Database Schema

The database schema is defined using Django models. Below are the details of each table and its fields:

### User Table

This table stores user details.

-   **id (int)**: Auto-incremented primary key.
-   **name (str)**: Name of the user.
-   **email (str)**: Email of the user (unique).
-   **created_at (datetime)**: Date and time when the user was created.
-   **referral_code (str)**: Unique referral code for the user.
-   **referral_count (int)**: Number of referrals made by the user.
-   **is_verified (bool)**: Flag to check if the user is verified.
-   **is_deleted (bool)**: Flag to check if the user is deleted (soft delete).

### Waitlist Table

This table stores the waitlist position of users.

-   **user (ForeignKey)**: Foreign key referencing the User table.
-   **position (int)**: Position of the user in the waitlist (unique).

### Referral Table

This table stores user referral details.

-   **referrer (ForeignKey)**: Foreign key referencing the User table for the user who referred.
-   **referee (ForeignKey)**: Foreign key referencing the User table for the user who was referred.
-   **created_at (datetime)**: Date and time when the referral was created.

### Verification Table

This table stores user verification details.

-   **unique_code (str)**: Unique verification code.
-   **user (ForeignKey)**: Foreign key referencing the User table.
-   **created_at (datetime)**: Date and time when the verification was created.

### AccessCode Table

This table stores user AccessCode for the selected user.

-   **user (ForeignKey)**: Foreign key referencing the User table.
-   **access_code (str)**: Access code for the user.
-   **created_at (datetime)**: Date and time when the access code was created.
-   **is_active (bool)**: Flag to check if the access code is active.

## Note

There is no need to manually create the database schema using SQL code as Django ORM will handle the creation of tables based on the defined models when migrations are run.

For any further details or queries, please refer to the project documentation or contact the project maintainers.
