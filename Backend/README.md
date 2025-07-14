# Backend API Documentation

## `/users/register` Endpoint

### Description
Registers a new user by creating a user account with the provided information.

### HTTP Method
`POST`

### Request Body
The request body should be in JSON format and include the following fields:

-`fullname` (object):
    - `firstname` (string, required): User's first name (minimum 3 characters).
    - `lastname` (string, optional): User's last name (minimum 3 characters).

-`email` (string, required): User's email address (must be a valid email).

-`password` (string, required): User's password (minimum 6 characters).


### Example Response
-`user` (object):
    - `fullname` (object):
        - `firstname` (string): User's first name (minimum 3 characters).
        - `lastname` (string): User's last name (minimum 3 characters).
    - `email` (string): User's email address (must be a valid email).
    - `password` (string): User's password (minimum 6 characters). ⚠️ Note: Best practice is to not include this in response.

-`token` (string): JWT Token

---

## `/users/login` Endpoint

### Description
Authenticates a user and returns a JWT token if the credentials are valid.

### HTTP Method
`POST`

### Request Body
The request body should be in JSON format and include the following fields:

- `email` (string, required): User's email address (must be a valid email).
- `password` (string, required): User's password (minimum 6 characters).

### Example Response
-`user` (object):
    - `fullname` (object):
        - `firstname` (string): User's first name (minimum 3 characters).
        - `lastname` (string): User's last name (minimum 3 characters).
    - `email` (string): User's email address (must be a valid email).
    - `password` (string): User's password (minimum 6 characters). ⚠️ Note: Best practice is to not include this in response.

-`token` (string): JWT Token

---

## `/users/profile` Endpoint

### Description
Returns the profile information of the authenticated user.

### HTTP Method
`GET`

### Authentication
Requires a valid JWT token in the Authorization header. Authorization:Bearer<token>

### Example Response
-`user` (object):
    - `fullname` (object):
        - `firstname` (string): User's first name (minimum 3 characters).
        - `lastname` (string): User's last name (minimum 3 characters).
    - `email` (string): User's email address (must be a valid email).
    
## `/users/logout` Endpoint

### Description
Logout the current user and blacklist the token provided in cookie or headers.

### HTTP Method
`GET`

### Authentication
Requires a valid JWT token in the Authorization header or cookie .

### Example Response
