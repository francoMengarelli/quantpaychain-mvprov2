
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo users
  const demoPassword = await bcrypt.hash('demo123', 12);
  const johnPassword = await bcrypt.hash('johndoe123', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@quantpaychain.com' },
    update: {},
    create: {
      email: 'demo@quantpaychain.com',
      name: 'Demo User',
      firstName: 'Demo',
      lastName: 'User',
      password: demoPassword,
      plan: 'free',
      emailVerified: new Date(),
    },
  });

  const johnUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      password: johnPassword,
      plan: 'starter',
      walletAddress: '0x742d35Cc6634C0532925a3b8D29B5A33B3f7B0A5',
      emailVerified: new Date(),
    },
  });

  // Create sample documents
  const sampleDoc1 = await prisma.document.upsert({
    where: { id: 'sample-doc-1' },
    update: {},
    create: {
      id: 'sample-doc-1',
      title: 'Sample Contract Agreement',
      description: 'A sample contract for demonstration purposes',
      fileName: 'sample-contract.pdf',
      fileSize: 245760, // ~240KB
      fileType: 'application/pdf',
      ipfsHash: 'QmSampleHash1234567890AbCdEf',
      blockchainId: '0x1234567890abcdef',
      status: 'PENDING',
      creatorId: demoUser.id,
    },
  });

  const sampleDoc2 = await prisma.document.upsert({
    where: { id: 'sample-doc-2' },
    update: {},
    create: {
      id: 'sample-doc-2',
      title: 'NDA Agreement',
      description: 'Non-disclosure agreement template',
      fileName: 'nda-agreement.pdf',
      fileSize: 198400, // ~194KB
      fileType: 'application/pdf',
      ipfsHash: 'QmSampleHashNDA9876543210',
      blockchainId: '0xabcdef1234567890',
      status: 'COMPLETED',
      creatorId: johnUser.id,
    },
  });

  // Create sample signatures
  await prisma.signature.upsert({
    where: { id: 'sample-sig-1' },
    update: {},
    create: {
      id: 'sample-sig-1',
      status: 'PENDING',
      signerAddress: demoUser.email!,
      documentId: sampleDoc1.id,
      signerId: demoUser.id,
    },
  });

  await prisma.signature.upsert({
    where: { id: 'sample-sig-2' },
    update: {},
    create: {
      id: 'sample-sig-2',
      status: 'SIGNED',
      signerAddress: johnUser.walletAddress!,
      signedAt: new Date(),
      transactionHash: '0x9876543210fedcba',
      documentId: sampleDoc2.id,
      signerId: johnUser.id,
    },
  });

  // Create usage logs
  await prisma.usageLog.create({
    data: {
      userId: demoUser.id,
      action: 'document_upload',
      metadata: {
        documentId: sampleDoc1.id,
        fileName: 'sample-contract.pdf',
      },
    },
  });

  await prisma.usageLog.create({
    data: {
      userId: johnUser.id,
      action: 'document_sign',
      metadata: {
        documentId: sampleDoc2.id,
        transactionHash: '0x9876543210fedcba',
      },
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Created data:');
  console.log(`👤 Users: ${await prisma.user.count()}`);
  console.log(`📄 Documents: ${await prisma.document.count()}`);
  console.log(`✍️  Signatures: ${await prisma.signature.count()}`);
  console.log(`📈 Usage logs: ${await prisma.usageLog.count()}`);
  
  console.log('\n🔑 Demo Credentials:');
  console.log('Email: demo@quantpaychain.com | Password: demo123');
  console.log('Email: john@doe.com | Password: johndoe123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
