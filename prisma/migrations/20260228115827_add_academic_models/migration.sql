-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('SOFTWARE', 'HUMANITARIAN', 'BUSINESS');

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "semester" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "specialization_id" INTEGER;

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "type" "LessonType" NOT NULL DEFAULT 'SOFTWARE';

-- CreateTable
CREATE TABLE "specializations" (
    "specialization_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "specializations_pkey" PRIMARY KEY ("specialization_id")
);

-- CreateTable
CREATE TABLE "curriculum" (
    "curriculum_id" SERIAL NOT NULL,
    "specialization_id" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "times_per_week" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "curriculum_pkey" PRIMARY KEY ("curriculum_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_specialization_id_semester_lesson_id_key" ON "curriculum"("specialization_id", "semester", "lesson_id");

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "specializations"("specialization_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum" ADD CONSTRAINT "curriculum_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "specializations"("specialization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum" ADD CONSTRAINT "curriculum_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("lesson_id") ON DELETE RESTRICT ON UPDATE CASCADE;
