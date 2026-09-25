const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Password123!', 12);

  const creator = await prisma.user.upsert({
    where: { email: 'influencer@2becollab.com' },
    update: {
      passwordHash: hash,
      status: 'ACTIVE',
      emailVerifiedAt: new Date()
    },
    create: {
      email: 'influencer@2becollab.com',
      passwordHash: hash,
      fullName: 'Sophia Chen (Influencer)',
      role: 'CREATOR',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      creatorProfile: {
        create: {
          bio: 'Tech & Lifestyle Creator',
          niche: ['Tech', 'Lifestyle'],
          location: 'New York, USA'
        }
      }
    }
  });
  console.log('✅ Creator account ready:', creator.email);

  const brand = await prisma.user.upsert({
    where: { email: 'brand@2becollab.com' },
    update: {
      passwordHash: hash,
      status: 'ACTIVE',
      emailVerifiedAt: new Date()
    },
    create: {
      email: 'brand@2becollab.com',
      passwordHash: hash,
      fullName: 'Aura Tech (Brand)',
      role: 'BUSINESS',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      businessProfile: {
        create: {
          companyName: 'Aura Tech Inc.',
          industry: 'Consumer Tech',
          websiteUrl: 'https://auratech.example.com'
        }
      }
    }
  });
  console.log('✅ Brand account ready:', brand.email);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
