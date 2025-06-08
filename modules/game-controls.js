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
        console.log('🎤 Voice collaboration not implemented yet');
        alert('🗣️ Voice collaboration coming soon! Create together by speaking your ideas.');
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
        gameEngine.createSwarm('🐕', 'chase-mouse', 2, 3);
        console.log('🐕 Added dogs that chase mouse!');
    });
    
    document.getElementById('flee-mouse-btn').addEventListener('click', () => {
        gameEngine.createSwarm('🐰', 'flee-mouse', 2.5, 5);
        console.log('🐰 Added rabbits that flee from mouse!');
    });
    
    document.getElementById('orbit-mouse-btn').addEventListener('click', () => {
        gameEngine.createSwarm('⭐', 'orbit-mouse', 3, 4);
        console.log('⭐ Added stars that orbit mouse!');
    });
    
    document.getElementById('seek-targets-btn').addEventListener('click', () => {
        gameEngine.createSwarm('🔥', 'seek-targets', 2, 6);
        console.log('🔥 Added fires that seek click targets!');
    });
    
    // Behavior modifications
    document.getElementById('make-chasers-btn').addEventListener('click', () => {
        gameEngine.modifyElement('swarm', 'behavior', 'chase-mouse');
        console.log('🎯 Made all creatures chase mouse!');
    });
    
    document.getElementById('make-wanderers-btn').addEventListener('click', () => {
        gameEngine.modifyElement('swarm', 'behavior', 'wander');
        console.log('🚶 Made all creatures wander!');
    });
    
    document.getElementById('make-orbiters-btn').addEventListener('click', () => {
        gameEngine.modifyElement('swarm', 'behavior', 'orbit-mouse');
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
        gameEngine.createSwarm('🐟', 'orbit-mouse', 2.5, 8);
        console.log('🐟 Added fish school that orbits!');
    });
    
    document.getElementById('bug-party-btn').addEventListener('click', () => {
        const bugs = ['🐛', '🦗', '🕷️', '🐜'];
        bugs.forEach(bug => {
            gameEngine.createSwarm(bug, 'chase-mouse', Math.random() * 2 + 1, 2);
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
    
    // Snapshot functionality (DOM-everything approach)
    document.getElementById('save-snapshot-btn').addEventListener('click', () => {
        createSnapshot();
    });
    
    // Create a snapshot using pure DOM approach
    function createSnapshot() {
        const gameWorld = document.querySelector('game-world');
        const gallery = document.getElementById('snapshots-gallery');
        
        if (!gameWorld) return;
        
        // Debug: Show current live game elements (direct children only)
        const currentLiveElements = Array.from(gameWorld.children).filter(child => 
            child.tagName.toLowerCase() === 'swarm' || 
            child.tagName.toLowerCase() === 'win-condition' ||
            child.tagName.toLowerCase() === 'obstacle'
        );
        console.log(`🎨 Saving creation with ${currentLiveElements.length} game elements:`);
        currentLiveElements.forEach((element, i) => {
            if (element.tagName.toLowerCase() === 'swarm') {
                const creatures = element.querySelectorAll('creature');
                console.log(`  Group ${i}: ${element.getAttribute('emoji')} (${creatures.length} creatures, behavior: ${element.getAttribute('behavior')})`);
            } else if (element.tagName.toLowerCase() === 'win-condition') {
                const nestedSwarms = element.querySelectorAll('swarm');
                const targets = element.querySelectorAll('target');
                console.log(`  Win-condition: ${element.getAttribute('type')} (${nestedSwarms.length} swarms, ${targets.length} targets)`);
            } else {
                console.log(`  ${element.tagName}: ${element.getAttribute('emoji') || 'unknown'}`);
            }
        });
        
        // Generate a creative name for this creation
        const names = [
            'Creature Playground', 'Wild Adventure', 'Animal Kingdom', 'Nature Scene',
            'Ecosystem Garden', 'Critter World', 'Life Simulation', 'Creature Haven',
            'Interactive Zoo', 'Digital Habitat', 'Living Canvas', 'Creature Chaos'
        ];
        const snapshotName = names[Math.floor(Math.random() * names.length)];
        
        // Create snapshot element containing current game state
        const snapshot = document.createElement('snapshot');
        snapshot.setAttribute('name', snapshotName);
        snapshot.setAttribute('created', new Date().toLocaleTimeString());
        
        // Deep clone all live game elements (not just swarms) to prevent mutation
        const clonedContent = currentLiveElements.map(element => {
            const clone = element.cloneNode(true);
            return clone.outerHTML;
        }).join('\n');
        
        snapshot.innerHTML = clonedContent;
        
        // Add to game world (nested recursive snapshots)
        gameWorld.appendChild(snapshot);
        
        // Create gallery button for navigation
        const snapshotBtn = document.createElement('button');
        snapshotBtn.textContent = `🎮 ${snapshotName}`;
        snapshotBtn.style.display = 'block';
        snapshotBtn.style.margin = '3px 0';
        snapshotBtn.style.fontSize = '10px';
        snapshotBtn.style.padding = '6px 8px';
        
        snapshotBtn.addEventListener('click', () => {
            restoreSnapshot(snapshotName);
        });
        
        gallery.appendChild(snapshotBtn);
        
        console.log(`💾 Saved creation: "${snapshotName}" with ${clonedContent.length} chars of game content`);
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
        
        // Debug: Show current live elements (direct children only)
        const currentLiveElements = Array.from(gameWorld.children).filter(child => 
            child.tagName.toLowerCase() === 'swarm' || 
            child.tagName.toLowerCase() === 'win-condition' ||
            child.tagName.toLowerCase() === 'obstacle'
        );
        const snapshotElements = snapshot.children;
        
        console.log(`📊 Current live elements: ${currentLiveElements.length}`);
        currentLiveElements.forEach((element, i) => {
            console.log(`  ${element.tagName}: ${element.getAttribute('emoji') || element.getAttribute('type') || 'unknown'}`);
        });
        
        console.log(`📸 Snapshot elements: ${snapshotElements.length}`);
        Array.from(snapshotElements).forEach((element, i) => {
            console.log(`  ${element.tagName}: ${element.getAttribute('emoji') || element.getAttribute('type') || 'unknown'}`);
        });
        
        // Preserve all snapshots (remove them from DOM temporarily)
        const allSnapshots = Array.from(gameWorld.querySelectorAll('snapshot'));
        console.log(`💾 Preserving ${allSnapshots.length} snapshots`);
        allSnapshots.forEach(snap => snap.remove());
        
        // Remove only live swarms and win-conditions (direct children) 
        currentLiveElements.forEach(element => element.remove());
        
        // Restore the snapshot content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = snapshot.innerHTML;
        
        // Add back all restored game elements as direct children
        Array.from(tempDiv.children).forEach(child => {
            if (child.tagName.toLowerCase() === 'swarm' || 
                child.tagName.toLowerCase() === 'win-condition' ||
                child.tagName.toLowerCase() === 'obstacle') {
                gameWorld.appendChild(child);
            }
        });
        
        // Add back all preserved snapshots
        allSnapshots.forEach(snap => {
            gameWorld.appendChild(snap);
        });
        
        // Debug: Show what we restored
        const restoredElements = Array.from(gameWorld.children).filter(child => 
            child.tagName.toLowerCase() === 'swarm' || 
            child.tagName.toLowerCase() === 'win-condition' ||
            child.tagName.toLowerCase() === 'obstacle'
        );
        console.log(`✅ Restored ${restoredElements.length} game elements`);
        restoredElements.forEach((element, i) => {
            if (element.tagName.toLowerCase() === 'swarm') {
                const creatures = element.querySelectorAll('creature');
                console.log(`  Swarm: ${element.getAttribute('emoji')} (${creatures.length} creatures)`);
            } else if (element.tagName.toLowerCase() === 'win-condition') {
                const nestedSwarms = element.querySelectorAll('swarm');
                const targets = element.querySelectorAll('target');
                console.log(`  Win-condition: ${element.getAttribute('type')} (${nestedSwarms.length} swarms, ${targets.length} targets)`);
            } else {
                console.log(`  ${element.tagName}: ${element.getAttribute('emoji') || 'unknown'}`);
            }
        });
        
        console.log(`🎮 Loaded game: "${snapshotName}"`);
    }
    
    // Initialize gallery with existing snapshots in DOM
    function initializeSnapshotGallery() {
        const gallery = document.getElementById('snapshots-gallery');
        const existingSnapshots = document.querySelectorAll('snapshot[name]');
        
        existingSnapshots.forEach(snapshot => {
            const snapshotName = snapshot.getAttribute('name');
            
            const snapshotBtn = document.createElement('button');
            snapshotBtn.textContent = `${snapshotName}`;
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
            console.log(`🎮 Found ${existingSnapshots.length} existing game templates`);
        }
    }
}
