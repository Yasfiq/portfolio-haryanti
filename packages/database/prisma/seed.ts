import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create sample clients/workplaces
    const clients = await Promise.all([
        prisma.client.upsert({
            where: { slug: 'hotel-santika' },
            update: {},
            create: {
                name: 'Hotel Santika',
                slug: 'hotel-santika',
                description: 'Hotel chain brand identity and marketing materials',
                order: 1,
                isVisible: true,
            },
        }),
        prisma.client.upsert({
            where: { slug: 'kopi-kenangan' },
            update: {},
            create: {
                name: 'Kopi Kenangan',
                slug: 'kopi-kenangan',
                description: 'Coffee shop social media and packaging design',
                order: 2,
                isVisible: true,
            },
        }),
        prisma.client.upsert({
            where: { slug: 'tokopedia' },
            update: {},
            create: {
                name: 'Tokopedia',
                slug: 'tokopedia',
                description: 'E-commerce UI/UX design and marketing campaigns',
                order: 3,
                isVisible: true,
            },
        }),
        prisma.client.upsert({
            where: { slug: 'freelance-projects' },
            update: {},
            create: {
                name: 'Freelance Projects',
                slug: 'freelance-projects',
                description: 'Various freelance design projects',
                order: 4,
                isVisible: true,
            },
        }),
    ]);

    console.log(`✅ Created ${clients.length} clients`);

    // Create sample categories
    const categories = await Promise.all([
        prisma.projectCategory.upsert({
            where: { slug: 'brand-identity' },
            update: {},
            create: {
                name: 'Brand Identity',
                slug: 'brand-identity',
                order: 1,
            },
        }),
        prisma.projectCategory.upsert({
            where: { slug: 'social-media' },
            update: {},
            create: {
                name: 'Social Media',
                slug: 'social-media',
                order: 2,
            },
        }),
        prisma.projectCategory.upsert({
            where: { slug: 'ui-ux-design' },
            update: {},
            create: {
                name: 'UI/UX Design',
                slug: 'ui-ux-design',
                order: 3,
            },
        }),
        prisma.projectCategory.upsert({
            where: { slug: 'packaging' },
            update: {},
            create: {
                name: 'Packaging',
                slug: 'packaging',
                order: 4,
            },
        }),
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Create sample projects
    const projects = await Promise.all([
        prisma.project.upsert({
            where: { slug: 'hotel-santika-rebranding' },
            update: {},
            create: {
                title: 'Hotel Santika Rebranding',
                slug: 'hotel-santika-rebranding',
                projectDate: new Date('2024-06-15'),
                summary: 'Complete brand identity redesign for Hotel Santika chain, including logo, stationery, and signage.',
                thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                isVisible: true,
                order: 1,
                clientId: clients[0].id,
                categoryId: categories[0].id,
            },
        }),
        prisma.project.upsert({
            where: { slug: 'kopi-kenangan-social-campaign' },
            update: {},
            create: {
                title: 'Kopi Kenangan Social Campaign',
                slug: 'kopi-kenangan-social-campaign',
                projectDate: new Date('2024-04-20'),
                summary: 'Social media content strategy and design for monthly campaign #KopiKenanganMoment.',
                thumbnailUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
                isVisible: true,
                order: 2,
                clientId: clients[1].id,
                categoryId: categories[1].id,
            },
        }),
        prisma.project.upsert({
            where: { slug: 'tokopedia-seller-dashboard' },
            update: {},
            create: {
                title: 'Tokopedia Seller Dashboard',
                slug: 'tokopedia-seller-dashboard',
                projectDate: new Date('2024-02-10'),
                summary: 'UI/UX redesign for Tokopedia seller dashboard, improving usability for 2M+ sellers.',
                thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
                isVisible: true,
                order: 3,
                clientId: clients[2].id,
                categoryId: categories[2].id,
            },
        }),
        prisma.project.upsert({
            where: { slug: 'kopi-kenangan-packaging' },
            update: {},
            create: {
                title: 'Kopi Kenangan Packaging',
                slug: 'kopi-kenangan-packaging',
                projectDate: new Date('2024-03-05'),
                summary: 'Sustainable packaging design for new product line with eco-friendly materials.',
                thumbnailUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
                isVisible: true,
                order: 4,
                clientId: clients[1].id,
                categoryId: categories[3].id,
            },
        }),
        prisma.project.upsert({
            where: { slug: 'wedding-invitation-design' },
            update: {},
            create: {
                title: 'Elegant Wedding Invitation',
                slug: 'wedding-invitation-design',
                projectDate: new Date('2024-01-15'),
                summary: 'Custom wedding invitation suite with floral illustrations and gold foil details.',
                thumbnailUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
                isVisible: true,
                order: 5,
                clientId: clients[3].id,
                categoryId: categories[0].id,
            },
        }),
    ]);

    console.log(`✅ Created ${projects.length} projects`);

    console.log('🎉 Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
