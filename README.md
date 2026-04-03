# Girlyf — Exquisite Jewellery Platform

A full-stack jewellery e-commerce platform built with **Angular 17** (frontend) and **ASP.NET Core 8** (backend), backed by **PostgreSQL**.

---

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | Angular 17, Tailwind CSS, Angular Material, SSR |
| Backend  | ASP.NET Core 8 Web API, Entity Framework Core 8 |
| Database | PostgreSQL 15+                                  |
| Auth     | JWT Bearer Tokens                               |
| ORM      | EF Core with Npgsql (PostgreSQL provider)       |

---

## Prerequisites

Make sure the following are installed on your machine before starting:

| Tool              | Version   | Download |
|-------------------|-----------|----------|
| Node.js           | 20+       | https://nodejs.org |
| Angular CLI       | 17+       | `npm install -g @angular/cli` |
| .NET SDK          | 8.0       | https://dotnet.microsoft.com/download |
| PostgreSQL        | 15+       | https://www.postgresql.org/download |
| Git               | Latest    | https://git-scm.com |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd girlyf
```

---

### 2. Database Setup (PostgreSQL)

#### Create the database

Open **pgAdmin** or the `psql` terminal and run:

```sql
CREATE DATABASE girlyfdb;
```

> The default user expected is `postgres`. If you use a different user, update the connection string in step 3.

---

### 3. Backend Setup (ASP.NET Core API)

#### Navigate to the API project

```bash
cd backend/Girlyf.API
```

#### Configure the connection string

Open `appsettings.json` and update the `DefaultConnection` with your PostgreSQL credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=girlyfdb;Username=postgres;Password=YOUR_PASSWORD"
  },
  "Jwt": {
    "Key": "Girlyf_SuperSecretKey_2026_ChangeThis_InProduction_64chars!",
    "Issuer": "Girlyf.API",
    "Audience": "Girlyf.Client"
  }
}
```

> ⚠️ **Never commit real passwords or JWT keys to Git.** Use `appsettings.Development.json` for local overrides (it is already in `.gitignore` — double check before pushing).

#### Restore NuGet packages

```bash
dotnet restore
```

#### Apply migrations (creates all tables)

The migration files are already included in the repository (`backend/Girlyf.API/Migrations/`). You just need to apply them to your local database:

```bash
dotnet ef database update
```

This will create all tables automatically in your `girlyfdb` database.

> If `dotnet ef` is not installed:
> ```bash
> dotnet tool install --global dotnet-ef
> ```

#### Seed the database

Once tables are created, load the sample product and category data:

```bash
psql -U postgres -d girlyfdb -f ../seed-data.sql
```

> The seed file inserts 30 products, categories, gold rates, and sample testimonials so the site renders fully.

#### Start the API

```bash
dotnet run
```

The API will be available at:
- **http://localhost:5193/api**
- **Swagger UI:** http://localhost:5193/swagger

---

### 4. Frontend Setup (Angular)

#### Navigate to the frontend

```bash
cd ../../frontend
```

#### Install dependencies

```bash
npm install
```

#### Environment configuration

The default dev environment points to the local API at `http://localhost:5193/api`.  
Check `src/environments/environment.ts` — no changes needed for local development.

#### Start the dev server

```bash
npm start
```

The app will be available at **http://localhost:4200**

---

## Project Structure

```
girlyf/
├── backend/
│   ├── seed-data.sql               # Database seed data (run once after migrations)
│   └── Girlyf.API/
│       ├── Controllers/            # API route controllers
│       ├── Data/                   # AppDbContext (EF Core)
│       ├── DTOs/                   # Data Transfer Objects
│       ├── Migrations/             # EF Core migrations — committed to Git, do not edit manually
│       ├── Models/                 # Entity models
│       ├── Services/               # Business logic + interfaces
│       ├── appsettings.json        # App configuration (update DB credentials here)
│       └── Program.cs              # App entry point, DI, middleware
│
└── frontend/
    ├── public/assets/              # Images, icons, static files
    └── src/
        ├── app/
        │   ├── core/               # Guards, interceptors, services, models
        │   ├── features/           # Page components (home, products, cart, etc.)
        │   └── shared/             # Reusable components (header, footer, product card)
        ├── environments/           # environment.ts (dev) / environment.prod.ts (prod)
        └── styles.css              # Global styles and design system
```

---

## Running Both Simultaneously

Open two terminal tabs:

**Terminal 1 — Backend:**
```bash
cd backend/Girlyf.API
dotnet run
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```

---

## Building for Production

#### Frontend build
```bash
cd frontend
npm run build
```
Output goes to `frontend/dist/`.

#### Backend build
```bash
cd backend/Girlyf.API
dotnet publish -c Release -o ./publish
```

---

## Git Workflow

```bash
# Create a new feature branch — never commit directly to main
git checkout -b feature/your-feature-name

# Stage and commit
git add .
git commit -m "feat: describe what you did"

# Push your branch
git push origin feature/your-feature-name

# Open a Pull Request on GitHub for review before merging
```

### When you change a database model

If you add or modify any file in `Models/`, you must generate a new migration and commit it:

```bash
cd backend/Girlyf.API
dotnet ef migrations add YourMigrationName
git add Migrations/
git commit -m "chore: add migration YourMigrationName"
```

> **Never edit migration files manually.** Always generate them with `dotnet ef migrations add`.

### Branch naming convention

| Type     | Format                      | Example                        |
|----------|-----------------------------|--------------------------------|
| Feature  | `feature/short-description` | `feature/wishlist-page`        |
| Bug fix  | `fix/short-description`     | `fix/cart-quantity-bug`        |
| Hotfix   | `hotfix/short-description`  | `hotfix/payment-crash`         |
| Chore    | `chore/short-description`   | `chore/update-dependencies`    |

### What NOT to commit

The `.gitignore` already excludes these — **verify before every push**:

- `appsettings.*.json` (contains DB passwords and JWT keys)
- `node_modules/`
- `bin/`, `obj/`, `dist/`
- `.DS_Store`, `.env` files

---

## API Overview

| Method | Endpoint                   | Description              | Auth     |
|--------|----------------------------|--------------------------|----------|
| POST   | `/api/auth/register`       | Register a new user      | Public   |
| POST   | `/api/auth/login`          | Login, returns JWT token | Public   |
| GET    | `/api/products`            | List products (filtered) | Public   |
| GET    | `/api/products/{id}`       | Get product details      | Public   |
| GET    | `/api/categories`          | List all categories      | Public   |
| GET    | `/api/goldrates`            | Today's gold rates       | Public   |
| GET    | `/api/cart`                | Get user's cart          | JWT      |
| POST   | `/api/cart`                | Add to cart              | JWT      |
| GET    | `/api/orders`              | Get user's orders        | JWT      |
| POST   | `/api/orders`              | Place an order           | JWT      |
| GET    | `/api/admin/*`             | Admin endpoints          | JWT + Admin |

> Full API documentation: **http://localhost:5193/swagger** (when running locally)

---

## Common Issues

**`dotnet ef` not found**
```bash
dotnet tool install --global dotnet-ef
```

**PostgreSQL connection refused**  
Make sure PostgreSQL service is running:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

**Port 4200 already in use**
```bash
ng serve --port 4201
```

**Port 5193 already in use**  
Update the port in `backend/Girlyf.API/Properties/launchSettings.json`.

---

## Contact

For questions about the project, reach out to the project owner before making major architectural changes.
