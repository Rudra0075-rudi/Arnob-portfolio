const express = require('express');
const Project = require('../models/Project');
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
  const items = await Project.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post('/', requireAdmin, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, description, coverImageUrl } = req.body;
    let finalCover = coverImageUrl;
    if (req.file) finalCover = `/uploads/${req.file.filename}`;
    const inlineUrls = extractImageUrlsFromHtml(description);
    const proj = await Project.create({ title, description, coverImageUrl: finalCover, galleryImageUrls: inlineUrls });
    res.status(201).json(proj);
  } catch (e) {
    res.status(400).json({ message: 'Failed to create project', error: String(e) });
  }
});

router.put('/:id', requireAdmin, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, description, coverImageUrl } = req.body;
    const update = { title, description };
    if (req.file) update.coverImageUrl = `/uploads/${req.file.filename}`;
    else if (coverImageUrl !== undefined) update.coverImageUrl = coverImageUrl;
    if (description !== undefined) update.galleryImageUrls = extractImageUrlsFromHtml(description);
    const proj = await Project.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(proj);
  } catch (e) {
    res.status(400).json({ message: 'Failed to update project', error: String(e) });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await Project.findById(req.params.id);
    if (existing) {
      if (existing.coverImageUrl) deleteLocalUploadIfExists(existing.coverImageUrl);
      (existing.galleryImageUrls || []).forEach(deleteLocalUploadIfExists);
      await Project.findByIdAndDelete(req.params.id);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ message: 'Failed to delete project', error: String(e) });
  }
});

router.post('/:id/gallery', requireAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const urlsFromFiles = (req.files || []).map(f => `/uploads/${f.filename}`);
    const urlsFromBody = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : (req.body.imageUrls ? [req.body.imageUrls] : []);
    const allUrls = [...urlsFromFiles, ...urlsFromBody];
    const proj = await Project.findByIdAndUpdate(
      req.params.id,
      { $push: { galleryImageUrls: { $each: allUrls } } },
      { new: true }
    );
    res.json(proj);
  } catch (e) {
    res.status(400).json({ message: 'Failed to add gallery images', error: String(e) });
  }
});

module.exports = router;


