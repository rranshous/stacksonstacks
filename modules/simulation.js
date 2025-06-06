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
            });
        });
        
        return gameState;
    }
    
    updateCreature(creature, behavior, speed, deltaTime) {
        // Apply behavior (pure logic, no DOM)
        switch (behavior) {
            case 'wander':
                this.wanderBehavior(creature, speed);
                break;
                
            case 'chase':
                this.chaseBehavior(creature, speed);
                break;
                
            case 'flee':
                this.fleeBehavior(creature, speed);
                break;
                
            case 'orbit':
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
        // Add some randomness to velocity
        creature.vx += (Math.random() - 0.5) * 0.1;
        creature.vy += (Math.random() - 0.5) * 0.1;
        
        // Limit velocity
        this.limitSpeed(creature, speed);
    }
    
    chaseBehavior(creature, speed) {
        // Move toward mouse position
        const dx = this.mouseX - creature.x;
        const dy = this.mouseY - creature.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // Normalize and apply speed
            creature.vx = (dx / distance) * speed * 0.5;
            creature.vy = (dy / distance) * speed * 0.5;
        }
        
        // Add slight wander for natural movement
        creature.vx += (Math.random() - 0.5) * 0.2;
        creature.vy += (Math.random() - 0.5) * 0.2;
    }
    
    fleeBehavior(creature, speed) {
        // Move away from mouse position
        const dx = creature.x - this.mouseX;
        const dy = creature.y - this.mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only flee if mouse is close
        if (distance < 150 && distance > 0) {
            creature.vx = (dx / distance) * speed;
            creature.vy = (dy / distance) * speed;
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
            
            // Combine orbital motion with slight inward pull
            creature.vx = orbitalX * speed + (this.mouseX - creature.x) * 0.001;
            creature.vy = orbitalY * speed + (this.mouseY - creature.y) * 0.001;
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
                creature.vx = (dx / distance) * speed;
                creature.vy = (dy / distance) * speed;
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
}
