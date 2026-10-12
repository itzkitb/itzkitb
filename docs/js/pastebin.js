const CONFIG = {
    apiBaseUrl: 'https://api.tupid.lol/pb/'
};

function escapeAttr(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function sanitizeUrl(url) {
    try {
        const parsed = new URL(url, window.location.origin);
        if (['http:', 'https:', 'data:'].includes(parsed.protocol)) {
            return parsed.href;
        }
    } catch (e) {}
    return '';
}

// ><> marked.js
const renderer = new marked.Renderer();

renderer.image = function ({ href, title, text }) {
    const safeSrc = sanitizeUrl(href || '');
    const safeAlt = escapeAttr(text || '');
    const safeTitle = title ? ` title="${escapeAttr(title)}"` : '';
    
    return `
        <figure>
            <img src="${safeSrc}" alt="${safeAlt}"${safeTitle} data-lightbox>
        </figure>
    `;
};

renderer.table = function (token) {
    let headerHtml = '';
    let bodyHtml = '';

    if (token.header && token.header.length > 0) {
        headerHtml += '<tr>';
        token.header.forEach(cell => {
            headerHtml += `<th>${DOMPurify.sanitize(marked.parseInline(cell.text))}</th>`;
        });
        headerHtml += '</tr>';
    }

    if (token.rows && token.rows.length > 0) {
        token.rows.forEach(row => {
            bodyHtml += '<tr>';
            row.forEach(cell => {
                bodyHtml += `<td>${DOMPurify.sanitize(marked.parseInline(cell.text))}</td>`;
            });
            bodyHtml += '</tr>';
        });
    }

    return `
        <div class="table-container">
            <table>
                <thead>${headerHtml}</thead>
                <tbody>${bodyHtml}</tbody>
            </table>
        </div>
    `;
};

marked.setOptions({
    renderer: renderer,
    breaks: true,
    gfm: true
});

// ><> lightbox with event delegation
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const contentDiv = document.getElementById('content');

    function openLightbox(img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }

    contentDiv.addEventListener('click', (e) => {
        const img = e.target.closest('img[data-lightbox]');
        if (img) openLightbox(img);
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const errorBox = document.getElementById('error-box');
    const loadingDiv = document.getElementById('loading');

    const viewSection = document.getElementById('view-section');
    const editSection = document.getElementById('edit-section');
    const editorTextarea = document.getElementById('editorTextarea');

    const shareBtn = document.getElementById('shareBtn');
    const copyBtn = document.getElementById('copyBtn');
    const newBtn = document.getElementById('newBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    const toast = document.getElementById('toast');

    let markdownContent = "";
    let currentDocId = null;

    shareBtn.addEventListener('click', handleShare);
    copyBtn.addEventListener('click', handleCopy);
    newBtn.addEventListener('click', () => setMode('edit'));
    cancelBtn.addEventListener('click', handleCancelEdit);
    saveBtn.addEventListener('click', handlePublish);

    setupLightbox();
    init();

    async function init() {
        const urlParams = new URLSearchParams(window.location.search);
        currentDocId = urlParams.get('f') || urlParams.get('i');

        if (currentDocId) {
            await fetchDocument(currentDocId);
        } else {
            setMode('edit');
        }
    }

    async function fetchDocument(id) {
        clearError();
        showLoading(true);

        try {
            const response = await fetch(`${CONFIG.apiBaseUrl}${encodeURIComponent(id)}`);

            if (!response.ok) {
                if (response.status === 404) {
                    showError('oops... paste not found on server');
                    return;
                }
                throw new Error(`server returned http ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const json = await response.json();
                markdownContent = json.content || json.data || '';
            } else {
                markdownContent = await response.text();
            }

            // sanitize rendered html to prevent xss
            contentDiv.innerHTML = DOMPurify.sanitize(marked.parse(markdownContent));
            setMode('view');
        } catch (err) {
            console.error(err);
            showError(`failed to load paste: ${err.message}`);
        } finally {
            showLoading(false);
        }
    }

    async function handlePublish() {
        const textToPublish = editorTextarea.value.trim();

        if (!textToPublish) {
            showError('paste content cannot be empty!');
            return;
        }

        clearError();
        showLoading(true);

        try {
            const response = await fetch(`${CONFIG.apiBaseUrl}create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: textToPublish })
            });

            if (!response.ok) {
                throw new Error(`publish failed with status ${response.status}`);
            }

            const result = await response.json();
            const newId = result.id;

            if (newId) {
                const newUrl = `${window.location.pathname}?i=${encodeURIComponent(newId)}`;
                window.history.pushState({ path: newUrl }, '', newUrl);
                currentDocId = newId;
            }

            markdownContent = textToPublish;
            contentDiv.innerHTML = DOMPurify.sanitize(marked.parse(markdownContent));
            setMode('view');
            showToast('published successfully');
        } catch (err) {
            console.error(err);
            showError(`failed to publish: ${err.message}`);
        } finally {
            showLoading(false);
        }
    }

    function setMode(mode) {
        clearError();
        if (mode === 'edit') {
            viewSection.classList.add('hidden');
            editSection.classList.remove('hidden');

            shareBtn.classList.add('hidden');
            copyBtn.classList.add('hidden');
            newBtn.classList.add('hidden');

            saveBtn.classList.remove('hidden');
            cancelBtn.classList.remove('hidden');

            editorTextarea.value = markdownContent;
            editorTextarea.focus();
        } else {
            editSection.classList.add('hidden');
            viewSection.classList.remove('hidden');

            shareBtn.classList.remove('hidden');
            copyBtn.classList.remove('hidden');
            newBtn.classList.remove('hidden');

            saveBtn.classList.add('hidden');
            cancelBtn.classList.add('hidden');
        }
    }

    function handleCancelEdit() {
        if (currentDocId && markdownContent) {
            setMode('view');
        } else {
            editorTextarea.value = '';
            clearError();
        }
    }

    function showError(message) {
        showLoading(false);
        errorBox.textContent = message;
        errorBox.style.display = 'block';
    }

    function clearError() {
        errorBox.textContent = '';
        errorBox.style.display = 'none';
    }

    function showLoading(show) {
        loadingDiv.classList.toggle('hidden', !show);
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    function handleShare() {
        copyData(window.location.href, 'link copied!');
    }

    function handleCopy() {
        copyData(markdownContent, 'content copied!');
    }

    function copyData(text, successMessage) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMessage);
            }).catch(() => {
                copyWithTextarea(text, successMessage);
            });
        } else {
            copyWithTextarea(text, successMessage);
        }
    }

    function copyWithTextarea(text, successMessage) {
        const textarea = document.createElement("textarea");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();

        try {
            if (document.execCommand('copy')) {
                showToast(successMessage);
            } else {
                showToast('copy failed');
            }
        } catch (err) {
            showToast('copy failed');
        }
        document.body.removeChild(textarea);
    }
});