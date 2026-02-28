/*
  Warnings:

  - Added the required column `day_of_week` to the `schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedule" ADD COLUMN     "day_of_week" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "schedule_day_of_week_idx" ON "schedule"("day_of_week");

-- CreateIndex
CREATE INDEX "schedule_lesson_order_idx" ON "schedule"("lesson_order");
