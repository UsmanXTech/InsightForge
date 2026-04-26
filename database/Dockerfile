FROM postgres:15-alpine

# Set default environment variables for Google Cloud Run / Container deployment
ENV POSTGRES_USER=insightforge_admin
ENV POSTGRES_PASSWORD=change_this_to_a_secure_password
ENV POSTGRES_DB=insightforge_db

# Copy SQL initialization scripts into the container memory
# They will automatically execute when the container spins up for the first time
COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
