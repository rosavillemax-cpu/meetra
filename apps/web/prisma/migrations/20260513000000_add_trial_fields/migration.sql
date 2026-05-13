-- Add trial and subscription fields to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "trialStartedAt" TIMESTAMP;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "trialEndsAt" TIMESTAMP;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "subscriptionStatus" VARCHAR(50) DEFAULT 'trialing';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "plan" VARCHAR(50) DEFAULT 'free_trial';

-- Add index for faster trial status queries
CREATE INDEX IF NOT EXISTS "User_subscriptionStatus_idx" ON "User"("subscriptionStatus");
CREATE INDEX IF NOT EXISTS "User_trialEndsAt_idx" ON "User"("trialEndsAt");