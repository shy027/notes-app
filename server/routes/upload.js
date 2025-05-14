import express from 'express';
import multer from 'multer';
import OSS from 'ali-oss';
import path from 'path';

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle avatar upload
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Return the file path
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;  // Change to default export
