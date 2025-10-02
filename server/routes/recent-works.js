const express = require('express');
const RecentWork = require('../models/RecentWork');
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
  const items = await RecentWork.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post('/', requireAdmin, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, description, coverImageUrl } = req.body;
    let finalCover = coverImageUrl;
    if (req.file) finalCover = `/uploads/${req.file.filename}`;
    const work = await RecentWork.create({ title, description, coverImageUrl: finalCover });
    res.status(201).json(work);
  } catch (e) {
    res.status(400).json({ message: 'Failed to create recent work', error: String(e) });
  }
});

router.put('/:id', requireAdmin, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, description, coverImageUrl } = req.body;
    const update = { title, description };
    if (req.file) update.coverImageUrl = `/uploads/${req.file.filename}`;
    else if (coverImageUrl !== undefined) update.coverImageUrl = coverImageUrl;
    const work = await RecentWork.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(work);
  } catch (e) {
    res.status(400).json({ message: 'Failed to update recent work', error: String(e) });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await RecentWork.findById(req.params.id);
    if (existing) {
      if (existing.coverImageUrl) deleteLocalUploadIfExists(existing.coverImageUrl);
      await RecentWork.findByIdAndDelete(req.params.id);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ message: 'Failed to delete recent work', error: String(e) });
  }
});

module.exports = router;
