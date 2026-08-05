const CONFIG = {
    clientId: null,
    redirectUri: window.location.origin + '/ba',
    botUsername: null,
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
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const toast = document.getElementById('toast');

    // s1: load or save config params
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));

    // check params
    const urlClientId = urlParams.get('client_id');
    const urlBotUsername = urlParams.get('bot_username');

    if (urlClientId) {
        // first visit
        sessionStorage.setItem('twitch_auth_client_id', urlClientId);
        sessionStorage.setItem('twitch_auth_bot_username', urlBotUsername || 'butterbror');
        CONFIG.clientId = urlClientId;
        CONFIG.botUsername = urlBotUsername || 'butterbror';
    } else {
        // from twitch
        CONFIG.clientId = sessionStorage.getItem('twitch_auth_client_id');
        CONFIG.botUsername = sessionStorage.getItem('twitch_auth_bot_username') || 'butterbror';
    }

    // s2: check access_token in hash
    const accessToken = hashParams.get('access_token');

    if (accessToken) {
        if (!CONFIG.clientId) {
            showError('error: missing client id. please start the authorization process from the bot command');
            authBtn.disabled = true;
            return;
        }
        processToken(accessToken);
    } else if (CONFIG.clientId) {
        // show auth
        showAuthSection();
    } else {
        // ???
        showError('error: missing client id. please use the link provided by the bot');
        authBtn.disabled = true;
        return;
    }

    authBtn.addEventListener('click', startAuth);
    resetBtn.addEventListener('click', resetAuth);
    copyCodeBtn.addEventListener('click', copyCode);

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
            `?response_type=token` +
            `&client_id=${CONFIG.clientId}` +
            `&redirect_uri=${encodeURIComponent(CONFIG.redirectUri)}` +
            `&scope=${encodeURIComponent(scopeString)}` +
            `&force_verify=true`;

        window.location.href = authUrl;
    }

    async function processToken(accessToken) {
        showLoadingSection();

        try {
            const response = await fetch('https://api.twitch.tv/helix/users', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Client-Id': CONFIG.clientId
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to get user info: HTTP ${response.status}`);
            }

            const data = await response.json();
            const user = data.data[0];

            if (!user) {
                throw new Error('No user data received');
            }

            const authData = {
                channel: user.login,
                token: accessToken
            };

            const jsonString = JSON.stringify(authData);
            const base64Code = btoa(jsonString);

            document.getElementById('channelName').textContent = user.login;
            document.getElementById('userId').textContent = user.id;
            document.getElementById('botUsername').textContent = CONFIG.botUsername;
            document.getElementById('authCode').textContent = base64Code;

            showSuccessSection();
            showSuccess('authorization successful! copy the code and send it to the bot via whisper');

            // clean url
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);

        } catch (err) {
            console.error('error processing token:', err);
            showError(`failed to process authorization: ${err.message}`);
            showAuthSection();
        }
    }

    function copyCode() {
        const code = document.getElementById('authCode').textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).then(() => {
                showToast('code copied');
            }).catch(() => {
                copyWithTextarea(code);
            });
        } else {
            copyWithTextarea(code);
        }
    }

    function copyWithTextarea(text) {
        const textarea = document.createElement("textarea");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        textarea.value = text;
        document.body.appendChild(textarea);

        textarea.select();
        textarea.setSelectionRange(0, 99999);

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast('code copied');
            } else {
                showToast('copy failed');
            }
        } catch (err) {
            console.error('copy failed: ', err);
            showToast('copy failed');
        }

        document.body.removeChild(textarea);
    }

    function resetAuth() {
        // clear session storage and reload
        sessionStorage.removeItem('twitch_auth_client_id');
        sessionStorage.removeItem('twitch_auth_bot_username');
        window.location.href = window.location.pathname;
    }
});