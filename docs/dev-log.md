# Development Log - AI Game Creation Collab

*Living document tracking our technical decisions and current progress*

## 📅 Current Session - June 6, 2025

### 🧹 **CLEANUP: Removed Unused Element Definitions**
**Date**: Current session  
**Action**: Removed the entire `<element-definitions>` section from `index.html`

**Rationale**:
- Section was not being used by the current separated concerns architecture
- Game engine operates directly on live DOM elements in `<game-world>`
- Definitions were redundant with runtime game state
- Simplifies HTML structure and reduces confusion

**Result**: Clean HTML with only essential `<game-world>` section for live state.

**Next Step**: Ready to integrate real Anthropic API calls through BFF endpoint.

---

### 🎯 Current State
- **Phase**: Minimal Bootstrap Implementation
- **Goal**: Get AI talking to DOM before building custom elements
- **Files Created**: `index.html` (initial structure)
- **Next**: Build canvas renderer that interprets DOM → visual simulation

### 🔧 Technical Decisions Made

#### **Architecture Stack**
- **Frontend**: Pure HTML5 + Canvas (no frameworks)
- **Backend**: Single BFF (Backend for Frontend) 
- **AI**: Anthropic API via BFF proxy
- **State**: DOM-everything approach (all state lives in DOM)
- **Rendering**: HTML5 Canvas for immediate visual feedback

#### **Implementation Strategy**
**Phase 1 Order** (current):
1. ✅ Bootstrap minimal HTML structure 
2. 🔄 Canvas renderer that interprets DOM → visual simulation
3. ⏳ BFF proxy for Anthropic API calls
4. ⏳ AI modifies DOM → canvas updates automatically  
5. ⏳ Custom elements layer (later)

**Rationale**: Get the AI ↔ DOM interaction working first, then add abstraction layers.

#### **DOM Structure Decisions**
```html
<element-definitions locked="true">
  <!-- Static primitive definitions (AI's vocabulary) -->
</element-definitions>

<game-world>
  <!-- Live game state that AI modifies -->
  <!-- Initial hardcoded swarm for testing -->
</game-world>
```

#### **Canvas Approach**
- **Why Canvas over DOM manipulation**: Immediate visual feedback, better performance for many moving objects
- **DOM as source of truth**: Canvas reads DOM state and renders it
- **Game loop**: RAF loop that reads DOM → updates positions → renders canvas

#### **Initial Hardcoded Simulation**
- Start with `<swarm emoji="🐱" count="5" behavior="wander">`
- Each creature has DOM element with `x, y, vx, vy` attributes
- Canvas renderer interprets this and draws moving cats

### 🎮 Current HTML Structure

```html
<!-- Element Definitions: AI's Vocabulary -->
<element-definitions locked="true">
  <swarm-definition emoji="🐱" behavior="playful,chasing,clustering">
  <flock-definition emoji="🦋" behavior="flutter,avoid-crowding,spiral">
  <!-- etc -->
</element-definitions>

<!-- Game World: Live State -->
<game-world>
  <swarm emoji="🐱" count="5" behavior="wander" speed="2">
    <creature x="100" y="100" vx="1" vy="0.5"></creature>
    <!-- more creatures with positions/velocities -->
  </swarm>
</game-world>
```

### 🔄 Current Data Flow (Target)
1. **DOM contains game state** (creature positions, behaviors)
2. **Canvas renderer reads DOM** every frame
3. **Physics/behavior updates** modify DOM attributes
4. **AI modifications** change DOM structure
5. **Canvas automatically reflects changes**

### 🧠 AI Integration Plan
- **BFF Endpoint**: `/api/interpret` 
- **Request**: `{ command: "voice input", domContext: document.outerHTML }`
- **Response**: `{ toolCalls: [{ name: "create_element", params: {...} }] }`
- **Tools**: `create_element`, `modify_element`, `remove_element`

### 📝 Next Immediate Steps
1. **Create `game-engine.js`** - Canvas renderer + game loop
2. **Test hardcoded swarm** - 5 cats wandering on canvas  
3. **Create simple BFF** - Node.js proxy to Anthropic
4. **Test AI interaction** - "add more cats" → DOM changes
5. **Iterate on behaviors** - make cats more interesting

### 🤔 Open Questions
- **Behavior implementation**: How complex should initial cat "wander" be?
- **Canvas sizing**: Fixed 800x600 or responsive?
- **Physics boundaries**: Wrap around edges or bounce?
- **AI detection of "magical moments"**: Start simple or build in early?

### 💡 Key Insights
- **Start visual first**: Get something moving on canvas before AI integration
- **DOM as database**: Perfect for MCP tools (structured, declarative)
- **Rich primitives**: `<swarm>` vs `<entity behavior="swarm">` - AI reasons better with specific tags
- **Emojis as graphics**: Instant visual variety, scalable, understandable

---

## 📚 Reference
- **Seed Doc**: `/docs/ai-game-creation-collab-seed.md` - Full vision and architecture
- **Current Code**: `/index.html` - HTML structure and styling
- **Next File**: `/game-engine.js` - Canvas renderer and game loop

---

### 🏗️ **MAJOR REFACTOR: Separated Concerns Architecture**
**Date**: Current session
**Reason**: Original game engine was mixing simulation logic with DOM persistence

**New Architecture**:
1. **`DOMSync`** - Pure persistence layer (reads/writes DOM state)
2. **`Simulation`** - Pure game logic (no DOM dependencies)  
3. **`Renderer`** - Pure canvas drawing (takes game state, renders it)
4. **`GameEngine`** - Orchestrates the three concerns

**Benefits**:
- **Testable**: Each class has single responsibility
- **Extensible**: Can swap out rendering or persistence layers
- **Debuggable**: Clear data flow through the system
- **AI-Ready**: Clean interfaces for AI to understand and modify

**Data Flow**:
```
DOM → DOMSync.loadGameState() → Simulation.update() → DOMSync.saveGameState() → DOM
                                       ↓
                              Renderer.render() → Canvas
```

**Files**: 
- `game-engine-v2.js` - New separated concerns implementation
- `game-engine.js` - Original (kept for reference)

---

*Update this log as we make progress and decisions. Keep it concise but complete enough for context switching.*
