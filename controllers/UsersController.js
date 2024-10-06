import crypto from 'crypto'; // Import crypto module for hashing
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

/**
 * Class representing the users controller
 * @class UsersController
 * @staticmethod postNew - Create a new user
 */
class UsersController {
  static async postNew(req, res) {
    // Get the email and password from the request body
    // console.log(req);
    const { email, password } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists in the DB
    try {
      const existingUser = await dbClient.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password using SHA1
      const hashedPassword = crypto
        .createHash('sha1')
        .update(password)
        .digest('hex');

      // Create the new user object
      const newUser = {
        email,
        password: hashedPassword,
      };

      // Save the new user to the database
      const savedUser = await dbClient.createUser(newUser);

      console.log('Saved user: ', savedUser);

      // Return the new user details
      return res
        .status(201)
        .json({ id: savedUser._id, email: savedUser.email });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getMe(req, res) {
    try {
      // Get the token from the request headers
      const token = req.headers['x-token'];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Find the user ID associated with the token in Redis
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Find the user in the database
      const user = await dbClient.getUserById(userId);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Return the user's email and ID
      return res.status(200).json({ id: user._id, email: user.email });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
