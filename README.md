# Budget Tracker

A personal budget tracking application built with FastAPI and PostgreSQL. Track income and expenses, view transaction history, and monitor your balance.

## Tech Stack

- **Backend:** Python, FastAPI, SQLModel
- **Database:** PostgreSQL
- **Frontend:** React, TypeScript, Vite

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 22+
- PostgreSQL

### Installation

```bash
# Clone the repository
git clone https://github.com/TheRealFezbot/budget-tracker.git
cd budget-tracker
```

#### Using uv (recommended)

```bash
uv sync
source .venv/bin/activate
```

#### Using pip

```bash
python -m venv .venv
source .venv/bin/activate
pip install fastapi sqlmodel uvicorn psycopg2-binary python-dotenv
```

### Database Setup

1. Create a PostgreSQL database and user:
```sql
sudo -u postgres psql
CREATE USER youruser WITH PASSWORD 'yourpassword';
CREATE DATABASE budget_tracker OWNER youruser;
\q
```

2. Create a `.env` file in the project root:
```
DATABASE_URL=postgresql://youruser:yourpassword@localhost:5432/budget_tracker
```

### Running the Backend

```bash
fastapi dev app/main.py
```

The API will be available at `http://127.0.0.1:8000` and interactive docs at `http://127.0.0.1:8000/docs`.

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API status |
| POST | `/register` | Register a new user |
| POST | `/login` | Login and get JWT token |
| POST | `/transactions` | Create a transaction |
| GET | `/transactions` | List all transactions |
| GET | `/transactions/{id}` | Get a transaction by ID |
| GET | `/transactions/summary` | Get income, expenses, and balance |
| PUT | `/transactions/{id}` | Update a transaction |
| DELETE | `/transactions/{id}` | Delete a transaction |

All `/transactions` endpoints require authentication via Bearer token.

### Example Request

```json
POST /transactions
{
  "name": "Groceries",
  "description": "Weekly shop",
  "type": "expense",
  "amount": 45.50,
  "transaction_date": "2026-01-30"
}
```

Transaction type must be either `"income"` or `"expense"`.

## Roadmap

### MVP (SQLite)
- [x] CRUD API for transactions
- [x] Income/expense type validation
- [x] Summary endpoint (total income, total expenses, net balance)
- [x] Filter transactions by type and date range (backend)
- [x] React frontend
  - [x] Transaction list view
  - [x] Add transaction form
  - [x] Edit transaction (inline form reuse with PUT)
  - [x] Delete transaction (with confirmation)
  - [x] Balance summary dashboard
  - [x] Color-coded amounts (income/expense)
  - [x] Pagination
  - [x] Filter transactions by type and date range (frontend)

### Production (PostgreSQL)
- [x] Migrate from SQLite to PostgreSQL
- [x] User authentication (JWT, multi-user support)
- [x] Multi-page routing (React Router)
- [ ] Server-side pagination and filtering
- [ ] Transaction categories (food, rent, entertainment, etc.)
- [ ] Monthly/weekly breakdowns
- [ ] Charts and visualizations
- [ ] Export to CSV
- [ ] Deploy to web
