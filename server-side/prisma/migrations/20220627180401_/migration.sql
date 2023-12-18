-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_case_id_fkey";

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
