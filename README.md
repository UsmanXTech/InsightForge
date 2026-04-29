<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# InsightForge

## Database

InsightForge now uses PostgreSQL by default.

- Default local URL: `postgresql://admin:admin@localhost:5432/insightforge`
- Container URL (backend -> db): `postgresql://admin:admin@db:5432/insightforge`

The database initialization script is:
- [database/init.sql](/C:/Users/User/Desktop/InsightForge/database/init.sql)

It creates base tables and seeds an initial admin account:
- Email: `admin@insightforge.com`
- Password: `admin123`

## Run With Docker

1. (Optional) Set env vars:
   - `GEMINI_API_KEY`
   - `SECRET_KEY` (recommended in non-dev usage)
2. Start services:
   - `docker compose up --build`
3. Open:
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:8000`
