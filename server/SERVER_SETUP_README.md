# Server Setup Guide

This guide provides instructions to set up the server for the project.

## Steps

1. **Open the server folder:**

    ```sh
    cd server
    ```

2. **Add necessary .env variables:**

    Create a `.env` file in the server folder and add the required environment variables.

3. **Create a virtual environment:**

    ```sh
    python -m venv venv
    ```

4. **Activate the virtual environment:**

    On Windows:

    ```sh
    .\venv\Scripts\activate
    ```

    On macOS and Linux:

    ```sh
    source venv/bin/activate
    ```

5. **Install packages:**

    ```sh
    pip install -r requirements.txt
    ```

6. **Follow RabbitMQ guide for downloading and setting it up locally:**

    Follow the [RabbitMQ Installation Guide](https://www.rabbitmq.com/download.html) to download and set up RabbitMQ on your local machine. Ensure RabbitMQ is running.

7. **Run database migrations:**

    ```sh
    python manage.py migrate
    ```

8. **Add a superuser:**

    ```sh
    python manage.py createsuperuser
    ```

    Fill out necessary details. This will be the credentials for the admin panel.

9. **Run the development server:**

    ```sh
    python manage.py runserver
    ```

10. **Open another shell and run Celery:**

    ```sh
    celery -A server worker --loglevel=INFO --pool=solo
    ```

## API Endpoints

Below is a list of the API endpoints available in the project, along with a brief description of each:

### Admin Endpoint

-   **URL**: `/admin/`
-   **Description**: This endpoint provides access to the Django admin interface. The Django admin is a built-in feature that allows for easy management of the application's data through a web interface. It comes with many advantages, such as:
    -   Automatic generation of a web-based interface for models registered with the admin site.
    -   The ability to create, read, update, and delete records in the database without needing to write SQL queries.
    -   Support for custom actions, filters, and search functionality to streamline data management tasks.

### Core API Endpoints

-   **URL**: `/api/`
-   **Description**: This endpoint includes all URLs defined in the `core` application.

#### Authentication Endpoints

-   **URL**: `/auth/`

    -   **Description**: Handles user authentication.
    -   **Method**: `POST`

-   **URL**: `/auth/<str:code>/`

    -   **Description**: Handles user authentication with a referral code.
    -   **Method**: `POST`

-   **URL**: `/auth/verify/<str:code>/`
    -   **Description**: Verifies a user's account using a unique verification code.
    -   **Method**: `POST`

#### User Endpoints

-   **URL**: `/user/`
    -   **Description**: Manages user-related operations.
    -   **Method**: `GET`

#### Waitlist Endpoints

-   **URL**: `/waitlist/`

    -   **Description**: Manages the waitlist for users.
    -   **Method**: `GET`

-   **URL**: `/global-waitlist/`
    -   **Description**: Provides a global view of the waitlist, including user names.
    -   **Method**: `GET`

#### Referral Endpoints

-   **URL**: `/referrals/<int:id>/`
    -   **Description**: Manages user referrals and provides details of referrals made by a user.
    -   **Method**: `GET`

## Mail Serivce

If Google account is used for sending emails, follow the steps below:

1. **Enable Two Factor Authentication (2FA):**

    - Go to [Google Account](https://myaccount.google.com/).
    - Click on `Security` in the left sidebar.
    - Scroll down to `Signing in to Google` and enable `2-Step Verification`.
    - Follow the steps to set up 2FA.

2. **Create an App Password:**

    - Go to [Google Account](https://myaccount.google.com/).
    - Click on `Security` in the left sidebar.
    - Scroll down to `Signing in to Google` and click on `App passwords`.
    - Enter a name for the app password and click on `Generate`.
    - Copy the generated password and use it in the `.env` file.
