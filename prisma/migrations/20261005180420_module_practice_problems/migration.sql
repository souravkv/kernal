-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Module" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT '',
    "coldOpen" TEXT NOT NULL DEFAULT '',
    "outcomes" TEXT NOT NULL DEFAULT '[]',
    "practiceProblems" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Module" ("coldOpen", "courseId", "description", "icon", "id", "number", "order", "outcomes", "slug", "title") SELECT "coldOpen", "courseId", "description", "icon", "id", "number", "order", "outcomes", "slug", "title" FROM "Module";
DROP TABLE "Module";
ALTER TABLE "new_Module" RENAME TO "Module";
CREATE UNIQUE INDEX "Module_courseId_slug_key" ON "Module"("courseId", "slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
