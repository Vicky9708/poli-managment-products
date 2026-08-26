# Product CRUD API

NestJS backend with hexagonal architecture (ports and adapters), Mongoose and Swagger.

## Structure

```
src/
  common/filters/            shared exception filter
  product/
    domain/                  entity, port, domain errors (framework-agnostic)
    application/              service and DTOs (depends on the port, not on Mongoose)
    infrastructure/
      http/                   REST controller (driving adapter)
      persistence/            Mongoose schema and repository (driven adapter)
```

## Prerequisites

- Node.js 22+
- pnpm
- A MongoDB Atlas cluster (free tier) and its connection string

## Setup

1. Install dependencies:
   ```
   pnpm install
   ```
2. Copy `.env.example` to `.env` and replace `MONGODB_URI` with your real Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
   PORT=3000
   ```
3. Run in development mode:
   ```
   pnpm run start:dev
   ```
4. Swagger UI: http://localhost:3000/api

## Endpoints

| Method | Path           | Description       |
|--------|----------------|--------------------|
| POST   | /products      | Create a product   |
| GET    | /products      | List all products  |
| GET    | /products/:id  | Get one product    |
| PUT    | /products/:id  | Update a product   |
| DELETE | /products/:id  | Delete a product   |
