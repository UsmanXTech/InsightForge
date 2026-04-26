-- Initialization Script for InsightForge DB

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50),
    status VARCHAR(50),
    department VARCHAR(100),
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    revenue INTEGER DEFAULT 0,
    users INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    budget INTEGER DEFAULT 0,
    spend INTEGER DEFAULT 0
);

-- Creating a default Admin user so you can log in immediately
INSERT INTO users (id, name, email, role, status, department) 
VALUES ('USR-0001', 'Admin InsightForge', 'admin@insightforge.com', 'Admin', 'Active', 'Engineering')
ON CONFLICT (email) DO NOTHING;
