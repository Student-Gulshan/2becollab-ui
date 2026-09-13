// ============================================
// 2BeCollab — Prisma Seed Script
// ============================================
// Creates the first admin user using env variables.
// Run: pnpm --filter @2becollab/api run db:seed

import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

// Helper to load .env from workspace root or current dir if not already set
function loadEnv() {
  const envPaths = [
    path.resolve(__dirname, '../../../.env'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env'),
    path.resolve(process.cwd(), '.env'),
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim();
            const val = trimmed.slice(idx + 1).trim();
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
      break;
    }
  }
}

loadEnv();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('⚠️ ADMIN_EMAIL and ADMIN_PASSWORD not set in .env — skipping admin seed');
    return;
  }

  // Check if admin already exists
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail.toLowerCase() },
  });

  if (existing) {
    console.log(`✅ Admin user already exists: ${adminEmail}`);
    return;
  }

  // Create admin
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail.toLowerCase(),
      passwordHash,
      fullName: 'Platform Admin',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`🔐 Admin user created: ${admin.email} (ID: ${admin.id})`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
