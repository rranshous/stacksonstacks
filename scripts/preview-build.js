#!/usr/bin/env node
/**
 * Preview build script - serves the itch.io build locally
 * to test before uploading
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Check if build exists
const buildDir = path.join(__dirname, '../build/itch');
if (!fs.existsSync(buildDir)) {
    console.log('❌ Build directory not found!');
    console.log('💡 Run `npm run build:itch` first');
    process.exit(1);
}

// Serve static files from itch build
app.use(express.static(buildDir));

// Catch-all handler for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
});

app.listen(PORT, () => {
    console.log('🎮 Preview server started!');
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log('');
    console.log('🔍 Testing itch.io build:');
    console.log('   ✅ Check that all demos work');
    console.log('   ✅ Verify mouse interactions');
    console.log('   ✅ Test snapshot loading');
    console.log('   ✅ Confirm win conditions trigger');
    console.log('   ✅ Ensure no console errors');
    console.log('');
    console.log('💡 This simulates how your game will run on itch.io');
    console.log('🛑 Press Ctrl+C to stop preview server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Preview server stopped');
    process.exit(0);
});
