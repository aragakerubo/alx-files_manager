import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {
  // Create a new file or folder
  static async postUpload(req, res) {
    try {
      // Get the token from the headers
      const token = req.headers['x-token'];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Find the user ID associated to the token in Redis
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get the file information from the request
      const {
        name,
        type,
        parentId = 0,
        isPublic = false,
        data,
      } = req.body;

      // Validate file name
      if (!name) {
        return res.status(400).json({ error: 'Missing name' });
      }

      // Check if type is valid
      const acceptedTypes = ['folder', 'file', 'image'];
      if (!type || !acceptedTypes.includes(type)) {
        return res.status(400).json({ error: 'Missing type' });
      }

      // Check if data is provided for file or image
      if ((type === 'file' || type === 'image') && !data) {
        return res.status(400).json({ error: 'Missing data' });
      }

      // Check if parentId is valid if provided
      let parentFile = null;
      if (parentId !== 0) {
        parentFile = await dbClient.getFileById(parentId);
        if (!parentFile) {
          return res.status(400).json({ error: 'Parent not found' });
        }
        if (parentFile.type !== 'folder') {
          return res
            .status(400)
            .json({ error: 'Parent is not a folder' });
        }
      }

      // For folder type, just save in the DB and return response
      if (type === 'folder') {
        const newFile = {
          userId,
          name,
          type,
          isPublic,
          parentId,
        };

        const fileId = await dbClient.createFile(newFile);
        return res.status(201).json({ id: fileId, ...newFile });
      }

      // For file or image, save the file to disk
      const fileUUID = uuidv4();
      const filePath = path.join(folderPath, fileUUID);

      // Ensure the folder exists
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Save the file in clear (data is Base64 encoded)
      const fileContent = Buffer.from(data, 'base64');
      fs.writeFileSync(filePath, fileContent);

      // Save file information in DB
      const newFile = {
        userId,
        name,
        type,
        isPublic,
        parentId,
        localPath: filePath,
      };

      const fileId = await dbClient.createFile(newFile);
      newFile.id = fileId;  // Add the ID for the response
      delete newFile._id;   // Ensure _id is not included in the response

      // Return the newly created file
      return res.status(201).json(newFile);
    } catch (error) {
      console.error('Error in postUpload:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default FilesController;
