import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Seed Emission Factors
  console.log('📊 Seeding emission factors...');

  const emissionFactors = [
    // Road Transport - Truck
    {
      transportMode: 'TRUCK',
      fuelType: 'DIESEL',
      region: 'GLOBAL',
      co2Factor: 0.0970,
      ch4Factor: 0.0015,
      n2oFactor: 0.0032,
      source: 'EPA',
      year: 2024,
    },
    {
      transportMode: 'TRUCK',
      fuelType: 'ELECTRIC',
      region: 'GLOBAL',
      co2Factor: 0.0150,
      ch4Factor: 0.0000,
      n2oFactor: 0.0000,
      source: 'EPA',
      year: 2024,
    },
    {
      transportMode: 'TRUCK',
      fuelType: 'HYBRID',
      region: 'GLOBAL',
      co2Factor: 0.0580,
      ch4Factor: 0.0008,
      n2oFactor: 0.0016,
      source: 'EPA',
      year: 2024,
    },
    {
      transportMode: 'TRUCK',
      fuelType: 'LNG',
      region: 'GLOBAL',
      co2Factor: 0.0850,
      ch4Factor: 0.0020,
      n2oFactor: 0.0010,
      source: 'EPA',
      year: 2024,
    },
    {
      transportMode: 'TRUCK',
      fuelType: 'BIODIESEL',
      region: 'GLOBAL',
      co2Factor: 0.0820,
      ch4Factor: 0.0012,
      n2oFactor: 0.0025,
      source: 'EPA',
      year: 2024,
    },

    // Rail Transport
    {
      transportMode: 'RAIL',
      fuelType: 'DIESEL',
      region: 'GLOBAL',
      co2Factor: 0.0300,
      ch4Factor: 0.0008,
      n2oFactor: 0.0015,
      source: 'IPCC',
      year: 2024,
    },
    {
      transportMode: 'RAIL',
      fuelType: 'ELECTRIC',
      region: 'GLOBAL',
      co2Factor: 0.0080,
      ch4Factor: 0.0000,
      n2oFactor: 0.0000,
      source: 'IPCC',
      year: 2024,
    },

    // Maritime Transport - Ship
    {
      transportMode: 'SHIP',
      fuelType: 'HEAVY_FUEL_OIL',
      region: 'GLOBAL',
      co2Factor: 0.0150,
      ch4Factor: 0.0005,
      n2oFactor: 0.0008,
      source: 'IMO',
      year: 2024,
    },
    {
      transportMode: 'SHIP',
      fuelType: 'DIESEL',
      region: 'GLOBAL',
      co2Factor: 0.0140,
      ch4Factor: 0.0004,
      n2oFactor: 0.0007,
      source: 'IMO',
      year: 2024,
    },
    {
      transportMode: 'SHIP',
      fuelType: 'LNG',
      region: 'GLOBAL',
      co2Factor: 0.0120,
      ch4Factor: 0.0015,
      n2oFactor: 0.0003,
      source: 'IMO',
      year: 2024,
    },

    // Air Transport
    {
      transportMode: 'AIR',
      fuelType: 'JET_FUEL',
      region: 'GLOBAL',
      co2Factor: 0.5000,
      ch4Factor: 0.0020,
      n2oFactor: 0.0100,
      source: 'ICAO',
      year: 2024,
    },
  ];

  for (const factor of emissionFactors) {
    await prisma.emissionFactor.upsert({
      where: {
        transportMode_fuelType_region: {
          transportMode: factor.transportMode,
          fuelType: factor.fuelType,
          region: factor.region,
        },
      },
      update: factor,
      create: factor,
    });
  }

  console.log(`✅ Seeded ${emissionFactors.length} emission factors\n`);

  // Create a demo company
  console.log('🏢 Creating demo company...');

  const demoCompany = await prisma.company.upsert({
    where: { id: 'demo-company-1' },
    update: {},
    create: {
      id: 'demo-company-1',
      name: 'Demo Logistics Inc.',
      industry: 'Transportation & Logistics',
      country: 'Zambia',
    },
  });

  console.log(`✅ Created company: ${demoCompany.name}\n`);

  // Create a demo user
  console.log('👤 Creating demo user...');

  // Note: In production, password should be hashed with bcrypt
  // For demo purposes, using plain text (you'll hash this when implementing auth)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@cfip.com' },
    update: {},
    create: {
      email: 'demo@cfip.com',
      name: 'Demo User',
      password: 'demo123', // TODO: Hash this with bcrypt in production
      role: 'ADMIN',
      companyId: demoCompany.id,
    },
  });

  console.log(`✅ Created user: ${demoUser.email} (password: demo123)\n`);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📝 Summary:');
  console.log(`   - Emission Factors: ${emissionFactors.length}`);
  console.log(`   - Companies: 1`);
  console.log(`   - Users: 1`);
  console.log('\n🚀 You can now start the development server with: npm run dev');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
