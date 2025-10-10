# Image Upload Fix for Production Deployment

## Problem
When deploying to Render, uploaded images disappear after server restarts because Render uses an ephemeral filesystem.

## Solution
The application now supports both local storage (for development) and Cloudinary (for production).

## Setup Instructions

### For Development (Local)
No additional setup needed. Images will be stored locally in the `/uploads` directory.

### For Production (Render)
1. Create a free Cloudinary account at https://cloudinary.com/
2. Get your Cloudinary credentials from the dashboard
3. Add these environment variables to your Render service:
   - `CLOUDINARY_CLOUD_NAME` - Your cloud name
   - `CLOUDINARY_API_KEY` - Your API key  
   - `CLOUDINARY_API_SECRET` - Your API secret

### How it Works
- If Cloudinary credentials are provided, images are uploaded to Cloudinary
- If no credentials are provided, images are stored locally (development mode)
- The application automatically detects which storage method to use

### Benefits
- ✅ Images persist across deployments
- ✅ Faster image loading (CDN)
- ✅ Automatic image optimization
- ✅ Backward compatible with existing local storage

## Testing
1. Upload an image through the admin panel
2. Check that the image URL starts with `https://res.cloudinary.com/` (Cloudinary) or `/uploads/` (local)
3. Verify the image displays correctly in the frontend
