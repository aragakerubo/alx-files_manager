// RedisClient class
import redis from "redis";
import { promisify } from "util";

/**
 * RedisClient class
 * @class RedisClient class to manage the Redis client
 * @method isAlive method to check if the client is connected to the server
 * @method get async method to get the value of a key in Redis
 * @method set async method to set a value for a key in Redis
 * @method del async method to delete a key in Redis
 */
class RedisClient {
    constructor() {
        // Create a Redis client
        this.client = redis.createClient();

        // Handle errors
        this.client.on("error", (error) => {
            console.error(`Redis client error: ${error.message}`);
        });

        // Handle successful connection
        this.client.on("connect", () => {
            console.log("Redis client connected successfully.");
        });

        // Log when connection is ready
        this.client.on("ready", () => {
            console.log("Redis client is ready to use.");
        });

        // Log disconnections
        this.client.on("end", () => {
            console.log("Redis client disconnected.");
        });

        // Promisify the Redis client methods for cleaner asynchronous handling
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);
    }

    // Function to check if Redis connection is alive
    isAlive() {
        return this.client.connected;
    }

    // Asynchronous function to get the value of a key
    async get(key) {
        try {
            return await this.getAsync(key);
        } catch (error) {
            console.error(`Error getting key ${key}: ${error.message}`);
            return null;
        }
    }

    // Asynchronous function to set a key-value pair with an expiration time
    async set(key, value, duration) {
        try {
            await this.setAsync(key, value, "EX", duration);
        } catch (error) {
            console.error(`Error setting key ${key}: ${error.message}`);
        }
    }

    // Asynchronous function to delete a key
    async del(key) {
        try {
            await this.delAsync(key);
        } catch (error) {
            console.error(`Error deleting key ${key}: ${error.message}`);
        }
    }
}

const redisClient = new RedisClient();
export default redisClient;
