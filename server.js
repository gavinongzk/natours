const mongoose = require("mongoose")
const dotenv = require("dotenv");

process.on("uncaughtException", err => {
    console.log("Uncaught Exception! Shutting down")
    console.log(err);
    process.exit(1);
});


dotenv.config({path: "./config.env"});
const app = require("./app");


const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose
    .connect(DB, {
    useNewUrlParser: true
})
    .then( () => {console.log("DB connection successful!");});

// Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`server  running on port ${port}...`)
});

process.on("unhandledRejection", err => {
    console.log("Unhandled Rejection! Shutting down")
    console.log(err);
    server.close(() => {
        process.exit(1);
    })
});

process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully")
    server.close(() => {
        console.log("Process terminated")
    })
})