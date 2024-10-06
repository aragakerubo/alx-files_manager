import redisClient from '../utils/redis'; // Import Redis utility
import dbClient from '../utils/db'; // Import DB utility

class AppController {
  // Handles the /status endpoint
  static async getStatus(req, res) {
    const redisAlive = redisClient.isAlive(); // Check if Redis is alive
    const dbAlive = await dbClient.isAlive(); // Check if DB is alive
    res.status(200).json({ redis: redisAlive, db: dbAlive });
  }

  // Handles the /stats endpoint
  static async getStats(req, res) {
    const usersCount = await dbClient.nbUsers(); // Get the number of users from the DB
    const filesCount = await dbClient.nbFiles(); // Get the number of files from the DB
    res.status(200).json({ users: usersCount, files: filesCount });
  }
}

export default AppController;
