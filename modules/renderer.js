/**
 * Renderer - Pure canvas drawing, takes game state and renders it
 */
export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }
    
    render(gameState, simulation) {
        // Clear canvas
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        // Draw obstacles first (behind creatures)
        if (gameState.obstacles) {
            gameState.obstacles.forEach(obstacle => this.drawObstacle(obstacle));
        }
        
        // Render mouse targets
        this.renderMouseTargets(simulation.mouseTargets);
        
        // Render mouse cursor indicator
        this.renderMouseCursor(simulation.mouseX, simulation.mouseY);
        
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
    
    renderMouseTargets(targets) {
        targets.forEach(target => {
            const alpha = target.life / 100; // Fade based on remaining life
            const radius = (100 - target.life) / 5; // Grow over time
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.strokeStyle = '#60a5fa';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(target.x, target.y, radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();
        });
    }
    
    renderMouseCursor(mouseX, mouseY) {
        if (mouseX === 0 && mouseY === 0) return; // Don't render at origin
        
        this.ctx.save();
        this.ctx.strokeStyle = '#fbbf24';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    /**
     * Capture a thumbnail of the current canvas state
     * @param {number} width - Thumbnail width
     * @param {number} height - Thumbnail height
     * @returns {string} Data URL of the thumbnail image
     */
    captureCanvasThumbnail(width = 80, height = 60) {
        try {
            // Create a temporary canvas for the thumbnail
            const thumbCanvas = document.createElement('canvas');
            thumbCanvas.width = width;
            thumbCanvas.height = height;
            const thumbCtx = thumbCanvas.getContext('2d');
            
            // Draw the main canvas scaled down to thumbnail size
            thumbCtx.drawImage(
                this.ctx.canvas, 
                0, 0, this.ctx.canvas.width, this.ctx.canvas.height,
                0, 0, width, height
            );
            
            // Return as data URL for easy storage
            return thumbCanvas.toDataURL('image/png');
            
        } catch (error) {
            console.error('Failed to capture canvas thumbnail:', error);
            // Return a placeholder data URL
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        }
    }
    
    drawMouseTargets() {
        // Draw fading target rings where user clicked
        this.mouseTargets.forEach(target => {
            const alpha = target.life / 100;
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.strokeStyle = '#ff6b6b';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(target.x, target.y, 15, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();
        });
    }
    
    drawObstacle(obstacle) {
        this.ctx.save();
        
        // Move to obstacle center for rotation
        const centerX = obstacle.x + obstacle.width / 2;
        const centerY = obstacle.y + obstacle.height / 2;
        this.ctx.translate(centerX, centerY);
        
        // Apply rotation if obstacle has it
        if (obstacle.rotation) {
            this.ctx.rotate(obstacle.rotation * Math.PI / 180);
        }
        
        // Draw obstacle background (slightly transparent)
        this.ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
        this.ctx.fillRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
        
        // Draw obstacle border
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
        
        // Draw obstacle emoji in center
        this.ctx.font = `${Math.min(obstacle.width, obstacle.height) * 0.6}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(obstacle.emoji, 0, 0);
        
        this.ctx.restore();
    }
}
