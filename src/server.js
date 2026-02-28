const createApp = require("./app");

createApp().then((app) => {
    app.listen(3000, () => console.log("http://localhost:3000"));
}).catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});