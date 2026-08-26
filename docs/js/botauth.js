const CONFIG = {
    clientId: 'n7kkvjel1ez8zvln4f3c8zvxnfkhvj',
    redirectUri: window.location.origin + '/ba',
    botUsername: 'butterbror',
    apiUrl: 'https://api.tupid.lol',
    scopes: [
        'chat:read',
        'chat:edit',
        'channel:bot',
        'user:bot',
        'user:read:chat',
        'user:write:chat',
        'user:manage:whispers',
        'channel:read:subscriptions',
        'bits:read',
        'moderator:read:chatters'
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const successSection = document.getElementById('success-section');
    const loadingSection = document.getElementById('loading-section');
    const errorBox = document.getElementById('error-box');
    const successBox = document.getElementById('success-box');
    const authBtn = document.getElementById('authBtn');
    const resetBtn = document.getElementById('resetBtn');
    const toast = document.getElementById('toast');

    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    if (authCode) {
        exchangeCode(authCode);
    } else {
        showAuthSection();
    }

    authBtn.addEventListener('click', startAuth);
    resetBtn.addEventListener('click', resetAuth);

    function showAuthSection() {
        authSection.style.display = 'block';
        successSection.style.display = 'none';
        loadingSection.style.display = 'none';
        resetBtn.style.display = 'none';
    }

    function showSuccessSection() {
        authSection.style.display = 'none';
        successSection.style.display = 'block';
        loadingSection.style.display = 'none';
        resetBtn.style.display = 'inline-block';
    }

    function showLoadingSection() {
        authSection.style.display = 'none';
        successSection.style.display = 'none';
        loadingSection.style.display = 'block';
    }

    function showError(message) {
        errorBox.textContent = message;
        errorBox.style.display = 'block';
        setTimeout(() => {
            errorBox.style.display = 'none';
        }, 5000);
    }

    function showSuccess(message) {
        successBox.textContent = message;
        successBox.style.display = 'block';
        setTimeout(() => {
            successBox.style.display = 'none';
        }, 5000);
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    function startAuth() {
        const scopeString = CONFIG.scopes.join(' ');
        const authUrl = `https://id.twitch.tv/oauth2/authorize` +
            `?response_type=code` +
            `&client_id=${CONFIG.clientId}` +
            `&redirect_uri=${encodeURIComponent(CONFIG.redirectUri)}` +
            `&scope=${encodeURIComponent(scopeString)}` +
            `&force_verify=true`;

        window.location.href = authUrl;
    }

    async function exchangeCode(code) {
        showLoadingSection();

        try {
            const response = await fetch(`${CONFIG.apiUrl}/auth/exchange`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: code
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const result = await response.json();

            document.getElementById('channelName').textContent = result.login;
            document.getElementById('userId').textContent = result.userId;

            showSuccessSection();
            showSuccess('auth successful. the bot will connect within ~1 minute');

            window.history.replaceState({}, document.title, window.location.pathname);

        } catch (err) {
            console.error('error exchanging code:', err);
            showError(`failed to process auth: ${err.message}`);
            showAuthSection();
        }
    }

    function resetAuth() {
        window.location.href = window.location.pathname;
    }
});