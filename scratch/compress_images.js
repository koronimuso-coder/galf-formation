const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ENGINS_DIR = path.join(__dirname, '..', 'public', 'images', 'engins');
const HEADERS_DIR = path.join(__dirname, '..', 'public', 'images', 'headers');

async function compressWebPs() {
  console.log('Starting WebP compression in:', HEADERS_DIR);
  if (!fs.existsSync(HEADERS_DIR)) {
    console.error('Directory does not exist:', HEADERS_DIR);
    return;
  }

  const files = fs.readdirSync(HEADERS_DIR).filter(f => f.endsWith('.webp'));
  for (const file of files) {
    const filePath = path.join(HEADERS_DIR, file);
    const stats = fs.statSync(filePath);
    const originalSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`Processing ${file} (${originalSizeMB} MB)...`);

    try {
      const tempPath = path.join(HEADERS_DIR, `temp_${file}`);
      
      // Read file into memory buffer to avoid locking issues
      const buffer = fs.readFileSync(filePath);
      
      // Load image info
      const image = sharp(buffer);
      const metadata = await image.metadata();
      
      // Resize if width > 1920px
      let pipeline = sharp(buffer);
      if (metadata.width && metadata.width > 1920) {
        pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
      }

      // Re-compress webp
      await pipeline
        .webp({ quality: 75, effort: 6 })
        .toFile(tempPath);

      // Overwrite the original
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);

      const tempStats = fs.statSync(filePath);
      const newSizeKB = (tempStats.size / 1024).toFixed(2);
      
      console.log(`  -> Successfully compressed ${file} to ${newSizeKB} KB`);
    } catch (err) {
      console.error(`  -> Failed to compress ${file}:`, err.message);
    }
  }
}

async function main() {
  await compressWebPs();
  console.log('WebP compression done!');
}

main();
