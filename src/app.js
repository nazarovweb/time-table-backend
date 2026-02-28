const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const buildAdminRouter = require("./admin");
const cors = require("cors");

async function createApp() {
    const app = express();
    app.use(express.json());
    app.use(cors());
    // AdminJS (async because of ESM dynamic imports)
    const { admin, router } = await buildAdminRouter();
    app.use(admin.options.rootPath, router);

    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use("/rooms", require("./routes/rooms.routes"));
    app.use("/teachers", require("./routes/teachers.routes"));
    app.use("/groups", require("./routes/groups.routes"));
    app.use("/lessons", require("./routes/lesson.routes"));
    app.use("/schedule", require("./routes/schedule.routes"));
    app.use("/auth", require("./routes/auth.routes"));
    app.use("/academic", require("./routes/academic.routes"));

    return app;
}

module.exports = createApp;