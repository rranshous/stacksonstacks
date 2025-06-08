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
}
