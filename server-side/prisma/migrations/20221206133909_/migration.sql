-- CreateTable
CREATE TABLE "reportMovements" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "observation" TEXT,
    "created_by" TEXT NOT NULL,
    "edited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reportMovements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reportMovements" ADD CONSTRAINT "reportMovements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportMovements" ADD CONSTRAINT "reportMovements_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
