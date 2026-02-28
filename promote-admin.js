const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.users.update({
        where: { user_id: 3 },
        data: { role: 'ADMIN' }
    });
    console.log(`Updated user ${user.email} to ADMIN`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
