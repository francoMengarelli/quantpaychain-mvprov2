// QuantPayChain - Seed Script
// Populates database with sample properties, users, and investments

import { PrismaClient, PropertyType, PropertyStatus, InvestmentStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data (development only)
  console.log('🧹 Cleaning existing data...');
  await prisma.contractSignature.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.investment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.property.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.aIAudit.deleteMany();
  await prisma.signature.deleteMany();
  await prisma.document.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  console.log('👥 Creating users...');
  
  const hashedPassword = await bcrypt.hash('Demo1234!', 10);

  const investor1 = await prisma.user.create({
    data: {
      email: 'investor@quantpay.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Investor',
      name: 'John Investor',
      emailVerified: new Date(),
      kycVerified: true,
      kycLevel: 'full',
      country: 'United States',
      phoneNumber: '+1234567890',
    },
  });

  const investor2 = await prisma.user.create({
    data: {
      email: 'maria@quantpay.com',
      password: hashedPassword,
      firstName: 'Maria',
      lastName: 'Rodriguez',
      name: 'Maria Rodriguez',
      emailVerified: new Date(),
      kycVerified: true,
      kycLevel: 'basic',
      country: 'Spain',
    },
  });

  const developer = await prisma.user.create({
    data: {
      email: 'developer@quantpay.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Developer',
      name: 'Sarah Developer',
      emailVerified: new Date(),
      kycVerified: true,
      kycLevel: 'full',
      country: 'United Kingdom',
    },
  });

  console.log('✅ Users created');

  // Create sample properties
  console.log('🏢 Creating properties...');

  const property1 = await prisma.property.create({
    data: {
      title: 'Luxury Beachfront Condo - Miami Beach',
      description: `Premium oceanfront condominium in the heart of Miami Beach. This stunning 2-bedroom, 2-bathroom unit offers breathtaking views of the Atlantic Ocean and direct beach access.

      **Property Highlights:**
      - Prime location on Collins Avenue
      - 24/7 concierge and security
      - State-of-the-art fitness center and spa
      - Rooftop infinity pool with panoramic views
      - High rental demand from tourists
      - Fully furnished and turnkey ready

      **Investment Opportunity:**
      This property is part of a successful short-term rental program with an average occupancy rate of 85%. The building management handles all operations, making this a truly passive investment.

      **Market Analysis:**
      Miami Beach real estate has shown consistent appreciation of 8-12% annually over the past 5 years. The tourism industry continues to thrive, ensuring stable rental income.`,
      propertyType: PropertyType.RESIDENTIAL,
      status: PropertyStatus.FUNDING,
      address: '4821 Collins Avenue, Unit 1205',
      city: 'Miami Beach',
      state: 'Florida',
      country: 'United States',
      zipCode: '33140',
      coordinates: { lat: 25.8194, lng: -80.1221 },
      totalValue: 850000,
      minimumInvestment: 5000,
      targetAmount: 850000,
      raisedAmount: 425000,
      tokenPrice: 100,
      totalTokens: 8500,
      availableTokens: 4250,
      area: 120,
      bedrooms: 2,
      bathrooms: 2,
      yearBuilt: 2019,
      expectedReturn: 12.5,
      investmentPeriod: 60,
      rentalYield: 8.5,
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      ],
      virtualTourUrl: 'https://www.example.com/tour/miami-beach-1205',
      fundingDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    },
  });

  const property2 = await prisma.property.create({
    data: {
      title: 'Modern Office Building - Downtown Austin',
      description: `Class A office building in the thriving tech hub of Austin, Texas. This 12-story mixed-use building features premium office spaces with retail on the ground floor.

      **Property Highlights:**
      - Located in the heart of downtown Austin
      - 98% occupancy rate
      - Long-term corporate tenants (5-10 year leases)
      - LEED Gold certified building
      - On-site parking garage
      - Excellent public transportation access

      **Tenant Profile:**
      Current tenants include major tech companies, law firms, and financial services. Average lease term is 7 years, providing stable, predictable cash flow.

      **Growth Potential:**
      Austin's population has grown 20% in the last decade, and it's consistently ranked as one of the best cities for business in the U.S. Office rents in this area have increased 15% over the past 3 years.`,
      propertyType: PropertyType.COMMERCIAL,
      status: PropertyStatus.FUNDING,
      address: '501 Congress Avenue',
      city: 'Austin',
      state: 'Texas',
      country: 'United States',
      zipCode: '78701',
      coordinates: { lat: 30.2672, lng: -97.7431 },
      totalValue: 12500000,
      minimumInvestment: 10000,
      targetAmount: 12500000,
      raisedAmount: 8750000,
      tokenPrice: 500,
      totalTokens: 25000,
      availableTokens: 7500,
      area: 8500,
      yearBuilt: 2018,
      expectedReturn: 10.8,
      investmentPeriod: 84,
      rentalYield: 7.2,
      images: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
        'https://images.unsplash.com/photo-1497366216548-37526070297c',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
        'https://images.unsplash.com/photo-1497215842964-222b430dc094',
      ],
      virtualTourUrl: 'https://www.example.com/tour/austin-office-501',
      fundingDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const property3 = await prisma.property.create({
    data: {
      title: 'Sustainable Urban Apartments - Brooklyn, NY',
      description: `Eco-friendly residential complex with 24 modern apartments in trendy Williamsburg, Brooklyn. This green building sets new standards for sustainable urban living.

      **Property Highlights:**
      - Solar panels covering 80% of energy needs
      - Rainwater harvesting system
      - Green roofs and urban gardens
      - EV charging stations
      - Smart home technology in all units
      - Walking distance to subway (L train)

      **Rental Market:**
      Brooklyn's Williamsburg neighborhood is one of NYC's hottest rental markets. These apartments attract environmentally conscious millennials and young professionals willing to pay premium rents for sustainable living.

      **Environmental Certifications:**
      - LEED Platinum
      - Energy Star Certified
      - NYC Green Building Standard

      **Financial Performance:**
      Current market rents: $3,500-$4,500/month. Expected occupancy: 95%+. This area has seen rental growth of 6-8% annually.`,
      propertyType: PropertyType.RESIDENTIAL,
      status: PropertyStatus.FUNDING,
      address: '287 Bedford Avenue',
      city: 'Brooklyn',
      state: 'New York',
      country: 'United States',
      zipCode: '11211',
      coordinates: { lat: 40.7141, lng: -73.9614 },
      totalValue: 9800000,
      minimumInvestment: 7500,
      targetAmount: 9800000,
      raisedAmount: 3920000,
      tokenPrice: 250,
      totalTokens: 39200,
      availableTokens: 23520,
      area: 3200,
      bedrooms: 48, // total across all units
      bathrooms: 48,
      yearBuilt: 2022,
      expectedReturn: 11.2,
      investmentPeriod: 72,
      rentalYield: 7.8,
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
        'https://images.unsplash.com/photo-1460317442991-0ec209397118',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
      ],
      fundingDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
  });

  const property4 = await prisma.property.create({
    data: {
      title: 'Boutique Hotel - Tulum, Mexico',
      description: `Charming 12-room boutique hotel in the paradise of Tulum, Mexico. This eco-luxury property combines modern amenities with Mayan-inspired architecture and beach club access.

      **Property Highlights:**
      - Beachfront location in Tulum's hotel zone
      - Private beach club membership included
      - On-site restaurant featuring local cuisine
      - Yoga studio and wellness center
      - Average occupancy rate: 88%
      - Premium nightly rates: $350-$650

      **Business Model:**
      Managed by an experienced hospitality group with a track record of successful boutique hotel operations. Revenue comes from room bookings, restaurant, spa services, and special events.

      **Market Position:**
      Tulum has become one of the world's top luxury travel destinations. International tourism to the area has grown 25% year-over-year, with no signs of slowing down.

      **Expansion Opportunity:**
      There's potential to add 8 more bungalows on the adjacent plot, which could increase annual revenue by 40%.`,
      propertyType: PropertyType.COMMERCIAL,
      status: PropertyStatus.FUNDING,
      address: 'Carretera Tulum-Boca Paila Km 7',
      city: 'Tulum',
      state: 'Quintana Roo',
      country: 'Mexico',
      zipCode: '77780',
      coordinates: { lat: 20.2114, lng: -87.4654 },
      totalValue: 4500000,
      minimumInvestment: 5000,
      targetAmount: 4500000,
      raisedAmount: 2250000,
      tokenPrice: 150,
      totalTokens: 30000,
      availableTokens: 15000,
      area: 2800,
      bedrooms: 12,
      bathrooms: 12,
      yearBuilt: 2020,
      expectedReturn: 14.5,
      investmentPeriod: 60,
      rentalYield: 10.2,
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      ],
      virtualTourUrl: 'https://www.example.com/tour/tulum-hotel',
      fundingDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    },
  });

  const property5 = await prisma.property.create({
    data: {
      title: 'Smart Warehouse & Logistics Center - New Jersey',
      description: `State-of-the-art logistics facility strategically located near major highways and ports. This 150,000 sq ft warehouse is equipped with advanced automation and climate control systems.

      **Property Highlights:**
      - 30-foot clear heights
      - 20 loading docks with levelers
      - ESFR sprinkler system
      - LED lighting throughout
      - 24/7 security and monitoring
      - Adjacent to I-95 and Port of Newark

      **Tenant & Lease:**
      Leased to a Fortune 500 logistics company on a 15-year triple-net lease. Tenant is responsible for all operating expenses, property taxes, and insurance. Includes 3% annual rent escalations.

      **Strategic Location:**
      The property is in the heart of one of the busiest logistics corridors in North America. E-commerce growth has driven unprecedented demand for industrial space in this area.

      **Investment Stability:**
      Triple-net leases with creditworthy tenants provide stable, predictable cash flows with minimal landlord responsibilities. Industrial properties have been the top-performing real estate sector for the past 5 years.`,
      propertyType: PropertyType.INDUSTRIAL,
      status: PropertyStatus.FUNDING,
      address: '1850 Lower Road',
      city: 'Linden',
      state: 'New Jersey',
      country: 'United States',
      zipCode: '07036',
      coordinates: { lat: 40.6218, lng: -74.2446 },
      totalValue: 22000000,
      minimumInvestment: 15000,
      targetAmount: 22000000,
      raisedAmount: 11000000,
      tokenPrice: 1000,
      totalTokens: 22000,
      availableTokens: 11000,
      area: 13935, // 150,000 sq ft in sqm
      yearBuilt: 2021,
      expectedReturn: 9.5,
      investmentPeriod: 120,
      rentalYield: 6.8,
      images: [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d',
        'https://images.unsplash.com/photo-1553413077-190dd305871c',
        'https://images.unsplash.com/photo-1565610222536-ef125c59da2e',
        'https://images.unsplash.com/photo-1582909618828-9f04e1f1f1f1',
      ],
      fundingDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    },
  });

  const property6 = await prisma.property.create({
    data: {
      title: 'Luxury Mountain Resort Villas - Aspen, Colorado',
      description: `Exclusive collection of 8 luxury villas in Aspen's most prestigious ski-in/ski-out development. These mountain retreats offer unparalleled access to world-class skiing and year-round outdoor activities.

      **Property Highlights:**
      - Direct ski-in/ski-out access
      - Private hot tubs and fire pits
      - Gourmet kitchens with high-end appliances
      - Concierge services and housekeeping
      - Summer activities: hiking, mountain biking, fly fishing
      - Winter activities: skiing, snowboarding, snowshoeing

      **Rental Program:**
      Professionally managed short-term rental program. Peak season (December-March): $2,500-$5,000/night. Summer season: $1,500-$2,500/night. Average annual occupancy: 70%.

      **Market Dynamics:**
      Aspen remains one of the most desirable luxury vacation destinations in North America. Limited new construction and strong demand from high-net-worth individuals ensure property value appreciation.

      **Ownership Benefits:**
      Investors receive 30 days of personal use annually (subject to availability) and preferential booking rates.`,
      propertyType: PropertyType.RESIDENTIAL,
      status: PropertyStatus.FUNDING,
      address: '0239 Snowmass Club Circle',
      city: 'Aspen',
      state: 'Colorado',
      country: 'United States',
      zipCode: '81611',
      coordinates: { lat: 39.1911, lng: -106.8175 },
      totalValue: 18500000,
      minimumInvestment: 20000,
      targetAmount: 18500000,
      raisedAmount: 5550000,
      tokenPrice: 500,
      totalTokens: 37000,
      availableTokens: 26100,
      area: 1600,
      bedrooms: 32, // across all villas
      bathrooms: 32,
      yearBuilt: 2019,
      expectedReturn: 13.8,
      investmentPeriod: 96,
      rentalYield: 9.5,
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
      ],
      virtualTourUrl: 'https://www.example.com/tour/aspen-villas',
      fundingDeadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
    },
  });

  const property7 = await prisma.property.create({
    data: {
      title: 'Tech Campus Office Park - Silicon Valley',
      description: `Modern tech campus featuring multiple buildings designed for technology companies. Located in the heart of Silicon Valley with proximity to major tech giants.

      **Property Highlights:**
      - 5 interconnected buildings
      - Collaborative outdoor spaces
      - On-site cafeteria and coffee shops
      - Fitness center and game rooms
      - EV charging infrastructure
      - Gigabit fiber internet
      - Walking distance to Caltrain station

      **Tenant Mix:**
      Currently houses a mix of established tech companies and high-growth startups. Flexible floor plans accommodate various company sizes and growth trajectories.

      **Location Advantage:**
      Silicon Valley remains the global epicenter of technology innovation. Despite remote work trends, premium office space with top amenities continues to command premium rates.

      **Future Development:**
      Zoning allows for an additional 50,000 sq ft expansion, providing significant value-add opportunity.`,
      propertyType: PropertyType.COMMERCIAL,
      status: PropertyStatus.ACTIVE,
      address: '2800 Sand Hill Road',
      city: 'Menlo Park',
      state: 'California',
      country: 'United States',
      zipCode: '94025',
      coordinates: { lat: 37.4419, lng: -122.2079 },
      totalValue: 45000000,
      minimumInvestment: 25000,
      targetAmount: 45000000,
      raisedAmount: 45000000,
      tokenPrice: 2500,
      totalTokens: 18000,
      availableTokens: 0,
      area: 15000,
      yearBuilt: 2020,
      expectedReturn: 11.5,
      investmentPeriod: 120,
      rentalYield: 7.5,
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
      ],
      fundingDeadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Already funded
    },
  });

  const property8 = await prisma.property.create({
    data: {
      title: 'Student Housing Complex - Ann Arbor, Michigan',
      description: `Purpose-built student housing adjacent to University of Michigan campus. This 120-unit complex offers modern amenities and is consistently fully occupied.

      **Property Highlights:**
      - Walking distance to campus (5 minutes)
      - Fully furnished units
      - Study lounges on each floor
      - Game room and media center
      - Fitness center
      - Secure bike storage
      - Individual leases by bedroom

      **Occupancy & Revenue:**
      100% occupied for 18 consecutive semesters. Individual bedroom leases reduce vacancy risk. Students sign 12-month leases with parental guarantees.

      **Market Analysis:**
      University of Michigan enrollment continues to grow, with housing demand far exceeding supply. Purpose-built student housing significantly outperforms traditional rental apartments.

      **Management:**
      Professional student housing management company handles all operations, including leasing, maintenance, and programming.`,
      propertyType: PropertyType.RESIDENTIAL,
      status: PropertyStatus.FUNDING,
      address: '1050 South University Avenue',
      city: 'Ann Arbor',
      state: 'Michigan',
      country: 'United States',
      zipCode: '48104',
      coordinates: { lat: 42.2760, lng: -83.7382 },
      totalValue: 16000000,
      minimumInvestment: 8000,
      targetAmount: 16000000,
      raisedAmount: 9600000,
      tokenPrice: 400,
      totalTokens: 40000,
      availableTokens: 16000,
      area: 9000,
      bedrooms: 360, // 120 units x 3 bedrooms average
      bathrooms: 240,
      yearBuilt: 2021,
      expectedReturn: 10.5,
      investmentPeriod: 84,
      rentalYield: 8.8,
      images: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        'https://images.unsplash.com/photo-1574362848149-11496d93a7c7',
      ],
      fundingDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Properties created');

  // Create sample investments
  console.log('💰 Creating investments...');

  const payment1 = await prisma.payment.create({
    data: {
      userId: investor1.id,
      amount: 50000,
      currency: 'USD',
      method: PaymentMethod.STRIPE,
      status: PaymentStatus.COMPLETED,
      stripePaymentIntentId: 'pi_mock_' + Math.random().toString(36).substr(2, 9),
      description: 'Investment in Miami Beach Condo',
      completedAt: new Date(),
    },
  });

  const investment1 = await prisma.investment.create({
    data: {
      userId: investor1.id,
      propertyId: property1.id,
      amount: 50000,
      tokensOwned: 500,
      ownership: 5.88,
      status: InvestmentStatus.CONFIRMED,
      paymentId: payment1.id,
      blockchainTxHash: '0x' + Math.random().toString(36).substr(2, 64),
      confirmedAt: new Date(),
    },
  });

  const payment2 = await prisma.payment.create({
    data: {
      userId: investor2.id,
      amount: 25000,
      currency: 'USD',
      method: PaymentMethod.CRYPTO_USDC,
      status: PaymentStatus.COMPLETED,
      cryptoAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      cryptoTxHash: '0x' + Math.random().toString(36).substr(2, 64),
      cryptoNetwork: 'ethereum',
      description: 'Investment in Austin Office Building',
      completedAt: new Date(),
    },
  });

  const investment2 = await prisma.investment.create({
    data: {
      userId: investor2.id,
      propertyId: property2.id,
      amount: 25000,
      tokensOwned: 50,
      ownership: 0.20,
      status: InvestmentStatus.CONFIRMED,
      paymentId: payment2.id,
      blockchainTxHash: '0x' + Math.random().toString(36).substr(2, 64),
      confirmedAt: new Date(),
    },
  });

  // Create a pending investment
  const payment3 = await prisma.payment.create({
    data: {
      userId: investor1.id,
      amount: 15000,
      currency: 'USD',
      method: PaymentMethod.STRIPE,
      status: PaymentStatus.PENDING,
      stripePaymentIntentId: 'pi_mock_' + Math.random().toString(36).substr(2, 9),
      stripeClientSecret: 'pi_mock_secret_' + Math.random().toString(36).substr(2, 16),
      description: 'Investment in Brooklyn Apartments',
    },
  });

  await prisma.investment.create({
    data: {
      userId: investor1.id,
      propertyId: property3.id,
      amount: 15000,
      tokensOwned: 60,
      ownership: 0.15,
      status: InvestmentStatus.PENDING,
      paymentId: payment3.id,
    },
  });

  console.log('✅ Investments created');

  // Create sample notifications
  console.log('🔔 Creating notifications...');

  await prisma.notification.create({
    data: {
      userId: investor1.id,
      type: 'INVESTMENT_CONFIRMED',
      title: 'Investment Confirmed',
      message: 'Your investment in Luxury Beachfront Condo - Miami Beach has been confirmed! You now own 500 tokens.',
      read: false,
      actionUrl: '/dashboard/investments',
    },
  });

  await prisma.notification.create({
    data: {
      userId: investor2.id,
      type: 'PAYMENT_RECEIVED',
      title: 'Payment Received',
      message: 'We have received your payment of $25,000 USDC for the Austin Office Building investment.',
      read: true,
      readAt: new Date(),
      actionUrl: '/dashboard/payments',
    },
  });

  await prisma.notification.create({
    data: {
      userId: investor1.id,
      type: 'PROPERTY_FUNDED',
      title: 'Property Fully Funded',
      message: 'Great news! The Tech Campus Office Park in Silicon Valley has been fully funded and is now active.',
      read: false,
      actionUrl: `/properties/${property7.id}`,
    },
  });

  console.log('✅ Notifications created');

  // Create usage logs
  console.log('📊 Creating usage logs...');

  await prisma.usageLog.createMany({
    data: [
      {
        userId: investor1.id,
        action: 'investment_created',
        metadata: { propertyId: property1.id, amount: 50000 },
      },
      {
        userId: investor2.id,
        action: 'investment_created',
        metadata: { propertyId: property2.id, amount: 25000 },
      },
      {
        userId: investor1.id,
        action: 'profile_updated',
        metadata: { fields: ['phoneNumber', 'country'] },
      },
    ],
  });

  console.log('✅ Usage logs created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`  - ${await prisma.user.count()} users created`);
  console.log(`  - ${await prisma.property.count()} properties created`);
  console.log(`  - ${await prisma.investment.count()} investments created`);
  console.log(`  - ${await prisma.payment.count()} payments created`);
  console.log(`  - ${await prisma.notification.count()} notifications created`);
  console.log('\n👤 Demo Login Credentials:');
  console.log('  Email: investor@quantpay.com');
  console.log('  Password: Demo1234!');
  console.log('\n🚀 Ready to start the application!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
