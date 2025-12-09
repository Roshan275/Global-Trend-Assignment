Global Trend – API Integration Internship Assignment
Overview
This project is a Node.js + Express REST API built as part of the Global Trend API Integration
Internship assignment.
It integrates with the public JSONPlaceholder API, fetches data from multiple endpoints, applies
In memory caching, and exposes clean, filterable API routes.

Features
• Fetches data from two external endpoints: /posts and /users
• Combines user data with each post
• Supports filtering (userId, title), pagination (limit, offset), and ID based lookup
• In memory caching to reduce external API calls
• Proper error handling for upstream API failures, timeouts, invalid IDs, and bad queries
• Clear, structured JSON responses
• Modular code structure following best practices

Tech Stack
• Node.js
• Express.js
• Native Fetch (Node 18+)
• JSONPlaceholder REST API

Installation
1. Clone the repository
git clone
2. Install dependencies
npm install
3. Start the server
npm start

Project Structure
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
Available Endpoints
GET /health
Returns API status.
GET /api/posts
Query params:
• limit – number of items (default 20)
• offset – pagination offset (default 0)
• userId – filter posts by user
• title – case insensitive search
GET /api/posts/:id
Returns a single post with user information.
Returns 404 if the post does not exist.

Data Source
JSONPlaceholder (https://jsonplaceholder.typicode.com)
Endpoints used:
• /posts
• /users

Error Handling
The API gracefully handles:
• Network errors
• Invalid query parameters
• Missing IDs
• Upstream API timeouts
• Unexpected response formats
Assumptions
• In memory cache resets on server restart.
• JSONPlaceholder provides static mock data.

Conclusion
This project meets all requirements of the Global Trend API Integration Internship assignment,
including integration with two external endpoints, caching, filters, detail view, modular architecture, and strong documentation.
