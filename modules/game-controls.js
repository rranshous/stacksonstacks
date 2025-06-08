/**
 * Game Controls - Button event handlers for game interactions
 */
export function setupGameControls(gameEngine) {
    // Initialize snapshot gallery with existing snapshots
    initializeSnapshotGallery();
    
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
        console.log('🧹 Cleared creatures only!');
    });
    
    document.getElementById('clear-swarms-btn').addEventListener('click', () => {
        gameEngine.removeElement('creature');
        gameEngine.removeElement('swarm');
        gameEngine.removeElement('obstacle');
        console.log('💨 Cleared everything (creatures, swarms, obstacles)!');
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
    
    // Obstacle creation buttons
    document.getElementById('add-rock-btn')?.addEventListener('click', () => {
        gameEngine.createObstacle('🗿', Math.random() * 700 + 50, Math.random() * 500 + 50, 60, 60, 'static', 'solid');
        console.log('🗿 Added solid rock obstacle!');
    });
    
    document.getElementById('add-tree-btn')?.addEventListener('click', () => {
        gameEngine.createObstacle('🌲', Math.random() * 700 + 50, Math.random() * 500 + 50, 40, 80, 'static', 'solid');
        console.log('🌲 Added tree obstacle!');
    });
    
    document.getElementById('add-spinning-btn')?.addEventListener('click', () => {
        gameEngine.createObstacle('🌀', Math.random() * 700 + 50, Math.random() * 500 + 50, 50, 50, 'rotating', 'solid');
        console.log('🌀 Added spinning obstacle!');
    });
    
    // Game creation buttons
    document.getElementById('create-intro-game-btn')?.addEventListener('click', () => {
        gameEngine.createIntroGame();
        console.log('🏠 Created intro game: Guide the cat home!');
    });
    
    // Snapshot functionality (DOM-everything approach)
    document.getElementById('save-snapshot-btn').addEventListener('click', () => {
        createSnapshot();
    });
    
    // Create a snapshot using pure DOM approach
    function createSnapshot() {
        const gameWorld = document.querySelector('game-world');
        const gallery = document.getElementById('snapshots-gallery');
        
        if (!gameWorld) return;
        
        // Debug: Show current live swarms (direct children only)
        const currentLiveSwarms = Array.from(gameWorld.children).filter(child => 
            child.tagName.toLowerCase() === 'swarm'
        );
        console.log(`📊 Creating snapshot with ${currentLiveSwarms.length} live swarms:`);
        currentLiveSwarms.forEach((swarm, i) => {
            const creatures = swarm.querySelectorAll('creature');
            console.log(`  Swarm ${i}: ${swarm.getAttribute('emoji')} (${creatures.length} creatures, behavior: ${swarm.getAttribute('behavior')})`);
        });
        
        // Generate a magical name for this moment
        const names = [
            'Firefly Dance', 'Zen Pond', 'Magical Swimming', 'Peaceful Waters',
            'Glowing Night', 'Pond Harmony', 'Sparkle Time', 'Gentle Swim',
            'Magic Moment', 'Serene Pond', 'Dancing Lights', 'Calm Waters'
        ];
        const snapshotName = names[Math.floor(Math.random() * names.length)];
        
        // Create snapshot element containing current game state
        const snapshot = document.createElement('snapshot');
        snapshot.setAttribute('name', snapshotName);
        snapshot.setAttribute('created', new Date().toLocaleTimeString());
        
        // Deep clone only live swarms (direct children) to prevent mutation
        const clonedContent = currentLiveSwarms.map(swarm => {
            const clone = swarm.cloneNode(true);
            return clone.outerHTML;
        }).join('\n');
        
        snapshot.innerHTML = clonedContent;
        
        // Add to game world (nested recursive snapshots)
        gameWorld.appendChild(snapshot);
        
        // Create gallery button for navigation
        const snapshotBtn = document.createElement('button');
        snapshotBtn.textContent = `🌟 ${snapshotName}`;
        snapshotBtn.style.display = 'block';
        snapshotBtn.style.margin = '3px 0';
        snapshotBtn.style.fontSize = '10px';
        snapshotBtn.style.padding = '6px 8px';
        
        snapshotBtn.addEventListener('click', () => {
            restoreSnapshot(snapshotName);
        });
        
        gallery.appendChild(snapshotBtn);
        
        console.log(`📸 Saved magical moment: "${snapshotName}" with ${clonedContent.length} chars of frozen content`);
    }
    
    // Restore a snapshot using DOM traversal
    function restoreSnapshot(snapshotName) {
        const gameWorld = document.querySelector('game-world');
        const snapshot = document.querySelector(`snapshot[name="${snapshotName}"]`);
        
        if (!snapshot || !gameWorld) {
            console.log(`❌ Snapshot "${snapshotName}" not found`);
            return;
        }
        
        console.log(`🔄 Restoring snapshot: "${snapshotName}"`);
        
        // Debug: Show current live swarms (direct children only)
        const currentLiveSwarms = Array.from(gameWorld.children).filter(child => 
            child.tagName.toLowerCase() === 'swarm'
        );
        const snapshotSwarms = snapshot.querySelectorAll('swarm');
        
        console.log(`📊 Current live swarms: ${currentLiveSwarms.length}`);
        currentLiveSwarms.forEach((swarm, i) => {
            const creatures = swarm.querySelectorAll('creature');
            console.log(`  Swarm ${i}: ${swarm.getAttribute('emoji')} (${creatures.length} creatures)`);
        });
        
        console.log(`📸 Snapshot swarms: ${snapshotSwarms.length}`);
        snapshotSwarms.forEach((swarm, i) => {
            const creatures = swarm.querySelectorAll('creature');
            console.log(`  Swarm ${i}: ${swarm.getAttribute('emoji')} (${creatures.length} creatures)`);
        });
        
        // Preserve all snapshots (remove them from DOM temporarily)
        const allSnapshots = Array.from(gameWorld.querySelectorAll('snapshot'));
        console.log(`💾 Preserving ${allSnapshots.length} snapshots`);
        allSnapshots.forEach(snap => snap.remove());
        
        // Remove only live swarms (direct children)
        currentLiveSwarms.forEach(swarm => swarm.remove());
        
        // Restore the snapshot content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = snapshot.innerHTML;
        
        // Add back the restored swarms as direct children
        Array.from(tempDiv.children).forEach(child => {
            if (child.tagName.toLowerCase() === 'swarm') {
                gameWorld.appendChild(child);
            }
        });
        
        // Add back all preserved snapshots
        allSnapshots.forEach(snap => {
            gameWorld.appendChild(snap);
        });
        
        // Debug: Show what we restored
        const restoredSwarms = gameWorld.querySelectorAll('swarm:not(snapshot swarm)');
        console.log(`✅ Restored ${restoredSwarms.length} swarms`);
        restoredSwarms.forEach((swarm, i) => {
            const creatures = swarm.querySelectorAll('creature');
            console.log(`  Swarm ${i}: ${swarm.getAttribute('emoji')} (${creatures.length} creatures)`);
        });
        
        console.log(`🌟 Restored to magical moment: "${snapshotName}"`);
    }
    
    // Initialize gallery with existing snapshots in DOM
    function initializeSnapshotGallery() {
        const gallery = document.getElementById('snapshots-gallery');
        const existingSnapshots = document.querySelectorAll('snapshot[name]');
        
        existingSnapshots.forEach(snapshot => {
            const snapshotName = snapshot.getAttribute('name');
            
            const snapshotBtn = document.createElement('button');
            snapshotBtn.textContent = `🌟 ${snapshotName}`;
            snapshotBtn.style.display = 'block';
            snapshotBtn.style.margin = '3px 0';
            snapshotBtn.style.fontSize = '10px';
            snapshotBtn.style.padding = '6px 8px';
            
            snapshotBtn.addEventListener('click', () => {
                restoreSnapshot(snapshotName);
            });
            
            gallery.appendChild(snapshotBtn);
        });
        
        if (existingSnapshots.length > 0) {
            console.log(`🌟 Found ${existingSnapshots.length} existing magical moments`);
        }
    }
}
