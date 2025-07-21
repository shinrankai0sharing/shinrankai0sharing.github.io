const fs = require('fs');

// Create a simple but proper PNG icon (24x24 minimum for PWA)
const createIcon = (size) => {
  // This creates a simple colored square with the letter "G" for Gakuto
  const canvas = require('canvas');
  const c = canvas.createCanvas(size, size);
  const ctx = c.getContext('2d');
  
  // Background
  ctx.fillStyle = '#673ab7';
  ctx.fillRect(0, 0, size, size);
  
  // Inner circle
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/3, 0, 2 * Math.PI);
  ctx.fill();
  
  // Letter G
  ctx.fillStyle = '#673ab7';
  ctx.font = `bold ${size/3}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('G', size/2, size/2);
  
  const buffer = c.toBuffer('image/png');
  fs.writeFileSync(`icon-${size}x${size}.png`, buffer);
  console.log(`Created icon-${size}x${size}.png`);
};

// Create required icon sizes for Android PWA
[144, 192, 512].forEach(createIcon);
