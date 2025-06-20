/**
 * Game Engine V3 - Modular Architecture
 * Orchestrates the separated concern modules
 */
import { DOMSync } from './modules/dom-sync.js';
import { Simulation } from './modules/simulation.js';
import { Renderer } from './modules/renderer.js';
import { DOMTools } from './modules/dom-tools.js';

export class GameEngine {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameWorld = document.querySelector('game-world');
        
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
        this.domTools = new DOMTools();
        
        this.setupMouseTracking();
        console.log('🎮 Game Engine V3 initialized with modular architecture');
        this.start();
    }
    
    setupMouseTracking() {
        // Track mouse position over canvas
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.simulation.setMousePosition(mouseX, mouseY);
        });
        
        // Add mouse targets on click
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.simulation.addMouseTarget(mouseX, mouseY);
            console.log(`🎯 Added mouse target at (${mouseX.toFixed(1)}, ${mouseY.toFixed(1)})`);
        });
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
        this.renderer.render(updatedState, this.simulation);
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    // Expose DOM tools for external use
    createElement(parent, elementType, attributes = {}) {
        return this.domTools.createElement(parent, elementType, attributes);
    }
    
    modifyElement(selector, attribute, value) {
        return this.domTools.modifyElement(selector, attribute, value);
    }
    
    removeElement(selector) {
        return this.domTools.removeElement(selector);
    }
    
    createSwarm(emoji, behavior, speed = 2, count = 1) {
        return this.domTools.createSwarm(this.gameWorld, emoji, behavior, speed, count);
    }
    
    createObstacle(emoji, x, y, width, height, behavior = 'static', collision = 'solid') {
        return this.domTools.createObstacle(this.gameWorld, emoji, x, y, width, height, behavior, collision);
    }
}
