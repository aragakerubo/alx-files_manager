import express from 'express';
import AppController from '../controllers/AppController';

const router = express.Router();

// Define routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Export the router so it can be used in the server
export default router;
