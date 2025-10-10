const express = require('express');
const Research = require('../models/Research');
const { requireAdmin } = require('../middleware/admin');
const { upload, bufferToBase64 } = require('../middleware/upload');

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

function extractImageUrlsFromHtml(html) {
  if (!html || typeof html !== 'string') return [];
  const urls = new Set();
  const regex = /<img\s+[^>]*src=["']([^"'>]+)["'][^>]*>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const src = match[1];
    if (typeof src === 'string' && src.trim()) urls.add(src.trim());
  }
  return Array.from(urls);
}

router.get('/', async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const items = await Research.find(filter).sort({ createdAt: -1 });
  res.json(items);
});

router.post('/', requireAdmin, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, abstract, status, coverImageUrl } = req.body;
    let finalCover = coverImageUrl;
    if (req.file) {
      // Handle Cloudinary, Base64, and local storage responses
      if (req.file.path) {
        finalCover = req.file.path; // Cloudinary
      } else if (req.file.buffer) {
        finalCover = bufferToBase64(req.file.buffer, req.file.mimetype); // Base64
      } else {
        finalCover = `/uploads/${req.file.filename}`; // Local
      }
    }
    const inlineUrls = extractImageUrlsFromHtml(abstract);
    const paper = await Research.create({ title, abstract, status, coverImageUrl: finalCover, galleryImageUrls: inlineUrls });
    res.status(201).json(paper);
  } catch (e) {
    res.status(400).json({ message: 'Failed to create research', error: String(e) });
  }
});

router.put('/:id', requireAdmin, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, abstract, status, coverImageUrl } = req.body;
    const update = { title, abstract, status };
    if (req.file) {
      // Handle Cloudinary, Base64, and local storage responses
      if (req.file.path) {
        update.coverImageUrl = req.file.path; // Cloudinary
      } else if (req.file.buffer) {
        update.coverImageUrl = bufferToBase64(req.file.buffer, req.file.mimetype); // Base64
      } else {
        update.coverImageUrl = `/uploads/${req.file.filename}`; // Local
      }
    } else if (coverImageUrl !== undefined) {
      update.coverImageUrl = coverImageUrl;
    }
    if (abstract !== undefined) update.galleryImageUrls = extractImageUrlsFromHtml(abstract);
    const paper = await Research.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(paper);
  } catch (e) {
    res.status(400).json({ message: 'Failed to update research', error: String(e) });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await Research.findById(req.params.id);
    if (existing) {
      if (existing.coverImageUrl) deleteLocalUploadIfExists(existing.coverImageUrl);
      (existing.galleryImageUrls || []).forEach(deleteLocalUploadIfExists);
      await Research.findByIdAndDelete(req.params.id);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ message: 'Failed to delete research', error: String(e) });
  }
});

router.post('/:id/gallery', requireAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const urlsFromFiles = (req.files || []).map(f => {
      if (f.path) return f.path; // Cloudinary
      if (f.buffer) return bufferToBase64(f.buffer, f.mimetype); // Base64
      return `/uploads/${f.filename}`; // Local
    });
    const urlsFromBody = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : (req.body.imageUrls ? [req.body.imageUrls] : []);
    const allUrls = [...urlsFromFiles, ...urlsFromBody];
    const paper = await Research.findByIdAndUpdate(
      req.params.id,
      { $push: { galleryImageUrls: { $each: allUrls } } },
      { new: true }
    );
    res.json(paper);
  } catch (e) {
    res.status(400).json({ message: 'Failed to add gallery images', error: String(e) });
  }
});

module.exports = router;


