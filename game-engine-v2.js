/**
 * Game Engine - Separated Concerns Architecture
 * 
 * 1. Simulation: Pure game logic (positions, velocities, behaviors)
 * 2. DOMSync: Persistence layer (reads/writes DOM state) 
 * 3. Renderer: Canvas visualization
 */

// Separated Concerns Classes

/**
 * DOMSync - Handles reading/writing game state to/from DOM
 * Pure data persistence layer
 */
class DOMSync {
    constructor(gameWorld) {
        this.gameWorld = gameWorld;
    }
    
    loadGameState() {
        const gameState = {
            swarms: []
        };
        
        const swarms = this.gameWorld.querySelectorAll('swarm');
        swarms.forEach(swarmEl => {
            const swarm = {
                element: swarmEl,
                emoji: swarmEl.getAttribute('emoji') || '🐱',
                behavior: swarmEl.getAttribute('behavior') || 'wander',
                speed: parseFloat(swarmEl.getAttribute('speed')) || 1,
                creatures: []
            };
            
            const creatures = swarmEl.querySelectorAll('creature');
            creatures.forEach(creatureEl => {
                swarm.creatures.push({
                    element: creatureEl,
                    x: parseFloat(creatureEl.getAttribute('x')) || 0,
                    y: parseFloat(creatureEl.getAttribute('y')) || 0,
                    vx: parseFloat(creatureEl.getAttribute('vx')) || 0,
                    vy: parseFloat(creatureEl.getAttribute('vy')) || 0
                });
            });
            
            gameState.swarms.push(swarm);
        });
        
        return gameState;
    }
    
    saveGameState(gameState) {
        gameState.swarms.forEach(swarm => {
            swarm.creatures.forEach(creature => {
                creature.element.setAttribute('x', creature.x.toFixed(2));
                creature.element.setAttribute('y', creature.y.toFixed(2));
                creature.element.setAttribute('vx', creature.vx.toFixed(2));
                creature.element.setAttribute('vy', creature.vy.toFixed(2));
            });
        });
    }
}

/**
 * Simulation - Pure game logic, no DOM dependencies
 * Takes game state, returns updated game state
 */
class Simulation {
    constructor(bounds) {
        this.bounds = bounds;
    }
    
    update(gameState, deltaTime) {
        // Process each swarm
        gameState.swarms.forEach(swarm => {
            swarm.creatures.forEach(creature => {
                this.updateCreature(creature, swarm.behavior, swarm.speed, deltaTime);
            });
        });
        
        return gameState;
    }
    
    updateCreature(creature, behavior, speed, deltaTime) {
        // Apply behavior (pure logic, no DOM)
        switch (behavior) {
            case 'wander':
                // Add some randomness to velocity
                creature.vx += (Math.random() - 0.5) * 0.1;
                creature.vy += (Math.random() - 0.5) * 0.1;
                
                // Limit velocity
                const currentSpeed = Math.sqrt(creature.vx * creature.vx + creature.vy * creature.vy);
                if (currentSpeed > speed) {
                    creature.vx = (creature.vx / currentSpeed) * speed;
                    creature.vy = (creature.vy / currentSpeed) * speed;
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
        creature.x += creature.vx;
        creature.y += creature.vy;
        
        // Wrap around screen boundaries
        if (creature.x < 0) creature.x = this.bounds.width;
        if (creature.x > this.bounds.width) creature.x = 0;
        if (creature.y < 0) creature.y = this.bounds.height;
        if (creature.y > this.bounds.height) creature.y = 0;
    }
}

/**
 * Renderer - Pure canvas drawing, takes game state and renders it
 */
class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }
    
    render(gameState) {
        // Clear canvas
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        // Set font for emoji rendering
        this.ctx.font = '24px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Render all swarms
        gameState.swarms.forEach(swarm => {
            swarm.creatures.forEach(creature => {
                this.ctx.fillText(swarm.emoji, creature.x, creature.y);
            });
        });
    }
}

/**
 * Game Engine - Orchestrates the separated concerns
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
        
        // Separate concern modules
        this.domSync = new DOMSync(this.gameWorld);
        this.simulation = new Simulation(this.bounds);
        this.renderer = new Renderer(this.ctx);
        
        console.log('🎮 Game Engine initialized with separated concerns');
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
        
        // 1. Load simulation state from DOM
        const gameState = this.domSync.loadGameState();
        
        // 2. Advance simulation (pure game logic)
        const updatedState = this.simulation.update(gameState, deltaTime);
        
        // 3. Persist back to DOM
        this.domSync.saveGameState(updatedState);
        
        // 4. Render from current state
        this.renderer.render(updatedState);
        
        // 5. Update debug info
        this.updateDebugInfo();
        
        requestAnimationFrame((time) => this.gameLoop(time));
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
