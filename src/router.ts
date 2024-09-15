import { Router } from 'express';
import documentController from './controllers/document.controller';
import authorization from './middlewares/authorization';
import upload from './middlewares/upload';

const router = Router();

router.get('/healthcheck', authorization, documentController.healthcheck);
router.get('/', authorization, documentController.getDocumentsByUser);
router.post('/', upload.single('file'), authorization, documentController.uploadFile);
router.get('/:id', authorization, documentController.getDocumentById);
router.delete('/:id', authorization, documentController.deleteDocumentById);
router.get('/:key/url', authorization, documentController.getDocumentUrl);

export default router;
