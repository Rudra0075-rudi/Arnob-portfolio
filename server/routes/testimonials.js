const express = require('express');
const Testimonial = require('../models/Testimonial');
const { requireAdmin } = require('../middleware/admin');
const { upload } = require('../middleware/upload');

const router = express.Router();
const fs = require('fs');
const path = require('path');
const { uploadsDir } = require('../middleware/upload');

function deleteLocalUploadIfExists(url) {
  if (!url || typeof url !== 'string') return;
  const marker = '/uploads/';
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  let filePart = url.slice(idx + marker.length);
  filePart = filePart.split('?')[0].split('#')[0];
  try { filePart = decodeURIComponent(filePart); } catch {}
  const base = path.basename(filePart);
  const abs = path.join(uploadsDir, base);
  const exists = fs.existsSync(abs);
  if (!exists) {
    console.warn('[deleteLocalUploadIfExists] File not found for URL:', url, 'resolved:', abs);
    return;
  }
  try {
    fs.unlinkSync(abs);
    console.log('[deleteLocalUploadIfExists] Deleted:', abs);
  } catch (e) {
    console.warn('[deleteLocalUploadIfExists] Failed to delete', abs, e.message);
  }
}

router.get('/', async (req, res) => {
  const items = await Testimonial.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post('/', requireAdmin, upload.single('photo'), async (req, res) => {
  try {
    const { description, photoUrl } = req.body;
    let finalPhoto = photoUrl;
    if (req.file) {
      // Handle both Cloudinary and local storage responses
      finalPhoto = req.file.path || `/uploads/${req.file.filename}`;
    }
    const testimonial = await Testimonial.create({ description, photoUrl: finalPhoto });
    res.status(201).json(testimonial);
  } catch (e) {
    res.status(400).json({ message: 'Failed to create testimonial', error: String(e) });
  }
});

router.put('/:id', requireAdmin, upload.single('photo'), async (req, res) => {
  try {
    const { description, photoUrl } = req.body;
    const update = { description };
    if (req.file) {
      // Handle both Cloudinary and local storage responses
      update.photoUrl = req.file.path || `/uploads/${req.file.filename}`;
    } else if (photoUrl !== undefined) {
      update.photoUrl = photoUrl;
    }
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(testimonial);
  } catch (e) {
    res.status(400).json({ message: 'Failed to update testimonial', error: String(e) });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await Testimonial.findById(req.params.id);
    if (existing) {
      if (existing.photoUrl) deleteLocalUploadIfExists(existing.photoUrl);
      await Testimonial.findByIdAndDelete(req.params.id);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ message: 'Failed to delete testimonial', error: String(e) });
  }
});

module.exports = router;
