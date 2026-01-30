# Budget Tracker

A personal budget tracking application built with FastAPI and SQLite. Track income and expenses, view transaction history, and monitor your balance.

## Tech Stack

- **Backend:** Python, FastAPI, SQLModel
- **Database:** SQLite
- **Frontend:** React (planned)

## Getting Started

### Prerequisites

- Python 3.12+

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
pip install fastapi sqlmodel uvicorn
```

### Running the Server

```bash
fastapi dev app/main.py
```

The API will be available at `http://127.0.0.1:8000` and interactive docs at `http://127.0.0.1:8000/docs`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API status |
| POST | `/transactions` | Create a transaction |
| GET | `/transactions` | List all transactions |
| GET | `/transactions/{id}` | Get a transaction by ID |
| GET | `/transactions/summary` | Get income, expenses, and balance |
| PUT | `/transactions/{id}` | Update a transaction |
| DELETE | `/transactions/{id}` | Delete a transaction |

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

- [x] CRUD API for transactions
- [x] Income/expense type validation
- [x] Summary endpoint (total income, total expenses, net balance)
- [x] Filter transactions by type and date range
- [ ] React frontend
  - [ ] Transaction list view
  - [ ] Add/edit transaction form
  - [ ] Balance summary dashboard
- [ ] Transaction categories (food, rent, entertainment, etc.)
- [ ] Monthly/weekly breakdowns
- [ ] Charts and visualizations
- [ ] Export to CSV
- [ ] User authentication (multi-user support)
