const { Prisma } = require("@prisma/client");
const prisma = require("./prisma");

// Helper to get DMMF model definition by name
function getDmmfModel(name) {
    return Prisma.dmmf.datamodel.models.find((m) => m.name === name);
}

async function buildAdminRouter() {
    // Dynamic imports for ESM-only AdminJS packages
    const { default: AdminJS } = await import("adminjs");
    const AdminJSExpress = await import("@adminjs/express");
    const { Database, Resource } = await import("@adminjs/prisma");

    // Prisma adapter ro'yxatdan o'tkazamiz
    AdminJS.registerAdapter({ Database, Resource });

    const admin = new AdminJS({
        rootPath: "/admin",
        resources: [
            {
                resource: { model: getDmmfModel("rooms"), client: prisma },
                options: { navigation: { name: "Ma'lumotlar" } },
            },
            {
                resource: { model: getDmmfModel("lessons"), client: prisma },
                options: { navigation: { name: "Ma'lumotlar" } },
            },
            {
                resource: { model: getDmmfModel("techers"), client: prisma },
                options: { navigation: { name: "Ma'lumotlar" } },
            },
            {
                resource: { model: getDmmfModel("groups"), client: prisma },
                options: { navigation: { name: "Ma'lumotlar" } },
            },
            {
                resource: { model: getDmmfModel("schedule"), client: prisma },
                options: { navigation: { name: "Ma'lumotlar" } },
            },
            {
                resource: { model: getDmmfModel("users"), client: prisma },
                options: { navigation: { name: "Foydalanuvchilar" } },
            },
        ],
    });

    // AdminJS frontend assets ni bundle qilish
    await admin.initialize();

    // Eng oddiy login (hardcode) — tez start uchun
    const ADMIN = {
        email: process.env.ADMIN_EMAIL || "admin@mail.com",
        password: process.env.ADMIN_PASSWORD || "123456",
    };

    const router = AdminJSExpress.buildAuthenticatedRouter(
        admin,
        {
            authenticate: async (email, password) => {
                if (email === ADMIN.email && password === ADMIN.password) {
                    return { email };
                }
                return null;
            },
            cookiePassword: process.env.ADMIN_COOKIE_SECRET || "cookie-secret-123",
        },
        null,
        {
            resave: false,
            saveUninitialized: true,
            secret: process.env.SESSION_SECRET || "session-secret-123",
            cookie: { httpOnly: true },
        }
    );

    return { admin, router };
}

module.exports = buildAdminRouter;