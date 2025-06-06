const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));  // Serve static files from current directory

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        message: '🎮 AI Game Creation Lab - Server Running!'
    });
});

// API endpoint for AI interactions (ready for Anthropic integration)
app.post('/api/interpret', async (req, res) => {
    try {
        const { command, domContext } = req.body;
        
        console.log('🧠 AI Request received:', {
            command: command?.substring(0, 100) + '...',
            domSize: domContext?.length || 0
        });
        
        // TODO: Integrate with Anthropic API
        // For now, return mock response
        const mockResponse = {
            toolCalls: [
                {
                    name: 'create_element',
                    params: {
                        parent: 'game-world swarm',
                        elementType: 'creature',
                        attributes: {
                            x: Math.random() * 800,
                            y: Math.random() * 600,
                            vx: (Math.random() - 0.5) * 2,
                            vy: (Math.random() - 0.5) * 2
                        }
                    }
                }
            ],
            message: `Mock AI: Adding a creature based on "${command}"`
        };
        
        res.json(mockResponse);
        
    } catch (error) {
        console.error('❌ API Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 AI Game Creation Lab Server Started!
   
   📍 Local:     http://localhost:${PORT}
   📍 Health:    http://localhost:${PORT}/health
   📍 API:       http://localhost:${PORT}/api/interpret
   
   🎮 Ready for collaborative magic!
    `);
});
