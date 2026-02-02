# Credit Card Checkout Onboarding

Nest.js backend for Credit Card Payment Checkout onboarding process, implementing detailed Hexagonal Architecture and Railway Oriented Programming (ROP).

## Features

- **Hexagonal Architecture (Ports & Adapters)**: Strict separation of Domain, Application, and Infrastructure layers.
- **Railway Oriented Programming (ROP)**: Error handling using `fp-ts` `Either` monad, avoiding exceptions for business logic.
- **PostgreSQL Database**: Data persistence with TypeORM.
- **Dockerized**: specific `Dockerfile.production` and `docker-compose` for easy deployment.
- **Security**: Implemented using Helmet and best practices.
- **Testing**: High coverage (>80%) with Jest.

## Architecture

- **Domain**: `src/domain` - Entities and Error definitions.
- **Application**: `src/application` - Use Cases and Ports (Interfaces).
- **Infrastructure**: `src/infrastructure` - Adapters for Database (TypeORM) and Payment Gateway.
- **Presentation**: `src/presentation` - NestJS Controllers.

## Data Model (PostgreSQL)

### Product
- **id**: UUID (Primary Key)
- **name**: String
- **price**: Decimal
- **currency**: String
- **description**: String

## Setup & Running

### Prerequisites
- Docker & Docker Compose
- Node.js (for local dev)

### Run with Docker
```bash
docker-compose up --build
```
The API will be available at `http://localhost:3000`.

### Database Seeding
The application automatically seeds 3 dummy products on startup if the database is empty.

### API Endpoints

#### POST /checkout
Process a payment for a product.

**Body:**
```json
{
  "productId": "uuid-of-product",
  "creditCardToken": "tok_visa",
  "currency": "USD"
}
```

**Responses:**
- `201 Created`: Payment successful.
- `400 Bad Request`: Payment failed or validation error.
- `404 Not Found`: Product not found.

## Testing

Run unit tests and check coverage:
```bash
npm run test:cov
```

**Coverage Target**: >80%

## Deployment
The project includes a multi-stage `Dockerfile` favored for ECS deployment.
