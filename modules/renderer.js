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
}
