

## Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React 18, React Router v6, Axios |
| Backend  | Laravel, Sanctum (auth), Eloquent |
| Database | PostgreSQL               |
| Payments | HelloAsso       |

---

## Project Structure

```
project/
├── frontend/          # React app (Vite)
│   └── src/
│       ├── pages/     # One file per route
│       ├── components/# Navbar, Footer, shared UI
│       ├── services/  # api.js — all Axios calls
│       └── context/   # AuthContext
└── backend/           # Laravel app
    ├── routes/api.php
    ├── app/Http/Controllers/
    ├── app/Models/
    └── database/migrations/
```

---

## Setup

### Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env

# Set DB credentials in .env:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=your_db
# DB_USERNAME=your_user
# DB_PASSWORD=your_password

php artisan key:generate
php artisan migrate
php artisan serve        # runs on http://localhost:8000
```

Install Sanctum (if not already):
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### Frontend (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env     # set VITE_API_URL=http://localhost:8000/api
npm run dev              # runs on http://localhost:5173
```

---

## Pages & Routes

| Path                  | Page                |
|-----------------------|---------------------|
| `/`                   | Landing             |
| `/contact`            | Contact             |
| `/events`             | Event Calendar      |
| `/events/:id/checkout`| Checkout / Reserve  |
| `/productions`        | Our Productions     |
| `/blog`               | Blog                |
| `/blog/:id`           | Blog Post Detail    |
| `/signup`             | Sign Up             |
| `/signin`             | Sign In             |
| `/donate`             | Donation            |
| `/account`            | Member Dashboard    |

---

## API Endpoints

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| POST   | `/api/register`                 | Register user            |
| POST   | `/api/login`                    | Login                    |
| POST   | `/api/logout`                   | Logout (auth)            |
| GET    | `/api/events`                   | List events (filterable) |
| GET    | `/api/events/{id}`              | Event detail             |
| POST   | `/api/events/{id}/register`     | Register for event (auth)|
| GET    | `/api/blog`                     | List blog posts          |
| GET    | `/api/blog/{id}`                | Blog post detail         |
| GET    | `/api/productions`              | List productions         |
| POST   | `/api/donations`                | Create donation          |
| POST   | `/api/contact`                  | Send contact message     |
| GET    | `/api/user`                     | Current user (auth)      |
| GET    | `/api/user/registrations`       | User's event history     |
