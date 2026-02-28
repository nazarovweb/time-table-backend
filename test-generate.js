const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const academicController = require('./src/controllers/academic.controller');

async function main() {
    console.log('Running generator logic directly...');

    // Mock req/res
    const req = { body: { finalize: true } };
    const resMock = {
        json: (data) => {
            console.log('\n--- SUCCESS ---');
            console.log(`Lessons generated: ${data.count}`);
            if (data.logs && data.logs.length > 0) {
                console.log('\nLogs:');
                data.logs.forEach(l => console.log(`- ${l}`));
            }
        },
        status: (code) => ({
            json: (data) => console.error('\n--- ERROR ---', code, data)
        })
    };

    try {
        await academicController.generateTimetable(req, resMock);
    } catch (e) {
        console.error('Fatal error:', e);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
