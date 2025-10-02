const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  abstract: { type: String },
  status: { type: String, enum: ['ongoing', 'published', 'proposal'], required: true },
  coverImageUrl: { type: String },
  galleryImageUrls: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

researchSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Research', researchSchema);


