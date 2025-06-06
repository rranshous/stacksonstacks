/**
 * DOMSync - Handles reading/writing game state to/from DOM
 * Pure data persistence layer
 */
export class DOMSync {
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
