const state = {
    wishes: [], 
    tasks: [], 
    pendingWishes: [], 
    pendingTasks: [], 
    personality: { aiPreference: '', environment: '', visualMode: '' },
    theme: { color: '#8b5cf6', accent: '#ec4899', name: 'Awaiting Growth', desc: 'Define your essence to begin the cycle of life.' },
    initialized: false
};

const flowersMap = {
    'gemini-home-dark': {
        name: 'Mystic Frost Rose',
        desc: 'A spirit that finds beauty in the quietest, coldest nights. Resilient and mysterious.',
        color: '#8b5cf6', petals: 32
    },
    'gemini-home-light': {
        name: 'Lunar Peony',
        desc: 'Gentle and serene, you reflect the calm beauty of the moonlight.',
        color: '#0700d2ff', petals: 34
    },
    'gemini-outside-dark': {
        name: 'Crimson Heart Bloom',
        desc: 'A passionate spirit that burns with the intensity of a summer sun.',
        color: '#ef4444', petals: 38
    },
    'gemini-outside-light': {
        name: 'Radiant Sun-Lily',
        desc: 'Brimming with joy and warmth, your spirit follows the light and brings happiness.',
        color: '#fbbf24', petals: 36
    },
    'chatgpt-home-dark': {
        name: 'Emerald Nightshade',
        desc: 'A rare and hardy spirit that thrives in the deepest shadows of winter.',
        color: '#22c55e', petals: 32
    },
    'chatgpt-home-light': {
        name: 'Silver Ice Orchid',
        desc: 'Strong, independent, and sharp-witted. You shine with a unique brilliance.',
        color: '#38bdf8', petals: 28
    },
    'chatgpt-outside-dark': {
        name: 'Electric Night-Bloom',
        desc: 'Bold, daring, and full of energy. You thrive where others fear to go.',
        color: '#ec4899', petals: 40
    },
    'chatgpt-outside-light': {
        name: 'Desert Mirage Poppy',
        desc: 'Rare and tenacious, you find life where others see emptiness.',
        color: '#f97316', petals: 30
    }
};

const wisdom = [
    { title: "Inner Peace", text: "Growth is not a race, it's a quiet revolution.", icon: "🕊️" },
    { title: "Resilience", text: "The stars can't shine without darkness.", icon: "💎" },
    { title: "Boundless", text: "Your potential is limited only by your imagination.", icon: "🌌" },
    { title: "Consistency", text: "Every small task is a step towards greatness.", icon: "🌱" },
    { title: "Patience", text: "Be patient with yourself; you are a work of art.", icon: "🎨" },
    { title: "Flourishing", text: "The universe resides within your every breath.", icon: "✨" },
    { title: "Compassion", text: "Kindness is the soil where creativity bloom.", icon: "❤️" },
    { title: "Focus", text: "Energy flows where your focus goes.", icon: "🎯" },
    { title: "Worthy", text: "You are worthy of the dreams you hold.", icon: "🌟" },
    { title: "Authentic", text: "Stay wild, stay free, stay you.", icon: "🦋" }
];

// UI Actions
function showSection(id) { document.getElementById(id).classList.remove('hidden'); }
function closeSection() { document.querySelectorAll('.overlay-section').forEach(s => s.classList.add('hidden')); }

function setChoice(type, value, event) {
    state.personality[type] = value;
    const group = event.currentTarget.parentElement;
    group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function scrollToSection(id) { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); }
function scrollToAccount() { document.getElementById('account-section').scrollIntoView({ behavior: 'smooth' }); }

function activateGrowth() {
    const { aiPreference, environment, visualMode } = state.personality;
    if (!aiPreference || !environment || !visualMode) { alert("Answer all questions first."); return; }
    const key = `${aiPreference}-${environment}-${visualMode}`;
    const result = flowersMap[key] || flowersMap['gemini-home-dark'];
    state.theme = { ...result };
    state.initialized = true;
    const ball = document.querySelector('.flower-core-ball');
    ball.style.background = `radial-gradient(circle at 30% 30%, #fff, ${state.theme.color})`;
    ball.style.boxShadow = `0 0 50px ${state.theme.color}88`;
    document.getElementById('flower-name').innerText = state.theme.name;
    document.getElementById('flower-desc').innerText = state.theme.desc;
    spawnPetal();
    closeSection();
    saveState();
}

function addWish() {
    const input = document.getElementById('wish-input');
    const text = input.value.trim();
    if (!text) return;
    const id = Date.now();
    state.pendingWishes.push({ id, text });
    renderTodoList();
    input.value = '';
    closeSection();
    saveState();
}

function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    if (!text) return;
    const id = Date.now();
    state.pendingTasks.push({ id, text });
    renderTodoList();
    input.value = '';
    closeSection();
    saveState();
}

function completeItem(type, id) {
    if (type === 'wish') {
        const item = state.pendingWishes.find(w => w.id === id);
        state.wishes.push(item.text);
        state.pendingWishes = state.pendingWishes.filter(w => w.id !== id);
        spawnStar();
    } else {
        const item = state.pendingTasks.find(t => t.id === id);
        state.tasks.push(item.text);
        state.pendingTasks = state.pendingTasks.filter(t => t.id !== id);
        spawnPetal();
    }
    renderTodoList();
    saveState();
}

function renderTodoList() {
    const wishList = document.getElementById('wish-history');
    const taskList = document.getElementById('task-history');
    const wishCount = document.getElementById('wish-count');
    const taskCount = document.getElementById('task-count');

    wishList.innerHTML = '';
    state.pendingWishes.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div class="todo-check" onclick="completeItem('wish', ${item.id})"></div>
            <div class="todo-text">${item.text}</div>
        `;
        wishList.appendChild(div);
    });

    taskList.innerHTML = '';
    state.pendingTasks.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div class="todo-check" onclick="completeItem('task', ${item.id})"></div>
            <div class="todo-text">${item.text}</div>
        `;
        taskList.appendChild(div);
    });

    wishCount.innerText = `${state.pendingWishes.length} waiting`;
    taskCount.innerText = `${state.pendingTasks.length} waiting`;
}

// Spawning Engines
function spawnStar() {
    const sky = document.getElementById('sky-background');
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.classList.add("star-svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z");
    svg.appendChild(path);
    svg.style.left = `${Math.random() * 95}%`;
    svg.style.top = `${Math.random() * 95}%`;
    sky.appendChild(svg);
}

function spawnFlowerInSky() {
    const sky = document.getElementById('sky-background');
    const flower = document.createElement('div');
    flower.style.position = 'absolute';
    flower.style.left = `${Math.random() * 95}%`;
    flower.style.top = `${Math.random() * 95}%`;
    flower.innerText = '🌸';
    flower.style.filter = `drop-shadow(0 0 10px ${state.theme.color})`;
    sky.appendChild(flower);
}

function spawnPetal() {
    const canvas = document.querySelector('.petals-canvas');
    const count = state.tasks.length;
    canvas.innerHTML = '';
    const layerSize = 12;
    for (let i = 0; i < count; i++) {
        const layerIndex = Math.floor(i / layerSize);
        const indexInLayer = i % layerSize;
        const currentLayerCount = (layerIndex === Math.floor((count - 1) / layerSize)) ? (count % layerSize || layerSize) : layerSize;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 50 100");
        svg.classList.add("petal-svg");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M25 0 C40 30 45 60 25 85 C5 60 10 30 25 0");
        path.setAttribute("fill", state.theme.color);
        svg.appendChild(path);
        const angle = (360 / currentLayerCount) * indexInLayer + (layerIndex * 15);
        const scale = 1 - (layerIndex * 0.15);
        const translateY = layerIndex * 15;
        svg.style.transform = `translateX(-50%) rotate(${angle}deg) translateY(-${translateY}px) scale(${scale})`;
        svg.style.opacity = 1 - (layerIndex * 0.2);
        canvas.appendChild(svg);
    }
    const ball = document.querySelector('.flower-core-ball');
    ball.style.boxShadow = `0 0 ${40 + count * 8}px ${state.theme.color}`;
}

function buildTree() {
    const area = document.getElementById('branches-area');
    wisdom.forEach((item, i) => {
        const wrap = document.createElement('div');
        const side = i % 2 === 0 ? 'left' : 'right';
        wrap.className = `branch-wrap ${side}-side`;
        const node = document.createElement('div');
        node.className = 'timeline-node';
        node.innerText = item.icon;
        const card = document.createElement('div');
        card.className = 'wisdom-card';
        card.innerHTML = `<h4>${item.title}</h4><p>${item.text}</p>`;
        wrap.appendChild(node);
        wrap.appendChild(card);
        area.appendChild(wrap);
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.branch-wrap').forEach(el => observer.observe(el));
}

function buildGallery() {
    const grid = document.getElementById('flower-gallery-grid');
    Object.values(flowersMap).forEach(flower => {
        const cube = document.createElement('div');
        cube.className = 'flower-cube';
        const canvas = document.createElement('div');
        canvas.className = 'preview-canvas';
        const ball = document.createElement('div');
        ball.className = 'preview-ball';
        ball.style.background = `radial-gradient(circle at 30% 30%, #fff, ${flower.color})`;
        ball.style.boxShadow = `0 0 20px ${flower.color}88`;
        const petalsWrap = document.createElement('div');
        petalsWrap.className = 'preview-petals';
        const layerSize = 10;
        for (let i = 0; i < flower.petals; i++) {
            const layerIndex = Math.floor(i / layerSize);
            const indexInLayer = i % layerSize;
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewBox", "0 0 50 100");
            svg.classList.add("preview-petal");
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M25 0 C40 30 45 60 25 85 C5 60 10 30 25 0");
            path.setAttribute("fill", flower.color);
            svg.appendChild(path);
            const angle = (360 / layerSize) * indexInLayer + (layerIndex * 20);
            const scale = 0.8 - (layerIndex * 0.15);
            const translateY = layerIndex * 8;
            svg.style.transform = `translateX(-50%) rotate(${angle}deg) translateY(-${translateY}px) scale(${scale})`;
            svg.style.opacity = 0.9 - (layerIndex * 0.2);
            petalsWrap.appendChild(svg);
        }
        canvas.appendChild(ball);
        canvas.appendChild(petalsWrap);
        cube.innerHTML = `<h4>${flower.name}</h4><p>${flower.desc}</p>`;
        cube.prepend(canvas);
        grid.appendChild(cube);
    });
}

function saveState() {
    localStorage.setItem('gardenState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('gardenState');
    if (saved) {
        Object.assign(state, JSON.parse(saved));
        return true;
    }
    return false;
}

function applyGrowthTheme() {
    const ball = document.querySelector('.flower-core-ball');
    if (ball && state.theme) {
        ball.style.background = `radial-gradient(circle at 30% 30%, #fff, ${state.theme.color})`;
        ball.style.boxShadow = `0 0 50px ${state.theme.color}88`;
        document.getElementById('flower-name').innerText = state.theme.name;
        document.getElementById('flower-desc').innerText = state.theme.desc;
    }
}

window.onload = () => {
    buildTree();
    buildGallery();

    if (loadState()) {
        if (state.initialized) {
            applyGrowthTheme();
            // Restore stars
            state.wishes.forEach(() => spawnStar());
            // Restore petals
            spawnPetal();
        }
        renderTodoList();
    }
};
