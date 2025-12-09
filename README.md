# Global Trend – API Integration Internship Assignment

This project is a Node.js and Express REST API built as part of the Global Trend API Integration Internship assignment.
It integrates with the public JSONPlaceholder API, fetches data from multiple endpoints, applies in-memory caching,
and exposes clean, filterable API routes for clients.

## Features
* Fetches data from two external endpoints: `/posts` and `/users`
* Combines user information with each post
* Supports filtering (`userId`, `title`) and pagination (`limit`, `offset`)
* Provides a detailed post view using route parameters
* Implements in-memory caching to reduce repetitive external API calls
* Includes structured error handling for:
* Invalid query parameters
* Missing or incorrect IDs
* Upstream API timeouts or failures
* Unexpected response formats
* Modular code structure following common backend best practices

## Tech Stack
* Node.js
* Express.js
* Native Fetch API (Node 18+)
* JSONPlaceholder REST API


## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the server:

   ```bash
   npm start
   ```

The server will run on:

```
http://localhost:3000
```

## Project Structure

```
src/
  server.js
  config.js

  routes/
    postsRouter.js

  services/
    cacheService.js
    jsonPlaceholderClient.js

  middleware/
    errorMiddleware.js
```

## Endpoints

### GET /health
Returns API status and server timestamp.

### GET /api/posts
Returns a list of posts with optional filters.

#### Query Parameters:
* `limit` – number of items to return (default: 20)
* `offset` – number of items to skip (default: 0)
* `userId` – filter posts by user ID
* `title` – case-insensitive search within the post title

#### Example:
```
GET /api/posts?userId=1&limit=10&offset=0
```

### GET /api/posts/:id
Returns a single post along with its associated user information.
* Responds with HTTP 404 if the post does not exist.

## Data Source
This project uses the JSONPlaceholder public REST API:
[https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com)

Endpoints used:
* `/posts`
* `/users`

## Error Handling
The API includes structured error responses for:

* Invalid or missing query parameters
* Invalid route parameters
* Upstream API failures and timeouts
* Unexpected or malformed API responses

All errors are returned in a consistent JSON format.

## Assumptions
* In-memory caching is sufficient for this assignment and resets when the server restarts.
* JSONPlaceholder returns static mock data suitable for testing and prototyping.

## Conclusion
This project fulfills all the requirements of the Global Trend API Integration Internship assignment, including integration with multiple external endpoints, data caching, filtering capabilities, detailed data retrieval, modular structure, and clear documentation.
