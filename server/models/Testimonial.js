const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  description: { type: String, required: true },
  photoUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

testimonialSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
