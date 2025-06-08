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
            obstacles: [],
            winConditions: []
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
        
        // Load win-conditions (direct children only, not in snapshots)
        const winConditions = Array.from(this.gameWorld.children).filter(child => 
            child.tagName.toLowerCase() === 'win-condition'
        );
        winConditions.forEach(winCondEl => {
            const winCondition = {
                element: winCondEl,
                type: winCondEl.getAttribute('type') || 'reach-target',
                message: winCondEl.getAttribute('message') || '🎉 You win!',
                completed: false,
                swarms: [],
                targets: []
            };
            
            // Load swarms within this win-condition
            const nestedSwarms = winCondEl.querySelectorAll('swarm');
            nestedSwarms.forEach(swarmEl => {
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
                
                winCondition.swarms.push(swarm);
                // Also add to main swarms array so they participate in simulation
                gameState.swarms.push(swarm);
            });
            
            // Load targets within this win-condition
            const targets = winCondEl.querySelectorAll('target');
            targets.forEach(targetEl => {
                // Check if target has swarms inside (dynamic creature targets)
                const targetSwarms = targetEl.querySelectorAll('swarm');
                if (targetSwarms.length > 0) {
                    // Dynamic targets: each creature in the swarm becomes a target
                    targetSwarms.forEach(swarmEl => {
                        const collisionRadius = parseFloat(swarmEl.getAttribute('collision-radius')) || 35;
                        const swarm = {
                            element: swarmEl,
                            emoji: swarmEl.getAttribute('emoji') || '🐱',
                            behavior: swarmEl.getAttribute('behavior') || 'wander',
                            speed: parseFloat(swarmEl.getAttribute('speed')) || 1,
                            creatures: []
                        };
                        
                        const creatures = swarmEl.querySelectorAll('creature');
                        creatures.forEach(creatureEl => {
                            const creature = {
                                element: creatureEl,
                                x: parseFloat(creatureEl.getAttribute('x')) || 0,
                                y: parseFloat(creatureEl.getAttribute('y')) || 0,
                                vx: parseFloat(creatureEl.getAttribute('vx')) || 0,
                                vy: parseFloat(creatureEl.getAttribute('vy')) || 0
                            };
                            swarm.creatures.push(creature);
                            
                            // Each creature becomes a dynamic target
                            winCondition.targets.push({
                                element: creatureEl,
                                emoji: swarm.emoji,
                                x: creature.x,
                                y: creature.y,
                                width: collisionRadius * 2,
                                height: collisionRadius * 2,
                                isDynamic: true,
                                creature: creature // Reference to update position each frame
                            });
                        });
                        
                        // Also add to main swarms array so they participate in simulation
                        gameState.swarms.push(swarm);
                    });
                } else {
                    // Static target: traditional fixed area
                    winCondition.targets.push({
                        element: targetEl,
                        emoji: targetEl.getAttribute('emoji') || '🏠',
                        x: parseFloat(targetEl.getAttribute('x')) || 0,
                        y: parseFloat(targetEl.getAttribute('y')) || 0,
                        width: parseFloat(targetEl.getAttribute('width')) || 80,
                        height: parseFloat(targetEl.getAttribute('height')) || 80,
                        isDynamic: false
                    });
                }
            });
            
            gameState.winConditions.push(winCondition);
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
