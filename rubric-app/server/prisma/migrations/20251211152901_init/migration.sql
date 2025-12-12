-- DropForeignKey
ALTER TABLE "Criterion" DROP CONSTRAINT "Criterion_rubricId_fkey";

-- DropForeignKey
ALTER TABLE "Level" DROP CONSTRAINT "Level_criterionId_fkey";

-- AddForeignKey
ALTER TABLE "Criterion" ADD CONSTRAINT "Criterion_rubricId_fkey" FOREIGN KEY ("rubricId") REFERENCES "Rubric"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_criterionId_fkey" FOREIGN KEY ("criterionId") REFERENCES "Criterion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
