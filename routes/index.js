import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const router = express.Router();

// Define routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect); // Login endpoint
router.get('/disconnect', AuthController.getDisconnect); // Logout endpoint
router.get('/users/me', UsersController.getMe); // Get current user endpoint
router.post('/files', FilesController.postUpload); // Upload file endpoint

// Export the router so it can be used in the server
export default router;
