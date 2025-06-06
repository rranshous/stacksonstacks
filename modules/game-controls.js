/**
 * Game Controls - Button event handlers for game interactions
 */
export function setupGameControls(gameEngine) {
    // Original test buttons
    document.getElementById('test-ai-btn').addEventListener('click', () => {
        console.log('🧠 Testing AI interaction...');
        const swarm = document.querySelector('swarm');
        if (swarm) {
            const randomX = Math.random() * 800;
            const randomY = Math.random() * 600;
            const randomVx = (Math.random() - 0.5) * 2;
            const randomVy = (Math.random() - 0.5) * 2;
            
            gameEngine.createElement(swarm, 'creature', {
                x: randomX,
                y: randomY,
                vx: randomVx,
                vy: randomVy
            });
        }
    });
    
    document.getElementById('voice-btn').addEventListener('click', () => {
        console.log('🎤 Voice recognition not implemented yet');
        alert('Voice recognition coming soon! Use other buttons for now.');
    });
    
    // Basic creature spawning
    document.getElementById('add-cat-btn').addEventListener('click', () => {
        const swarm = document.querySelector('swarm');
        if (swarm) {
            const randomX = Math.random() * 800;
            const randomY = Math.random() * 600;
            const randomVx = (Math.random() - 0.5) * 2;
            const randomVy = (Math.random() - 0.5) * 2;
            
            gameEngine.createElement(swarm, 'creature', {
                x: randomX,
                y: randomY,
                vx: randomVx,
                vy: randomVy
            });
            console.log('🐱 Added new cat!');
        }
    });
    
    document.getElementById('add-butterfly-btn').addEventListener('click', () => {
        gameEngine.createSwarm('🦋', 'wander', 1.5, 1);
        console.log('🦋 Added new butterfly!');
    });
    
    // Mouse interaction behaviors
    document.getElementById('chase-mouse-btn').addEventListener('click', () => {
        gameEngine.createSwarm('🐕', 'chase', 2, 3);
        console.log('🐕 Added dogs that chase mouse!');
    });
    
    document.getElementById('flee-mouse-btn').addEventListener('click', () => {
        gameEngine.createSwarm('🐰', 'flee', 2.5, 5);
        console.log('🐰 Added rabbits that flee from mouse!');
    });
    
    document.getElementById('orbit-mouse-btn').addEventListener('click', () => {
        gameEngine.createSwarm('⭐', 'orbit', 3, 4);
        console.log('⭐ Added stars that orbit mouse!');
    });
    
    document.getElementById('seek-targets-btn').addEventListener('click', () => {
        gameEngine.createSwarm('🔥', 'seek-targets', 2, 6);
        console.log('🔥 Added fires that seek click targets!');
    });
    
    // Behavior modifications
    document.getElementById('make-chasers-btn').addEventListener('click', () => {
        gameEngine.modifyElement('swarm', 'behavior', 'chase');
        console.log('🎯 Made all creatures chase mouse!');
    });
    
    document.getElementById('make-wanderers-btn').addEventListener('click', () => {
        gameEngine.modifyElement('swarm', 'behavior', 'wander');
        console.log('🚶 Made all creatures wander!');
    });
    
    document.getElementById('make-orbiters-btn').addEventListener('click', () => {
        gameEngine.modifyElement('swarm', 'behavior', 'orbit');
        console.log('🌀 Made all creatures orbit mouse!');
    });
    
    // Speed controls
    document.getElementById('speed-up-btn').addEventListener('click', () => {
        gameEngine.modifyElement('swarm', 'speed', '4');
        console.log('⚡ Sped up all creatures!');
    });
    
    document.getElementById('slow-down-btn').addEventListener('click', () => {
        gameEngine.modifyElement('swarm', 'speed', '0.5');
        console.log('🐌 Slowed down all creatures!');
    });
    
    document.getElementById('normal-speed-btn').addEventListener('click', () => {
        gameEngine.modifyElement('swarm', 'speed', '2');
        console.log('🏃 Reset to normal speed!');
    });
    
    // World management
    document.getElementById('clear-world-btn').addEventListener('click', () => {
        gameEngine.removeElement('creature');
        console.log('🧹 Cleared all creatures!');
    });
    
    document.getElementById('clear-swarms-btn').addEventListener('click', () => {
        gameEngine.removeElement('swarm');
        console.log('💨 Cleared all swarms!');
    });
    
    document.getElementById('cat-swarm-btn').addEventListener('click', () => {
        gameEngine.createSwarm('🐱', 'wander', 2, 10);
        console.log('🐱x10 Added cat swarm!');
    });
    
    document.getElementById('fish-school-btn').addEventListener('click', () => {
        gameEngine.createSwarm('🐟', 'orbit', 2.5, 8);
        console.log('🐟 Added fish school that orbits!');
    });
    
    document.getElementById('bug-party-btn').addEventListener('click', () => {
        const bugs = ['🐛', '🦗', '🕷️', '🐜'];
        bugs.forEach(bug => {
            gameEngine.createSwarm(bug, 'chase', Math.random() * 2 + 1, 2);
        });
        console.log('🐛 Added bug party!');
    });
}
