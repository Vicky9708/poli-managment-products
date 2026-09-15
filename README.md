# Product CRUD API

NestJS backend with hexagonal architecture (ports and adapters), Mongoose and Swagger. Exposes the same `Product` CRUD through three driving adapters: REST, GraphQL and gRPC.

## Structure

```
src/
  common/filters/            shared exception filters (HTTP and gRPC)
  product/
    domain/                  entity, port, domain errors (framework-agnostic)
    application/              service and DTOs (depends on the port, not on Mongoose)
    infrastructure/
      http/                   REST controller (driving adapter)
      graphql/                GraphQL resolver, types and inputs (driving adapter)
      grpc/                   gRPC controller, DTOs and .proto contract (driving adapter)
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
   GRPC_URL=0.0.0.0:50051
   ```
3. Run in development mode:
   ```
   pnpm run start:dev
   ```
4. Swagger UI: http://localhost:3000/api
5. gRPC server: `localhost:50051`, contract at `src/product/infrastructure/grpc/proto/product.proto`

## REST endpoints

| Method | Path           | Description       |
|--------|----------------|--------------------|
| POST   | /products      | Create a product   |
| GET    | /products      | List all products  |
| GET    | /products/:id  | Get one product    |
| PUT    | /products/:id  | Update a product   |
| DELETE | /products/:id  | Delete a product   |

## GraphQL

Playground/schema at `POST http://localhost:3000/graphql`. Queries: `products`, `product(id)`. Mutations: `createProduct`, `updateProduct`, `removeProduct`.

## gRPC

The app runs as a NestJS hybrid application: the same Nest instance serves HTTP (REST + GraphQL) on port 3000 and a gRPC microservice on port 50051 (`GRPC_URL`), both backed by the same `ProductService` and Mongo repository.

`ProductService` (package `product`), defined in `src/product/infrastructure/grpc/proto/product.proto`:

| RPC       | Request                 | Response              |
|-----------|--------------------------|------------------------|
| Create    | CreateProductRequest     | Product                |
| FindAll   | Empty                    | ProductList            |
| FindOne   | ProductById               | Product                |
| Update    | UpdateProductRequest     | Product                |
| Remove    | ProductById               | DeleteProductResponse  |

`UpdateProductRequest` uses proto3 `optional` fields, so only the fields sent by the client are updated (partial update, same semantics as the REST `PUT` and the GraphQL `updateProduct` mutation).

Errors are translated to standard gRPC status codes by `GrpcExceptionFilter`: `NOT_FOUND` for a missing product, `INVALID_ARGUMENT` for validation errors or a malformed id, `INTERNAL` for anything else.

To test it with a gRPC client (Postman, `grpcurl`, BloomRPC, Evans, etc.), point it at `localhost:50051` and import `src/product/infrastructure/grpc/proto/product.proto`. Example with `grpcurl`:

```
grpcurl -plaintext -import-path src/product/infrastructure/grpc/proto -proto product.proto \
  -d '{"name":"Mouse","description":"Wireless mouse","price":25.5}' \
  localhost:50051 product.ProductService/Create
```
