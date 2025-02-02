# NestJS Application with Redis, Postgres, and Swagger

This is a NestJS application that integrates Redis for caching, Postgres as the primary database, and Swagger for API documentation. The application also includes tests for the `leader-board.service`.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (optional, for running Redis and Postgres locally)
- [PostgreSQL](https://www.postgresql.org/) (if not using Docker)
- [Redis](https://redis.io/) (if not using Docker)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/chfaraz/leaderboard.git
cd your-repo-name
```
### 2. Install Dependencies
```
npm install
```

###  3. Environment Configuration

  change configurations in appmodule for postgres and leaderboard module for redis

### 4. start the application
```npm run start:dev```

### 5. Access Swagger API Documentation
Once the application is running, you can access the Swagger API documentation at:
```http://localhost:3000/api```