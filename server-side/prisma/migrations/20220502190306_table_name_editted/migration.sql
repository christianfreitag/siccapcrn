-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cases" (
    "id" TEXT NOT NULL,
    "num_caso_lab" TEXT,
    "num_sei" TEXT,
    "operation_name" TEXT,
    "ip_number" TEXT,
    "demandant_unit" TEXT,
    "object" TEXT,
    "date_step_one" TIMESTAMP(3),
    "date_step_two" TIMESTAMP(3),
    "date_step_three" TIMESTAMP(3),
    "date_step_four" TIMESTAMP(3),
    "date_step_five" TIMESTAMP(3),
    "date_step_six" TIMESTAMP(3),
    "date_step_seven" TIMESTAMP(3),
    "date_step_eight" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysts" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "whatsapp" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "pending_vacation_days" INTEGER NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "analysts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "case_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "date_sent_analyst" TIMESTAMP(3),
    "date_sent_review" TIMESTAMP(3),
    "date_back_review" TIMESTAMP(3),
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analyst_id" TEXT,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vacations" (
    "id" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "date_sche_ini" TIMESTAMP(3),
    "date_sche_end" TIMESTAMP(3),
    "date_ini" TIMESTAMP(3) NOT NULL,
    "date_end" TIMESTAMP(3) NOT NULL,
    "analyst_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "vacations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysts" ADD CONSTRAINT "analysts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_analyst_id_fkey" FOREIGN KEY ("analyst_id") REFERENCES "analysts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vacations" ADD CONSTRAINT "vacations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vacations" ADD CONSTRAINT "vacations_analyst_id_fkey" FOREIGN KEY ("analyst_id") REFERENCES "analysts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
