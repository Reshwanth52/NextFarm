const app = require('./app');
const { connectDatabase } = require('./config/database');


// Handling Uncaught Exception
process.on("uncaughtException",error=>{
    console.log(`Error: ${error.message}`);
    console.log(`Shutting down the server due to Uncaught Exception Promise Rejection`);
    process.exit(1);
})

connectDatabase();

const server = app.listen(process.env.PORT, ()=>{
    console.log("backend is working");
})


// unhandled promise rejection

process.on("unhandledRejection",error=>{
    console.log(`Error: ${error.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1);
    });
})