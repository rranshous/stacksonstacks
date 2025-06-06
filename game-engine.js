/**
 * Game Engine - DOM-to-Canvas Renderer
 * Reads game state from DOM and renders to HTML5 Canvas
 */

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameWorld = document.querySelector('game-world');
        this.debugOutput = document.getElementById('dom-output');
        
        this.lastTime = 0;
        this.running = false;
        
        // Canvas bounds for physics
        this.bounds = {
            width: this.canvas.width,
            height: this.canvas.height
        };
        
        console.log('🎮 Game Engine initialized');
        this.start();
    }
    
    start() {
        this.running = true;
        this.gameLoop();
        console.log('▶️ Game loop started');
    }
    
    stop() {
        this.running = false;
        console.log('⏹️ Game loop stopped');
    }
    
    gameLoop(currentTime = 0) {
        if (!this.running) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update physics (modify DOM)
        this.updatePhysics(deltaTime);
        
        // Render from DOM state
        this.render();
        
        // Update debug info
        this.updateDebugInfo();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    updatePhysics(deltaTime) {
        // Find all swarms and update their creatures
        const swarms = this.gameWorld.querySelectorAll('swarm');
        
        swarms.forEach(swarm => {
            const behavior = swarm.getAttribute('behavior') || 'wander';
            const speed = parseFloat(swarm.getAttribute('speed')) || 1;
            const creatures = swarm.querySelectorAll('creature');
            
            creatures.forEach(creature => {
                this.updateCreature(creature, behavior, speed, deltaTime);
            });
        });
    }
    
    updateCreature(creature, behavior, speed, deltaTime) {
        // Get current state from DOM
        let x = parseFloat(creature.getAttribute('x')) || 0;
        let y = parseFloat(creature.getAttribute('y')) || 0;
        let vx = parseFloat(creature.getAttribute('vx')) || 0;
        let vy = parseFloat(creature.getAttribute('vy')) || 0;
        
        // Apply behavior
        switch (behavior) {
            case 'wander':
                // Add some randomness to velocity
                vx += (Math.random() - 0.5) * 0.1;
                vy += (Math.random() - 0.5) * 0.1;
                
                // Limit velocity
                const maxSpeed = speed;
                const currentSpeed = Math.sqrt(vx * vx + vy * vy);
                if (currentSpeed > maxSpeed) {
                    vx = (vx / currentSpeed) * maxSpeed;
                    vy = (vy / currentSpeed) * maxSpeed;
                }
                break;
                
            case 'chase':
                // TODO: Chase behavior (toward mouse or other target)
                break;
                
            case 'flee':
                // TODO: Flee behavior (away from mouse or threat)
                break;
        }
        
        // Update position
        x += vx;
        y += vy;
        
        // Wrap around screen boundaries
        if (x < 0) x = this.bounds.width;
        if (x > this.bounds.width) x = 0;
        if (y < 0) y = this.bounds.height;
        if (y > this.bounds.height) y = 0;
        
        // Write back to DOM (this is our state persistence!)
        creature.setAttribute('x', x.toFixed(2));
        creature.setAttribute('y', y.toFixed(2));
        creature.setAttribute('vx', vx.toFixed(2));
        creature.setAttribute('vy', vy.toFixed(2));
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.bounds.width, this.bounds.height);
        
        // Render all swarms
        const swarms = this.gameWorld.querySelectorAll('swarm');
        
        swarms.forEach(swarm => {
            this.renderSwarm(swarm);
        });
    }
    
    renderSwarm(swarm) {
        const emoji = swarm.getAttribute('emoji') || '🐱';
        const creatures = swarm.querySelectorAll('creature');
        
        // Set font for emoji rendering
        this.ctx.font = '24px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        creatures.forEach(creature => {
            const x = parseFloat(creature.getAttribute('x'));
            const y = parseFloat(creature.getAttribute('y'));
            
            // Render emoji at creature position
            this.ctx.fillText(emoji, x, y);
        });
    }
    
    updateDebugInfo() {
        // Show current DOM state in debug panel
        const swarms = this.gameWorld.querySelectorAll('swarm');
        let debugInfo = '';
        
        swarms.forEach((swarm, i) => {
            const emoji = swarm.getAttribute('emoji');
            const behavior = swarm.getAttribute('behavior');
            const creatureCount = swarm.querySelectorAll('creature').length;
            
            debugInfo += `Swarm ${i + 1}: ${emoji} (${creatureCount} creatures, ${behavior})\n`;
            
            // Show first creature's position as example
            const firstCreature = swarm.querySelector('creature');
            if (firstCreature) {
                const x = parseFloat(firstCreature.getAttribute('x')).toFixed(1);
                const y = parseFloat(firstCreature.getAttribute('y')).toFixed(1);
                debugInfo += `  First creature: (${x}, ${y})\n`;
            }
        });
        
        this.debugOutput.textContent = debugInfo;
    }
    
    // DOM Manipulation Tools (for AI to use later)
    createElement(parent, elementType, attributes = {}) {
        const element = document.createElement(elementType);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        
        // Add to parent
        const parentElement = typeof parent === 'string' 
            ? document.querySelector(parent) 
            : parent;
            
        if (parentElement) {
            parentElement.appendChild(element);
            console.log(`✨ Created ${elementType} with attributes:`, attributes);
        }
        
        return element;
    }
    
    modifyElement(selector, attribute, value) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.setAttribute(attribute, value);
            console.log(`🔧 Modified ${selector} ${attribute} = ${value}`);
        });
    }
    
    removeElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.remove();
            console.log(`🗑️ Removed ${selector}`);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new GameEngine();
    
    // Hook up test buttons
    document.getElementById('test-ai-btn').addEventListener('click', () => {
        // Test AI-style DOM manipulation
        console.log('🧠 Testing AI interaction...');
        
        // Add a new creature to existing swarm
        const swarm = document.querySelector('swarm');
        if (swarm) {
            const randomX = Math.random() * 800;
            const randomY = Math.random() * 600;
            const randomVx = (Math.random() - 0.5) * 2;
            const randomVy = (Math.random() - 0.5) * 2;
            
            window.gameEngine.createElement(swarm, 'creature', {
                x: randomX,
                y: randomY,
                vx: randomVx,
                vy: randomVy
            });
        }
    });
    
    document.getElementById('voice-btn').addEventListener('click', () => {
        console.log('🎤 Voice recognition not implemented yet');
        alert('Voice recognition coming soon! Use "Test AI" button for now.');
    });
});
