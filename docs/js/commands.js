let categoriesData = [];
let activeCmdId = null;

const USER_BADGE_URLS = [
    "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/2",
    "https://static-cdn.jtvnw.net/badges/v1/4d9e9812-ba9b-48a6-8690-13f3f338ee65/2",
    "https://static-cdn.jtvnw.net/badges/v1/72f2a6ac-3d9b-4406-b9e9-998b27182f61/2",
    "https://static-cdn.jtvnw.net/badges/v1/655dac77-0b2f-4b62-8871-6ae21f82b34e/2",
    "https://static-cdn.jtvnw.net/badges/v1/3ff668be-59a3-4e3e-96af-e6b2908b3171/2",
    "https://static-cdn.jtvnw.net/badges/v1/aef2cd08-f29b-45a1-8c12-d44d7fd5e6f0/2",
    "https://static-cdn.jtvnw.net/badges/v1/4149750c-9582-4515-9e22-da7d5437643b/2",
    "https://static-cdn.jtvnw.net/badges/v1/e33e0c67-c380-4241-828a-099c46e51c66/2",
    "https://static-cdn.jtvnw.net/badges/v1/199a0dba-58f3-494e-a7fc-1fa0a1001fb8/2",
    "https://static-cdn.jtvnw.net/badges/v1/e79ee64f-31f1-4485-9c81-b93957e69f8a/2",
    "https://static-cdn.jtvnw.net/badges/v1/3158e758-3cb4-43c5-94b3-7639810451c5/2",
    "https://static-cdn.jtvnw.net/badges/v1/2de71f4f-b152-4308-a426-127a4cf8003a/2",
    "https://static-cdn.jtvnw.net/badges/v1/5864739a-5e58-4623-9450-a2c0555ef90b/2",
    "https://static-cdn.jtvnw.net/badges/v1/2040d479-b815-4617-8a55-9aed027e30d0/2",
    "https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/2",
    "https://static-cdn.jtvnw.net/badges/v1/1d833bde-edc7-4d23-b7b6-ad5a13296675/2",
    "https://static-cdn.jtvnw.net/badges/v1/1d4b03b9-51ea-42c9-8f29-698e3c85be3d/2",
    "https://static-cdn.jtvnw.net/badges/v1/57b6bd6b-a1b5-4204-9e6c-eb8ed5831603/2",
    "https://static-cdn.jtvnw.net/badges/v1/81d89508-850c-45ae-b0e2-dbbe6e531b8d/2",
    "https://static-cdn.jtvnw.net/badges/v1/e2ba99f4-6079-44d1-8c07-4ca6b58de61f/2",
    "https://static-cdn.jtvnw.net/badges/v1/48b26ab3-c9f1-4f16-b02d-fe877be389fd/2",
    "https://static-cdn.jtvnw.net/badges/v1/a9c01f28-179e-486d-a4c7-2277e4f6adb4/2",
    "https://static-cdn.jtvnw.net/badges/v1/178077b2-8b86-4f8d-927c-66ed6c1b025f/2",
    "https://static-cdn.jtvnw.net/badges/v1/a539dc18-ae19-49b0-98c4-8391a594332b/2",
    "https://static-cdn.jtvnw.net/badges/v1/7c39aa87-4659-4e8f-abaf-c29614cd8a29/2",
    "https://static-cdn.jtvnw.net/badges/v1/3f728095-b84d-4e7e-9eee-541ea02ddea0/2",
    "https://static-cdn.jtvnw.net/badges/v1/58d48669-bfee-46e7-a83c-b65a30783400/2",
    "https://static-cdn.jtvnw.net/badges/v1/be750d4d-a3b9-4116-ae75-6ee4f3294a19/2",
    "https://static-cdn.jtvnw.net/badges/v1/4dc7b047-8c59-4522-97f2-24fb63147f56/2",
    "https://static-cdn.jtvnw.net/badges/v1/2ef2cd27-2210-4640-bbf8-69b5c4d9e302/2",
    "https://static-cdn.jtvnw.net/badges/v1/ce9e266a-f490-4fb2-9989-aee20036bfa5/2",
    "https://static-cdn.jtvnw.net/badges/v1/ca980da1-3639-48a6-95a3-a03b002eb0e5/2",
    "https://static-cdn.jtvnw.net/badges/v1/1e3b6965-2224-44d1-a67a-6d186c1fb17d/2"
];

const BOT_BADGE_URLS = [
    "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2",
    "https://static-cdn.jtvnw.net/badges/v1/3ffa9565-c35b-4cad-800b-041e60659cf2/2",
    "https://cdn.chatterinohomies.com/badges/0e0a0568-193a-470e-ac4a-957a9fdd2c68/36.webp"
];

const USER_COLORS = [
    "#A0A0A0",
    "#FF4D4D",
    "#5C5CFF",
    "#00FF00",
    "#D65151",
    "#FF7F50",
    "#A9DF38",
    "#FF5E1A",
    "#44C27F",
    "#E6B830",
    "#E58137",
    "#7FB3B5",
    "#1E90FF",
    "#FF69B4",
    "#A357FF",
    "#00FF7F"
];

function getRandomUsername() {
    const adjectives = ["mylast", "itz", "i", "our", "my", "pw", "kto", "mega", "salad", "me", "potat", "i_"];
    const nouns = ["november", "kit", "67", "good", "b", "wolf", "lulw", "lule", "sen", "mant", "bot", "gwesty"];
    const postnouns = ["", "b", "ninja", "ma", "user", "october", "bot", "_12", "6", "at", "i", "_i"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const postnoun = postnouns[Math.floor(Math.random() * postnouns.length)];
    return `${adj}${noun}${postnoun}`;
}

function getRandomUserBadgesHtml() {
    if (!USER_BADGE_URLS.length) return '';
    const url = USER_BADGE_URLS[Math.floor(Math.random() * USER_BADGE_URLS.length)];
    let html = `<img src="${url}" class="chat-badge" alt="badge" />`;
    return html;
}

function getRandomUserColor() {
    if (!USER_COLORS.length) return '#ff6b6b';
    const color = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
    return color;
}

function getBotBadgesHtml() {
    if (!BOT_BADGE_URLS.length) return '';
    return BOT_BADGE_URLS.map(url => `<img src="${url}" class="chat-badge" alt="bot-badge" />`).join('');
}

async function initCommandsPage() {
    try {
        if (typeof marked === 'undefined') {
            await loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js');
        }
        setupMarkedRenderer();

        const lightbox = document.getElementById('lightbox');
        const lightboxClose = document.getElementById('lightboxClose');
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) closeLightbox();
        });

        const res = await fetch('/static/commands.json');
        const data = await res.json();
        categoriesData = data.categories || [];

        renderSidebar(categoriesData);

        const searchInput = document.getElementById('cmd_search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
        }

        const urlParams = new URLSearchParams(window.location.search);
        const initialCmd = urlParams.get('i') || (categoriesData[0]?.commands[0]?.id);
        if (initialCmd) {
            selectCommand(initialCmd, false);
        }
    } catch (err) {
        console.error("failed to load commands index:", err);
    }
}

function renderSidebar(categories) {
    const container = document.getElementById('categories_container');
    if (!container) return;
    container.innerHTML = '';

    categories.forEach((cat, index) => {
        const catGroup = document.createElement('div');
        catGroup.className = 'cat-group';

        const header = document.createElement('div');
        header.className = 'cat-header';
        header.innerHTML = `
                    <span class="cat-title">${cat.title}</span>
                    <span class="cat-arrow">▽</span>
                `;

        const body = document.createElement('div');
        body.className = 'cat-body';

        header.addEventListener('click', () => {
            body.classList.toggle('collapsed');
            const arrow = header.querySelector('.cat-arrow');
            arrow.style.transform = body.classList.contains('collapsed') ? 'rotate(-90deg)' : 'rotate(0deg)';
        });

        cat.commands.forEach(cmd => {
            const btn = document.createElement('button');
            btn.className = `cmd-item ${cmd.id === activeCmdId ? 'active' : ''}`;
            btn.dataset.id = cmd.id;
            btn.textContent = cmd.name;
            btn.addEventListener('click', () => selectCommand(cmd.id, true));
            body.appendChild(btn);
        });

        catGroup.appendChild(header);
        catGroup.appendChild(body);
        container.appendChild(catGroup);
    });
}

function handleSearch(query) {
    const q = query.toLowerCase().trim();
    const container = document.getElementById('categories_container');
    if (!container) return;

    const catGroups = container.querySelectorAll('.cat-group');
    catGroups.forEach(group => {
        const body = group.querySelector('.cat-body');
        const items = group.querySelectorAll('.cmd-item');
        let hasVisible = false;

        items.forEach(item => {
            const match = item.textContent.toLowerCase().includes(q);
            item.style.display = match ? 'block' : 'none';
            if (match) hasVisible = true;
        });

        if (q !== '') {
            group.style.display = hasVisible ? 'block' : 'none';
            body.classList.remove('collapsed');
        } else {
            group.style.display = 'block';
        }
    });
}

async function selectCommand(cmdId, updateUrl = true) {
    activeCmdId = cmdId;

    if (updateUrl) {
        const newUrl = `${window.location.pathname}?i=${encodeURIComponent(cmdId)}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    document.querySelectorAll('.cmd-item').forEach(el => {
        el.classList.toggle('active', el.dataset.id === cmdId);
    });

    const detailsContainer = document.getElementById('command_details');
    if (!detailsContainer) return;

    try {
        const cmdInfoPath = cmdId.replaceAll("_", "/");
        const res = await fetch(`/static/commands/${cmdInfoPath}.json`);
        if (!res.ok) throw new Error("command not found");
        const data = await res.json();
        renderCommandDetails(data);
    } catch (err) {
        console.error(err)
        detailsContainer.innerHTML = `<span class="text" style="color: #ff6b6b; font-size: 13px;">error loading details for "${cmdId}"</span>`;
    }
}

function renderCommandDetails(data) {
    const container = document.getElementById('command_details');
    if (!container) return;

    const baseCmdName = data.usage ? data.usage.split(' ')[0] : data.name;

    let html = `
                <div style="margin-bottom: 8px;">
                    <h2 class="title" style="font-size: 30px; margin: 0 0 6px 0;">${escapeHtml(data.name)}</h2>
                    <span class="text" style="font-size: 14px; line-height: 1.4; opacity: 0.9;">${escapeHtml(data.info) || 'no description provided'}</span>
                </div>

                <div class="card-box">
                    <span class="bold-text" style="display: block; font-size: 15px; margin-bottom: 4px; opacity: 0.75;">usage</span>
                    <div class="code-block">_${escapeHtml(data.usage || data.name)}</div>
                </div>
            `;

    if (data.examples && data.examples.length > 0) {
        html += `<div class="card-box"><span class="bold-text" style="display: block; font-size: 15px; margin-bottom: 4px; opacity: 0.75;">examples</span>`;
        data.examples.forEach(ex => {
            const randomUser = escapeHtml(getRandomUsername());
            const userMsg = escapeHtml(ex.user ? ex.user : `_${baseCmdName}`);
            const userBadges = getRandomUserBadgesHtml();
            const botBadges = getBotBadgesHtml();
            const userColor = getRandomUserColor();

            html += `
                        <div class="chat-example">
                            <div>${userBadges}<span class="chat-user" style="color: ${userColor};">${randomUser}:</span> <span style="color: #fff;">${userMsg}</span></div>
                            <div class="chat-reply-line">▷ replying to @${randomUser}: ${userMsg}</div>
                            ${ex.bot ? `<div>${botBadges}<span class="chat-bot">butterbror:</span> <span style="color: #fff;">${escapeHtml(ex.bot)}</span></div>` : ''}
                        </div>
                    `;
        });
        html += `</div>`;
    }

    if (data.aliases && data.aliases.length > 0) {
        html += `<div class="card-box"><span class="bold-text" style="display: block; font-size: 15px; margin-bottom: 4px; opacity: 0.75;">aliases</span>`;
        data.aliases.forEach(a => { html += `<span class="badge">_${escapeHtml(a)}</span>`; });
        html += `</div>`;
    }

    const mdContent = data.description || data.details;
    if (mdContent) {
        const parsedMd = (typeof marked !== 'undefined') ? marked.parse(mdContent) : mdContent;
        html += `
        <div class="card-box">
            <span class="bold-text" style="display: block; font-size: 15px; margin-bottom: 4px; opacity: 0.75;">description</span>
            <div class="code-block">
                <div class="markdown-body">${parsedMd}</div>
            </div>
        </div>
    `;
    }

    let metaCols = '';

    if (data.cooldown !== undefined && data.cooldown !== null) {
        metaCols += `<div><span class="bold-text" style="display: block; font-size: 15px; opacity: 0.75;">cooldown</span><span class="text" style="font-size: 14px; color: var(--bright);">${data.cooldown}s</span></div>`;
    }

    if (data.requirementRoles && data.requirementRoles.length > 0) {
        const rolesHtml = data.requirementRoles.map(r => `<span class="badge badge-role">${escapeHtml(r)}</span>`).join('');
        metaCols += `<div><span class="bold-text" style="display: block; font-size: 15px; opacity: 0.75; margin-bottom: 2px;">roles</span><div>${rolesHtml}</div></div>`;
    }

    const platType = data.platformCompatibilityType || 'whitelist';
    const platList = data.platformCompatibilityList || [];

    if (platType === 'whitelist') {
        if (platList.length > 0) {
            metaCols += `<div><span class="bold-text" style="display: block; font-size: 15px; opacity: 0.75;">platforms</span><span class="text" style="font-size: 14px;">${escapeHtml(platList.join(', '))}</span></div>`;
        }
    } else if (platType === 'blacklist') {
        if (platList.length > 0) {
            metaCols += `<div><span class="bold-text" style="display: block; font-size: 15px; opacity: 0.75;">disabled on</span><span class="text" style="font-size: 14px; color: #ff6b6b;">${escapeHtml(platList.join(', '))}</span></div>`;
        }
    }

    if (metaCols) {
        html += `<div class="card-box" style="display: flex; gap: 20px; flex-wrap: wrap;">${metaCols}</div>`;
    }

    container.innerHTML = html;
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

window.openLightbox = function (src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeLightbox = function () {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
};

function setupMarkedRenderer() {
    if (typeof marked === 'undefined') return;

    const renderer = new marked.Renderer();
    renderer.image = function ({ href, title, text }) {
        const titleAttr = title ? ` title="${title}"` : '';
        return `<figure><img src="${href}" alt="${text || ''}"${titleAttr} onclick="openLightbox(this.src)"></figure>`;
    };
    renderer.table = function (token) {
        let headerHtml = token.header.map(cell => `<th>${marked.parseInline(cell.text)}</th>`).join('');
        let bodyHtml = token.rows.map(row => `<tr>${row.map(cell => `<td>${marked.parseInline(cell.text)}</td>`).join('')}</tr>`).join('');
        return `<div class="table-container"><table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
    };

    marked.setOptions({ renderer: renderer, breaks: true, gfm: true });
}

window.addEventListener('popstate', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cmd = urlParams.get('i');
    if (cmd) selectCommand(cmd, false);
});

initCommandsPage();