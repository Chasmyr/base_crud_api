-- Change Salt to Role.
ALTER TABLE "User" DROP COLUMN "salt";
ALTER TABLE "User" ADD COLUMN "role" text DEFAULT 'user';

