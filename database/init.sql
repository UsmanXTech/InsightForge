-- Initialization Script for InsightForge DB

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50),
    status VARCHAR(50),
    department VARCHAR(100),
    last_login VARCHAR(50) DEFAULT 'Never'
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

CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    desc VARCHAR(255),
    time VARCHAR(50),
    type VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(100) PRIMARY KEY,
    value VARCHAR(255),
    enabled INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS user_credentials (
    email VARCHAR(255) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL
);

-- Creating a default Admin user so you can log in immediately
INSERT INTO users (id, name, email, role, status, department) 
VALUES ('USR-0001', 'Admin InsightForge', 'admin@insightforge.com', 'Admin', 'Active', 'Engineering')
ON CONFLICT (email) DO NOTHING;

-- Default login password: admin123
INSERT INTO user_credentials (email, password_hash)
VALUES (
  'admin@insightforge.com',
  'insightforge_admin_salt$51af04d90e81bcc75e59e110609028846e52a263ab6db9fb0265e5ce21224756'
)
ON CONFLICT (email) DO NOTHING;
