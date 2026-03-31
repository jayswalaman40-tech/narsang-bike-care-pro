import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SVG_CONTENT = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#E8590C" rx="128" ry="128" />
  <path d="M344.5 167.5c-15.6-15.6-40.9-15.6-56.6 0l-28.3 28.3-56.6-56.6c-7.8-7.8-20.5-7.8-28.3 0l-28.3 28.3c-7.8 7.8-7.8 20.5 0 28.3l56.6 56.6-84.9 84.9c-15.6 15.6-15.6 40.9 0 56.6 15.6 15.6 40.9 15.6 56.6 0l84.9-84.9 56.6 56.6c7.8 7.8 20.5 7.8 28.3 0l28.3-28.3c7.8-7.8 7.8-20.5 0-28.3l-56.6-56.6 28.3-28.3c15.6-15.6 15.6-40.9 0-56.6z" fill="#FFFFFF"/>
</svg>
`;

async function generateIcons() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  const svgBuffer = Buffer.from(SVG_CONTENT);

  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192-maskable.png'));
    
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512-maskable.png'));

  console.log('✅ PWA Icons generated successfully!');
}

generateIcons().catch(console.error);
