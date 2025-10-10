const path = require('path');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectDB } = require('./server/config/db');
const { requireAdmin, ADMIN_SECRET } = require('./server/middleware/admin');
const { upload, uploadsDir } = require('./server/middleware/upload');

const blogsRouter = require('./server/routes/blogs');
const projectsRouter = require('./server/routes/projects');
const researchRouter = require('./server/routes/research');
const recentWorksRouter = require('./server/routes/recent-works');
const testimonialsRouter = require('./server/routes/testimonials');

const PORT = process.env.PORT || 3000;
(async () => {
  await connectDB();
  const app = express();
  const corsOptions = {
    origin: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','x-admin-secret']
  };
  app.use(cors(corsOptions));
  app.use(express.json());
  // Handle preflight without wildcard routes (Express 5)
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });
  // Basic request logging to debug 405s
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Headers:`, req.headers);
    next();
  });

  // API routes
  app.get('/api/health', (req, res) => res.json({ ok: true }));
  // Admin verify route
  app.get('/api/admin/verify', requireAdmin, (req, res) => res.json({ ok: true }));

  // Generic image upload (for inline content images)
  app.post('/api/uploads', requireAdmin, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    // Handle both Cloudinary and local storage responses
    let imageUrl;
    if (req.file.path) {
      // Cloudinary response
      imageUrl = req.file.path;
    } else {
      // Local storage response
      imageUrl = `/uploads/${req.file.filename}`;
    }
    
    return res.status(201).json({ url: imageUrl });
  });
  app.use('/api/blogs', blogsRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/research', researchRouter);
  app.use('/api/recent-works', recentWorksRouter);
  app.use('/api/testimonials', testimonialsRouter);

  // Serve uploads
  app.use('/uploads', express.static(uploadsDir));
  // Serve frontend static files from project root
  app.use('/', express.static(path.join(__dirname)));
  // Explicit index route
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Admin secret set${ADMIN_SECRET ? '' : ' (missing!)'}`);
  });
})();

