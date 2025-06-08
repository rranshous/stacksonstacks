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
            swarms: [],
            obstacles: []
        };
        
        // Only load swarms that are direct children of game-world (not nested in snapshots)
        const swarms = Array.from(this.gameWorld.children).filter(child => 
            child.tagName.toLowerCase() === 'swarm'
        );
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
        
        // Load obstacles (direct children only, not in snapshots)
        const obstacles = Array.from(this.gameWorld.children).filter(child => 
            child.tagName.toLowerCase() === 'obstacle'
        );
        obstacles.forEach(obstacleEl => {
            const obstacle = {
                element: obstacleEl,
                emoji: obstacleEl.getAttribute('emoji') || '🗿',
                x: parseFloat(obstacleEl.getAttribute('x')) || 0,
                y: parseFloat(obstacleEl.getAttribute('y')) || 0,
                width: parseFloat(obstacleEl.getAttribute('width')) || 40,
                height: parseFloat(obstacleEl.getAttribute('height')) || 40,
                behavior: obstacleEl.getAttribute('behavior') || 'static',
                collision: obstacleEl.getAttribute('collision') || 'solid',
                rotation: parseFloat(obstacleEl.getAttribute('rotation')) || 0
            };
            
            gameState.obstacles.push(obstacle);
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
        
        // Save obstacle state back to DOM
        if (gameState.obstacles) {
            gameState.obstacles.forEach(obstacle => {
                obstacle.element.setAttribute('x', obstacle.x.toFixed(2));
                obstacle.element.setAttribute('y', obstacle.y.toFixed(2));
                if (obstacle.rotation !== undefined) {
                    obstacle.element.setAttribute('rotation', obstacle.rotation.toFixed(1));
                }
            });
        }
    }
}
