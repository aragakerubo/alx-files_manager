import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  // Sign in the user and return the token
  static async getConnect(req, res) {
    try {
      // Check if the request has an Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Decode Base64 to get email:password
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(
        base64Credentials,
        'base64',
      ).toString('utf-8');
      const [email, password] = credentials.split(':');

      // Check if the email and password are provided
      if (!email || !password) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Hash the password using SHA1
      const hashedPassword = crypto
        .createHash('sha1')
        .update(password)
        .digest('hex');

      // Find the user in the database
      const user = await dbClient.getUserByEmail(email);
      if (!user || user.password !== hashedPassword) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Generate a token
      const token = uuidv4();

      // Store the user ID with the token in Redis (for 24 hours)
      await redisClient.set(`auth_${token}`, user._id.toString(), 86400);

      // Return the token
      return res.status(200).json({ token });
    } catch (error) {
      console.log('Error connecting the user', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // Sign out the user by invalidating the token
  static async getDisconnect(req, res) {
    try {
      // Get the token from the X-Token header
      const token = req.headers['x-token'];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Find the token in Redis and delete it
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Delete the token from Redis
      await redisClient.del(`auth_${token}`);

      // Return 204 No Content
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  }
}

export default AuthController;
