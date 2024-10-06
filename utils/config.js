// Configurations for the application
export default {
    // DB host
    DB_HOST: process.env.DB_HOST || "localhost",
    // DB port
    DB_PORT: process.env.DB_PORT || 27017,
    // DB name
    DB_DATABASE: process.env.DB_DATABASE || "files_manager",
};
