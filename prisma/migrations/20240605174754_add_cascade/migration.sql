-- DropForeignKey
ALTER TABLE "bookmars" DROP CONSTRAINT "bookmars_userId_fkey";

-- AddForeignKey
ALTER TABLE "bookmars" ADD CONSTRAINT "bookmars_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
