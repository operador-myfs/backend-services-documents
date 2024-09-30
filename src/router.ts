import { Router } from 'express';
import documentController from './controllers/document.controller';
import authorization from './middlewares/authorization';
import upload from './middlewares/upload';

const router = Router();

router.get('/actuator/health', documentController.healthcheck);
router.get('/document/', authorization, documentController.getDocumentsByUser);
router.post('/document/', upload.single('file'), authorization, documentController.uploadFile);
router.get('/document/:id', authorization, documentController.getDocumentById);
router.delete('/document/:id', authorization, documentController.deleteDocumentById);
router.get('/document/:key/url', authorization, documentController.getDocumentUrl);
router.post('/transferCitizen', documentController.transferCitizen);

export default router;
