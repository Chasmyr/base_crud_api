#!/bin/bash
cd /app

echo ----------------------------------
echo "Waiting Database "
echo ----------------------------------

# Wait for the database to be ready
while ! pg_isready -h $PGHOST -p $PGPORT -q -U $PGUSER
do
  echo "$(date) - Waiting for database..."
  sleep 1
done

echo ----------------------------------
echo "Database is ready!"

echo ----------------------------------
echo "Migration starting!"
echo ----------------------------------

# Run Prisma migrations
if npx prisma migrate dev --name init --schema=product_api/prisma_product/schema.prisma; then
  echo "Product migrations applied successfully."
else
  echo "Error applying migrations."
  exit 1
fi

echo ----------------------------------
echo "Server is starting..."
echo ----------------------------------

npm run dev

echo ----------------------------------
echo "Server started!"
echo ----------------------------------
