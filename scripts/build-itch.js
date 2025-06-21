#!/usr/bin/env node
/**
 * Build script for itch.io deployment
 * Creates a standalone HTML5 game bundle
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎮 Building for itch.io...');

// Create build directory
const buildDir = path.join(__dirname, '../build');
const itchDir = path.join(buildDir, 'itch');

if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
}
fs.mkdirSync(buildDir, { recursive: true });
fs.mkdirSync(itchDir, { recursive: true });

console.log('📁 Created build directories');

// Copy core files
const filesToCopy = [
    'index.html',
    'game-engine-v3.js',
    'modules/',
    'docs/' // Include docs for context
];

filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, '..', file);
    const destPath = path.join(itchDir, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
        // Copy directory recursively
        fs.cpSync(srcPath, destPath, { recursive: true });
        console.log(`📂 Copied directory: ${file}`);
    } else {
        // Copy file
        fs.cpSync(srcPath, destPath);
        console.log(`📄 Copied file: ${file}`);
    }
});

// Create standalone index.html (remove server dependencies)
const indexPath = path.join(itchDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Update any server-dependent paths to be relative
indexContent = indexContent.replace(/src="\/modules\//g, 'src="./modules/');
indexContent = indexContent.replace(/href="\/modules\//g, 'href="./modules/');

// Add itch.io optimizations
const itchOptimizations = `
<!-- itch.io optimizations -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<style>
    /* Ensure full viewport usage on itch.io */
    html, body { 
        margin: 0; 
        padding: 0; 
        width: 100%; 
        height: 100%; 
        overflow: hidden; 
    }
    .app-container { 
        width: 100vw; 
        height: 100vh; 
    }
</style>
`;

// Insert optimizations before closing head tag
indexContent = indexContent.replace('</head>', itchOptimizations + '</head>');

fs.writeFileSync(indexPath, indexContent);
console.log('🎯 Optimized index.html for itch.io');

// Create package info
const packageInfo = {
    name: "AI Game Creation Collab",
    version: require('../package.json').version,
    description: "Interactive game creation system with creature behaviors and win conditions",
    buildDate: new Date().toISOString(),
    platform: "HTML5",
    instructions: "Click snapshots to load demo games, use mouse to interact with creatures"
};

fs.writeFileSync(
    path.join(itchDir, 'game-info.json'), 
    JSON.stringify(packageInfo, null, 2)
);

console.log('📋 Created game info');

// Create ZIP file for itch.io upload
try {
    const archiver = require('archiver');
    const zipName = `ai-game-creation-collab-v${packageInfo.version}.zip`;
    const zipPath = path.join(buildDir, zipName);
    
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => {
        console.log(`📦 Created itch.io package: ${zipName}`);
        console.log(`📍 Location: ${zipPath}`);
        console.log(`📊 Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
        console.log('');
        console.log('🚀 Ready for itch.io upload!');
        console.log('   1. Go to itch.io and create/edit your game page');
        console.log('   2. Upload the ZIP file as HTML5 game');
        console.log('   3. Set viewport to 1024x768 (or your preferred size)');
        console.log('   4. Enable "Mobile friendly" if desired');
        console.log('   5. Test with `npm run preview` before uploading');
    });
    
    archive.on('error', (err) => {
        throw err;
    });
    
    archive.pipe(output);
    archive.directory(itchDir, false);
    archive.finalize();
    
} catch (error) {
    console.error('❌ Failed to create ZIP:', error.message);
    console.log('💡 You can manually zip the contents of:', itchDir);
}
