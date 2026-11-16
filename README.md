# Assignment 5: Tasty Bites Restaurant API

## Project Description

This project is a Restaurant Menu Management API built using Node.js and Express.js. It allows users to retrieve, create, update, and delete restaurant menu items.

The API includes custom middleware for request logging and input validation using `express-validator`.

## Technologies Used

- Node.js
- Express.js
- express-validator
- Postman
- JavaScript

## Getting Started

1. Clone this repository.
2. Navigate to the project directory.
3. Install the required dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

The API will run at:

`http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/menu` | Retrieve all menu items |
| GET | `/api/menu/:id` | Retrieve a menu item by ID |
| POST | `/api/menu` | Create a new menu item |
| PUT | `/api/menu/:id` | Update an existing menu item |
| DELETE | `/api/menu/:id` | Delete a menu item |

## Custom Middleware

### 1. Request Logging Middleware

Logs the following information for incoming requests:

- HTTP method
- Request URL
- Timestamp
- Request body for POST and PUT requests

### 2. Input Validation Middleware

Uses `express-validator` to validate menu item information before creating or updating menu items.

Validation requirements:

- **Name:** Required string with at least 3 characters.
- **Description:** Required string with at least 10 characters.
- **Price:** Number greater than 0.
- **Category:** Must be appetizer, entree, dessert, or beverage.
- **Ingredients:** Array containing at least one ingredient.
- **Available:** Boolean that defaults to true.

Invalid input returns a 400 status code with details about the validation errors.

## HTTP Status Codes

- **200:** Successful GET, PUT, and DELETE requests.
- **201:** Successfully created menu item.
- **400:** Invalid input or validation failure.
- **404:** Requested menu item or route not found.

## Postman API Documentation

The API was tested using Postman. The collection includes requests for all five CRUD operations, along with examples of successful responses and error responses.

**Public Postman Documentation:**

[View Tasty Bites Restaurant API Documentation](https://documenter.getpostman.com/view/60215724/2sBYHaQHsz)

## Testing

The following functionality was tested:

- Retrieving all menu items.
- Retrieving an individual menu item.
- Creating a new menu item.
- Updating an existing menu item.
- Deleting a menu item.
- Handling requests for nonexistent menu items.
- Rejecting invalid menu item information.
- Defaulting the available field to true when omitted.

## Project Files

```text
server.js
package.json
package-lock.json
README.md
```

## Running the Server

Run the following command from the project directory:

```bash
npm start
```

The server will start on port 3000.
