/// Autenticação com Google
document.addEventListener('DOMContentLoaded', function() {
    const loginScreen = document.getElementById('login-screen');
    const mainScreen = document.getElementById('main-screen');
    const googleLoginBtn = document.getElementById('google-login');
    const logoutBtn = document.getElementById('logout-btn');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');

    let googleClient;

    function init() {
        setupAuthEvents();
        checkLoginStatus();
        renderGoogleButton();
    }

    function setupAuthEvents() {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }

    function renderGoogleButton() {
        // Substitui o botão customizado pelo botão do Google
        window.google.accounts.id.initialize({
            client_id: 'AIzaSyCwQCAkq-Xmy4CJBC_oBr2q-5dAnhh5mWc', // <-- Substitua pelo seu Client ID
            callback: handleCredentialResponse
        });
        window.google.accounts.id.renderButton(
            googleLoginBtn,
            { theme: "outline", size: "large" }
        );
    }

    function handleCredentialResponse(response) {
        // Decodifica o JWT para obter informações do usuário
        const userObject = parseJwt(response.credential);
        const userData = {
            id: userObject.sub,
            name: userObject.name,
            email: userObject.email,
            avatar: userObject.picture
        };
        localStorage.setItem('musicflix_user', JSON.stringify(userData));
        loginSuccess(userData);
        if (window.app) {
            window.app.showNotification('Login', 'Login realizado com sucesso!', 'success');
        }
    }

    function parseJwt(token) {
        // Decodifica o JWT (payload)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    function checkLoginStatus() {
        const user = localStorage.getItem('musicflix_user');
        if (user) {
            const userData = JSON.parse(user);
            loginSuccess(userData);
        }
    }

    function loginSuccess(user) {
        userAvatar.src = user.avatar;
        userName.textContent = user.name;
        loginScreen.classList.remove('active');
        mainScreen.classList.add('active');
        initUserData();
    }

    function initUserData() {
        if (!localStorage.getItem('musicflix_library')) {
            localStorage.setItem('musicflix_library', JSON.stringify([]));
        }
        if (!localStorage.getItem('musicflix_playlists')) {
            localStorage.setItem('musicflix_playlists', JSON.stringify([]));
        }
        if (!localStorage.getItem('musicflix_recent')) {
            localStorage.setItem('musicflix_recent', JSON.stringify([]));
        }
        if (window.app) {
            window.app.loadLibrary();
        }
        if (window.playlist) {
            window.playlist.loadPlaylists();
        }
    }

    function logout() {
        localStorage.removeItem('musicflix_user');
        mainScreen.classList.remove('active');
        loginScreen.classList.add('active');
        if (window.app) {
            window.app.showNotification('Logout', 'Logout realizado com sucesso!', 'info');
        }
        // Opcional: encerra a sessão do Google
        if (window.google && window.google.accounts.id) {
            window.google.accounts.id.disableAutoSelect();
        }
    }

    init();

    window.auth = {
        logout: logout,
        isLoggedIn: () => !!localStorage.getItem('musicflix_user')
    };
});