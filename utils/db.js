// DB Class
import { MongoClient } from "mongodb";
import { DB_HOST, DB_PORT, DB_DATABASE } from "./config";

/**
 * DBClient Class
 * @class DBClient class to handle database operations
 * @method isAlive() Check if the connection is established
 * @method nbUsers() Get the number of documents in the users collection
 * @method nbFiles() Get the number of documents in the files collection
 */
class DBClient {
    constructor() {
        // Create a new MongoClient
        this.client = new MongoClient(`mongodb://${DB_HOST}:${DB_PORT}`, {
            useUnifiedTopology: true,
        });

        // Create a placeholder for the database
        this.db = null;

        // Handle connection to the database
        (async () => {
            try {
                await this.client.connect(); // Await the connection
                this.db = this.client.db(DB_DATABASE);
                console.log(
                    `Connection to DB established on ${DB_HOST}:${DB_PORT}`
                );
            } catch (error) {
                console.error(`MongoDB connection error: ${error.message}`);
                this.db = null;
            }
        })();
    }

    // Check if the connection is established
    isAlive() {
        return (
            this.client.topology &&
            this.client.topology.isConnected() &&
            this.db !== null
        );
    }

    // Get the number of documents in the users collection
    async nbUsers() {
        if (!this.db) return 0;
        try {
            return await this.db.collection("users").countDocuments();
        } catch (error) {
            console.error(`Error fetching users count: ${error.message}`);
            return 0;
        }
    }

    // Get the number of documents in the files collection
    async nbFiles() {
        if (!this.db) return 0;
        try {
            return await this.db.collection("files").countDocuments();
        } catch (error) {
            console.error(`Error fetching files count: ${error.message}`);
            return 0;
        }
    }
}

const dbClient = new DBClient();
export default dbClient;
