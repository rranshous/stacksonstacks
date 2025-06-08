/**
 * DOM Tools - Utilities for DOM manipulation (for AI to use later)
 */
export class DOMTools {
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
        return elements.length;
    }
    
    removeElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.remove();
            console.log(`🗑️ Removed ${selector}`);
        });
        return elements.length;
    }
    
    createSwarm(gameWorld, emoji, behavior, speed = 2, count = 1) {
        const swarm = this.createElement(gameWorld, 'swarm', {
            emoji,
            behavior,
            speed,
            count
        });
        
        // Add creatures to the swarm
        for (let i = 0; i < count; i++) {
            const randomX = Math.random() * 800;
            const randomY = Math.random() * 600;
            const randomVx = (Math.random() - 0.5) * 2;
            const randomVy = (Math.random() - 0.5) * 2;
            
            this.createElement(swarm, 'creature', {
                x: randomX,
                y: randomY,
                vx: randomVx,
                vy: randomVy
            });
        }
        
        return swarm;
    }
    
    createObstacle(gameWorld, emoji, x, y, width, height, behavior = 'static', collision = 'solid') {
        const obstacle = this.createElement(gameWorld, 'obstacle', {
            emoji,
            x,
            y,
            width,
            height,
            behavior,
            collision
        });
        
        return obstacle;
    }
    
    createWinCondition(gameWorld, type = 'reach-target', message = '🎉 You win!') {
        const winCondition = this.createElement(gameWorld, 'win-condition', {
            type,
            message
        });
        
        return winCondition;
    }
    
    createTarget(parent, emoji, x, y, width = 80, height = 80) {
        const target = this.createElement(parent, 'target', {
            emoji,
            x,
            y,
            width,
            height
        });
        
        return target;
    }
}
