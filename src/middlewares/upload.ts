import multer from 'multer';

// Configuración de Multer para almacenar el archivo en memoria antes de subirlo a S3
const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

export default upload;
