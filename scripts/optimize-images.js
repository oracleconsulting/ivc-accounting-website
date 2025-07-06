const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeHeroImage() {
  const inputPath = path.join(__dirname, '../public/images/james-howard.jpg');
  const outputDir = path.join(__dirname, '../public/images/optimized');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    // Create WebP versions
    await sharp(inputPath)
      .resize(1920, 1080, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, 'hero-1920.webp'));
      
    await sharp(inputPath)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, 'hero-1200.webp'));
      
    await sharp(inputPath)
      .resize(640, 360, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, 'hero-640.webp'));
    
    // Create blur placeholder
    const { data, info } = await sharp(inputPath)
      .resize(10, 10, { fit: 'cover' })
      .blur()
      .toBuffer({ resolveWithObject: true });
      
    const base64 = `data:image/${info.format};base64,${data.toString('base64')}`;
    
    // Save blur data
    fs.writeFileSync(
      path.join(outputDir, 'hero-blur.txt'),
      base64
    );
    
    console.log('✅ Hero image optimized successfully');
    console.log('📁 Optimized images saved to:', outputDir);
    console.log('🔗 Blur placeholder saved to:', path.join(outputDir, 'hero-blur.txt'));
  } catch (error) {
    console.error('❌ Error optimizing hero image:', error);
  }
}

optimizeHeroImage(); 