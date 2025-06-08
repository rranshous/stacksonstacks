/**
 * Simulation - Pure game logic, no DOM dependencies
 * Takes game state, returns updated game state
 */
export class Simulation {
    constructor(bounds) {
        this.bounds = bounds;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseTargets = []; // Array of mouse target positions
    }
    
    setMousePosition(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }
    
    addMouseTarget(x, y) {
        this.mouseTargets.push({ x, y, life: 100 }); // Targets fade over time
    }
    
    update(gameState, deltaTime) {
        // Update mouse targets (fade them over time)
        this.mouseTargets = this.mouseTargets
            .map(target => ({ ...target, life: target.life - 1 }))
            .filter(target => target.life > 0);
        
        // Process each swarm
        gameState.swarms.forEach(swarm => {
            swarm.creatures.forEach(creature => {
                this.updateCreature(creature, swarm.behavior, swarm.speed, deltaTime);
                
                // Check collisions with obstacles after movement
                this.checkObstacleCollisions(creature, gameState.obstacles || []);
            });
        });
        
        // Update obstacles (for moving/rotating ones)
        if (gameState.obstacles) {
            gameState.obstacles.forEach(obstacle => {
                this.updateObstacle(obstacle, deltaTime);
            });
        }
        
        // Check win conditions
        if (gameState.winConditions) {
            gameState.winConditions.forEach(winCondition => {
                this.checkWinCondition(winCondition);
            });
        }
        
        return gameState;
    }
    
    updateCreature(creature, behavior, speed, deltaTime) {
        // Initialize creature personality traits if not set
        if (!creature.personality) {
            creature.personality = {
                jitteriness: 0.5 + Math.random() * 0.5, // 0.5 to 1.0
                speedVariation: 0.8 + Math.random() * 0.4, // 0.8 to 1.2
                directionPersistence: 0.7 + Math.random() * 0.3, // 0.7 to 1.0
                wanderAngle: Math.random() * Math.PI * 2,
                wanderTimer: 0
            };
        }
        
        // Apply behavior (pure logic, no DOM)
        switch (behavior) {
            case 'wander':
                this.wanderBehavior(creature, speed);
                break;
                
            case 'chase-mouse':
            case 'chase': // backward compatibility
                this.chaseBehavior(creature, speed);
                break;
                
            case 'flee-mouse':
            case 'flee': // backward compatibility
                this.fleeBehavior(creature, speed);
                break;
                
            case 'orbit-mouse':
            case 'orbit': // backward compatibility
                this.orbitBehavior(creature, speed);
                break;
                
            case 'seek-targets':
                this.seekTargetsBehavior(creature, speed);
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
    
    wanderBehavior(creature, speed) {
        const personality = creature.personality;
        
        // Update wander timer
        personality.wanderTimer += 1;
        
        // Much less frequent direction changes for confident exploration
        if (personality.wanderTimer > (60 + Math.random() * 120)) {
            personality.wanderAngle += (Math.random() - 0.5) * personality.jitteriness * 2.0;
            personality.wanderTimer = 0;
        }
        
        // Barely any continuous adjustments - smooth confident gliding
        personality.wanderAngle += (Math.random() - 0.5) * personality.jitteriness * 0.01;
        
        // Calculate target velocity from wander angle
        const targetSpeed = speed * personality.speedVariation;
        const targetVx = Math.cos(personality.wanderAngle) * targetSpeed;
        const targetVy = Math.sin(personality.wanderAngle) * targetSpeed;
        
        // High persistence for smooth confident movement
        const persistence = Math.max(0.75, personality.directionPersistence * 0.9);
        creature.vx = creature.vx * persistence + targetVx * (1 - persistence);
        creature.vy = creature.vy * persistence + targetVy * (1 - persistence);
        
        // Minimal momentum for gentle propulsion without jitter
        const momentum = 0.02;
        creature.vx += (Math.random() - 0.5) * momentum;
        creature.vy += (Math.random() - 0.5) * momentum;
        
        // Limit speed to prevent runaway acceleration
        this.limitSpeed(creature, speed * 1.8); // Higher limit for more exploration
    }
    
    chaseBehavior(creature, speed) {
        // Move toward mouse position
        const dx = this.mouseX - creature.x;
        const dy = this.mouseY - creature.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // Normalize and apply speed with personality variation
            const speedMod = creature.personality?.speedVariation || 1.0;
            creature.vx = (dx / distance) * speed * 0.5 * speedMod;
            creature.vy = (dy / distance) * speed * 0.5 * speedMod;
        }
        
        // Add personality-based jitter for natural movement
        const jitter = creature.personality?.jitteriness || 0.5;
        creature.vx += (Math.random() - 0.5) * jitter * 0.3;
        creature.vy += (Math.random() - 0.5) * jitter * 0.3;
    }
    
    fleeBehavior(creature, speed) {
        // Move away from mouse position
        const dx = creature.x - this.mouseX;
        const dy = creature.y - this.mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only flee if mouse is close
        if (distance < 150 && distance > 0) {
            const speedMod = creature.personality?.speedVariation || 1.0;
            creature.vx = (dx / distance) * speed * speedMod;
            creature.vy = (dy / distance) * speed * speedMod;
            
            // Add panic jitter when fleeing
            const jitter = creature.personality?.jitteriness || 0.5;
            creature.vx += (Math.random() - 0.5) * jitter * 0.5;
            creature.vy += (Math.random() - 0.5) * jitter * 0.5;
        } else {
            // Wander when mouse is far
            this.wanderBehavior(creature, speed * 0.3);
        }
    }
    
    orbitBehavior(creature, speed) {
        // Orbit around mouse position
        const dx = creature.x - this.mouseX;
        const dy = creature.y - this.mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // Perpendicular vector for orbital motion
            const orbitalX = -dy / distance;
            const orbitalY = dx / distance;
            
            // Apply personality variation to orbital speed and stability
            const speedMod = creature.personality?.speedVariation || 1.0;
            const jitter = creature.personality?.jitteriness || 0.5;
            
            // Stronger inward pull to keep fireflies closer to mouse
            const pullStrength = distance > 100 ? 0.008 : 0.003; // Pull harder when far
            
            // Combine orbital motion with inward pull
            creature.vx = orbitalX * speed * 0.6 * speedMod + (this.mouseX - creature.x) * pullStrength;
            creature.vy = orbitalY * speed * 0.6 * speedMod + (this.mouseY - creature.y) * pullStrength;
            
            // Gentle orbital wobble for magical effect
            creature.vx += (Math.random() - 0.5) * jitter * 0.1;
            creature.vy += (Math.random() - 0.5) * jitter * 0.1;
        }
    }
    
    seekTargetsBehavior(creature, speed) {
        if (this.mouseTargets.length === 0) {
            this.wanderBehavior(creature, speed * 0.5);
            return;
        }
        
        // Find closest target
        let closestTarget = null;
        let closestDistance = Infinity;
        
        this.mouseTargets.forEach(target => {
            const dx = target.x - creature.x;
            const dy = target.y - creature.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestTarget = target;
            }
        });
        
        if (closestTarget) {
            const dx = closestTarget.x - creature.x;
            const dy = closestTarget.y - creature.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                const speedMod = creature.personality?.speedVariation || 1.0;
                creature.vx = (dx / distance) * speed * speedMod;
                creature.vy = (dy / distance) * speed * speedMod;
                
                // Very gentle seeking movement - calm, deliberate hops
                const jitter = creature.personality?.jitteriness || 0.5;
                creature.vx += (Math.random() - 0.5) * jitter * 0.05;
                creature.vy += (Math.random() - 0.5) * jitter * 0.05;
            }
        }
    }
    
    limitSpeed(creature, maxSpeed) {
        const currentSpeed = Math.sqrt(creature.vx * creature.vx + creature.vy * creature.vy);
        if (currentSpeed > maxSpeed) {
            creature.vx = (creature.vx / currentSpeed) * maxSpeed;
            creature.vy = (creature.vy / currentSpeed) * maxSpeed;
        }
    }
    
    // Obstacle system
    updateObstacle(obstacle, deltaTime) {
        // Update obstacle based on its behavior
        switch (obstacle.behavior) {
            case 'static':
                // Do nothing - stays in place
                break;
                
            case 'rotating':
                // Rotate the obstacle (visual effect for renderer)
                obstacle.rotation = (obstacle.rotation || 0) + 2; // degrees per frame
                break;
                
            case 'moving':
                // Simple back-and-forth movement (can be enhanced later)
                if (!obstacle.moveDirection) obstacle.moveDirection = 1;
                obstacle.x += obstacle.moveDirection * 0.5;
                if (obstacle.x > this.bounds.width - obstacle.width || obstacle.x < 0) {
                    obstacle.moveDirection *= -1;
                }
                break;
        }
    }
    
    checkObstacleCollisions(creature, obstacles) {
        obstacles.forEach(obstacle => {
            if (this.isColliding(creature, obstacle)) {
                this.handleCollision(creature, obstacle);
            }
        });
    }
    
    isColliding(creature, obstacle) {
        // Simple rectangular collision detection
        // Creature is treated as a small rectangle around its position
        const creatureSize = 20; // Creature hit-box size
        const creatureLeft = creature.x - creatureSize / 2;
        const creatureRight = creature.x + creatureSize / 2;
        const creatureTop = creature.y - creatureSize / 2;
        const creatureBottom = creature.y + creatureSize / 2;
        
        const obstacleLeft = obstacle.x;
        const obstacleRight = obstacle.x + obstacle.width;
        const obstacleTop = obstacle.y;
        const obstacleBottom = obstacle.y + obstacle.height;
        
        return !(creatureRight < obstacleLeft || 
                creatureLeft > obstacleRight || 
                creatureBottom < obstacleTop || 
                creatureTop > obstacleBottom);
    }
    
    handleCollision(creature, obstacle) {
        // Handle different collision types
        switch (obstacle.collision || 'solid') {
            case 'solid':
                this.handleSolidCollision(creature, obstacle);
                break;
                
            // Future collision types will go here:
            // case 'bounce': this.handleBounceCollision(creature, obstacle); break;
            // case 'slow': this.handleSlowCollision(creature, obstacle); break;
        }
    }
    
    handleSolidCollision(creature, obstacle) {
        // Push creature back to previous position (simple solid collision)
        // Calculate which side of the obstacle the creature hit
        const creatureSize = 20;
        const centerX = creature.x;
        const centerY = creature.y;
        
        const obstacleLeft = obstacle.x;
        const obstacleRight = obstacle.x + obstacle.width;
        const obstacleTop = obstacle.y;
        const obstacleBottom = obstacle.y + obstacle.height;
        
        // Calculate overlap on each axis
        const overlapLeft = (centerX + creatureSize/2) - obstacleLeft;
        const overlapRight = obstacleRight - (centerX - creatureSize/2);
        const overlapTop = (centerY + creatureSize/2) - obstacleTop;
        const overlapBottom = obstacleBottom - (centerY - creatureSize/2);
        
        // Find the smallest overlap to determine collision side
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        
        if (minOverlap === overlapLeft) {
            // Hit left side - push creature left
            creature.x = obstacleLeft - creatureSize/2;
            creature.vx = 0; // Stop horizontal movement
        } else if (minOverlap === overlapRight) {
            // Hit right side - push creature right
            creature.x = obstacleRight + creatureSize/2;
            creature.vx = 0;
        } else if (minOverlap === overlapTop) {
            // Hit top side - push creature up
            creature.y = obstacleTop - creatureSize/2;
            creature.vy = 0; // Stop vertical movement
        } else if (minOverlap === overlapBottom) {
            // Hit bottom side - push creature down
            creature.y = obstacleBottom + creatureSize/2;
            creature.vy = 0;
        }
    }
    
    checkWinCondition(winCondition) {
        if (winCondition.completed) return; // Already completed
        
        if (winCondition.type === 'reach-target') {
            // Update dynamic target positions to match their creatures
            winCondition.targets.forEach(target => {
                if (target.isDynamic && target.creature) {
                    target.x = target.creature.x - target.width / 2; // Center the target on creature
                    target.y = target.creature.y - target.height / 2;
                }
            });
            
            // Check if any creature from the win-condition's swarms has reached any target
            const hasReachedTarget = winCondition.swarms.some(swarm => 
                swarm.creatures.some(creature => 
                    winCondition.targets.some(target => 
                        this.isCreatureInTarget(creature, target)
                    )
                )
            );
            
            if (hasReachedTarget) {
                winCondition.completed = true;
                this.showWinMessage(winCondition.message);
            }
        }
    }
    
    isCreatureInTarget(creature, target) {
        const creatureSize = 30; // Match renderer creature size
        const centerX = creature.x;
        const centerY = creature.y;
        
        if (target.isDynamic) {
            // Dynamic creature target: use circular collision detection
            const targetCenterX = target.x + target.width / 2;
            const targetCenterY = target.y + target.height / 2;
            const dx = centerX - targetCenterX;
            const dy = centerY - targetCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const collisionRadius = target.width / 2; // target.width is collision-radius * 2
            
            return distance <= collisionRadius;
        } else {
            // Static rectangular target: use bounding box collision
            return (centerX >= target.x && 
                    centerX <= target.x + target.width &&
                    centerY >= target.y && 
                    centerY <= target.y + target.height);
        }
    }
    
    showWinMessage(message) {
        // Create a temporary celebration overlay
        console.log('WIN CONDITION MET:', message);
        
        // Find or create win message element
        let winMessageEl = document.getElementById('win-message');
        if (!winMessageEl) {
            winMessageEl = document.createElement('div');
            winMessageEl.id = 'win-message';
            winMessageEl.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 255, 0, 0.9);
                color: white;
                padding: 20px 40px;
                border-radius: 20px;
                font-size: 24px;
                font-weight: bold;
                z-index: 1000;
                text-align: center;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                animation: celebration 3s ease-out forwards;
            `;
            document.body.appendChild(winMessageEl);
            
            // Add CSS animation if not already present
            if (!document.getElementById('celebration-style')) {
                const style = document.createElement('style');
                style.id = 'celebration-style';
                style.textContent = `
                    @keyframes celebration {
                        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                        100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        winMessageEl.textContent = message;
        winMessageEl.style.display = 'block';
        
        // Auto-hide after animation
        setTimeout(() => {
            if (winMessageEl) {
                winMessageEl.style.display = 'none';
            }
        }, 3000);
    }
}
