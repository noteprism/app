/*
  Warnings:

  - Added the required column `latency` to the `HealthCheck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service` to the `HealthCheck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HealthCheck" ADD COLUMN     "latency" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "service" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UptimeMetrics" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "uptime" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UptimeMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UptimeMetrics_service_period_key" ON "UptimeMetrics"("service", "period");

-- CreateIndex
CREATE INDEX "HealthCheck_service_timestamp_idx" ON "HealthCheck"("service", "timestamp");
