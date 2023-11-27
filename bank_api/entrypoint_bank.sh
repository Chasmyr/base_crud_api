#!/bin/bash

echo "----------------------------------"
echo "Waiting Database "
echo ""----------------------------------""

# Wait for the database to be ready
while ! pg_isready -h $PGHOST -p $PGPORT -q -U $PGUSER
do
  echo "$(date) - Waiting for database..."
  sleep 1
done

echo "----------------------------------"
echo "Database is ready!"
echo "----------------------------------"

echo "----------------------------------"
echo "Migration starting!"
echo "----------------------------------"

# Run Prisma migrations
if npx prisma migrate dev --name init --schema=prisma_bank/schema.prisma; then
  echo "Bank migrations applied successfully."
else
  echo "Error applying migrations."
  exit 1
fi


echo "----------------------------------"
echo "Server is starting..."
echo "----------------------------------"

yarn dev

echo "----------------------------------"
echo "Server started!"
echo "----------------------------------"
