// DB Class
import { MongoClient, ObjectId } from 'mongodb';

const { DB_HOST, DB_PORT, DB_DATABASE } = {
  // DB host
  DB_HOST: process.env.DB_HOST || 'localhost',
  // DB port
  DB_PORT: process.env.DB_PORT || 27017,
  // DB name
  DB_DATABASE: process.env.DB_DATABASE || 'files_manager',
};

/**
 * DBClient Class
 * @class DBClient class to handle database operations
 * @method isAlive() Check if the connection is established
 * @method nbUsers() Get the number of documents in the users collection
 * @method nbFiles() Get the number of documents in the files collection
 * @method getUserByEmail(email) Get user by email
 * @method createUser(user) Create a new user
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
          `Connection to DB established on ${DB_HOST}:${DB_PORT}`,
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
      this.client.topology
            && this.client.topology.isConnected()
            && this.db !== null
    );
  }

  // Get the number of documents in the users collection
  async nbUsers() {
    if (!this.db) return 0;
    try {
      return await this.db.collection('users').countDocuments();
    } catch (error) {
      console.error(`Error fetching users count: ${error.message}`);
      return 0;
    }
  }

  // Get the number of documents in the files collection
  async nbFiles() {
    if (!this.db) return 0;
    try {
      return await this.db.collection('files').countDocuments();
    } catch (error) {
      console.error(`Error fetching files count: ${error.message}`);
      return 0;
    }
  }

  async getUserByEmail(email) {
    if (!this.db) return 0;
    try {
      return await this.db.collection('users').findOne({ email });
    } catch (error) {
      console.error(`Error fetching user by email: ${error.message}`);
      return 0;
    }
  }

  async createUser(user) {
    if (!this.db) return 0;
    try {
      const result = await this.db.collection('users').insertOne(user);
      return result.ops[0];
    } catch (error) {
      console.error(`Error creating user: ${error.message}`);
      return 0;
    }
  }

  // Get user by id
  async getUserById(userId) {
    if (!this.db) return 0;
    try {
      return await this.db
        .collection('users')
        .findOne({ _id: new ObjectId(userId) });
    } catch (error) {
      console.error(`Error fetching user by id: ${error.message}`);
      return 0;
    }
  }

  // Upload a new file or folder to the DB
  async createFile(data) {
    if (!this.db) return 0;
    try {
      const result = await this.db.collection('files').insertOne(data);
      return result.insertedId;
    } catch (error) {
      console.error(`Error creating file: ${error.message}`);
      return 0;
    }
  }

  // Get file by id
  async getFileById(fileId) {
    if (!this.db) return 0;
    try {
      return await this.db
        .collection('files')
        .findOne({ _id: new ObjectId(fileId) });
    } catch (error) {
      console.error(`Error fetching file by id: ${error.message}`);
      return 0;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
