const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const specs = await prisma.specializations.findMany();
    console.log('Specializations:');
    specs.forEach(s => console.log(`ID: ${s.specialization_id}, Name: ${s.name}`));

    const groups = await prisma.groups.findMany();
    console.log('\nGroups:');
    groups.forEach(g => console.log(`ID: ${g.group_id}, Number: ${g.group_number}, SpecID: ${g.specialization_id}, Sem: ${g.semester}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
