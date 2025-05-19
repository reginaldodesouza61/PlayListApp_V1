// Aplicação principal
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos da interface
    const menuItems = document.querySelectorAll('.menu li a');
    const contentSections = document.querySelectorAll('.content-section');
    const libraryMedia = document.getElementById('library-media');
    const recentMedia = document.getElementById('recent-media');
    const librarySearch = document.getElementById('library-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const notificationContainer = document.getElementById('notification-container');
    
    // Inicialização
    function init() {
        // Configurar navegação do menu
        setupNavigation();
        
        // Configurar pesquisa e filtros
        setupFilters();
        
        // Carregar biblioteca e playlists
        loadLibrary();
    }
    
    // Configurar navegação do menu
    function setupNavigation() {
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remover classe ativa de todos os itens
                menuItems.forEach(i => {
                    i.parentElement.classList.remove('active');
                });
                
                // Adicionar classe ativa ao item clicado
                this.parentElement.classList.add('active');
                
                // Obter seção alvo
                const target = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(target + '-section');
                
                // Esconder todas as seções
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Mostrar seção alvo
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }
    
    // Configurar pesquisa e filtros
    function setupFilters() {
        // Pesquisa na biblioteca
        librarySearch.addEventListener('input', function() {
            filterLibrary();
        });
        
        // Filtros de tipo de mídia
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover classe ativa de todos os botões
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Adicionar classe ativa ao botão clicado
                this.classList.add('active');
                
                // Filtrar biblioteca
                filterLibrary();
            });
        });
    }
    
    // Filtrar biblioteca
    function filterLibrary() {
        const searchTerm = librarySearch.value.toLowerCase();
        const filterType = document.querySelector('.filter-btn.active').dataset.filter;
        
        // Obter biblioteca
        const library = JSON.parse(localStorage.getItem('musicflix_library') || '[]');
        
        // Filtrar itens
        const filteredItems = library.filter(item => {
            // Filtrar por termo de pesquisa
            const matchesSearch = item.title.toLowerCase().includes(searchTerm);
            
            // Filtrar por tipo
            const matchesType = filterType === 'all' || 
                               (filterType === 'audio' && item.type === 'audio') ||
                               (filterType === 'video' && item.type === 'video') ||
                               (filterType === 'youtube' && item.source === 'youtube');
            
            return matchesSearch && matchesType;
        });
        
        // Renderizar itens filtrados
        renderLibraryItems(filteredItems);
    }
    
    // Carregar biblioteca
    function loadLibrary() {
        const library = JSON.parse(localStorage.getItem('musicflix_library') || '[]');
        
        // Renderizar itens da biblioteca
        renderLibraryItems(library);
        
        // Renderizar itens recentes
        renderRecentItems();
    }
    
    // Renderizar itens da biblioteca
    function renderLibraryItems(items) {
        if (items.length === 0) {
            libraryMedia.innerHTML = '<p class="empty-message">Sua biblioteca está vazia</p>';
            return;
        }
        
        // Ordenar por data de adição (mais recente primeiro)
        items.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        
        // Criar HTML para cada item
        let html = '';
        items.forEach(item => {
            const isAudio = item.type === 'audio';
            const isYoutube = item.source === 'youtube';
            
            html += `
                <div class="media-item" data-id="${item.id}" data-type="${item.type}" data-source="${item.source}">
                    <div class="media-thumbnail">
                        ${item.thumbnail ? 
                            `<img src="${item.thumbnail}" alt="${item.title}">` : 
                            `<i class="${isAudio ? 'fas fa-music' : 'fas fa-video'}"></i>`
                        }
                        <div class="play-overlay">
                            <button class="play-btn">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    </div>
                    <div class="media-info">
                        <h4>${item.title}</h4>
                        <p>${isYoutube ? 'YouTube' : 'Arquivo Local'}</p>
                    </div>
                    <div class="media-actions">
                        <button class="media-action-btn add-to-playlist-btn" title="Adicionar à Playlist">
                            <i class="fas fa-list"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        libraryMedia.innerHTML = html;
        
        // Configurar eventos de clique nos itens
        setupMediaItemEvents();
    }
    
    // Renderizar itens recentes
    function renderRecentItems() {
        const recent = JSON.parse(localStorage.getItem('musicflix_recent') || '[]');
        
        if (recent.length === 0) {
            recentMedia.innerHTML = '<p class="empty-message">Nenhuma mídia reproduzida recentemente</p>';
            return;
        }
        
        // Obter biblioteca para informações de mídia
        const library = JSON.parse(localStorage.getItem('musicflix_library') || '[]');
        
        // Obter itens recentes da biblioteca
        const recentItems = recent.map(id => {
            return library.find(item => item.id === id);
        }).filter(item => item !== undefined);
        
        // Limitar a 6 itens
        const limitedItems = recentItems.slice(0, 6);
        
        // Criar HTML para cada item
        let html = '';
        limitedItems.forEach(item => {
            const isAudio = item.type === 'audio';
            const isYoutube = item.source === 'youtube';
            
            html += `
                <div class="media-item" data-id="${item.id}" data-type="${item.type}" data-source="${item.source}">
                    <div class="media-thumbnail">
                        ${item.thumbnail ? 
                            `<img src="${item.thumbnail}" alt="${item.title}">` : 
                            `<i class="${isAudio ? 'fas fa-music' : 'fas fa-video'}"></i>`
                        }
                        <div class="play-overlay">
                            <button class="play-btn">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    </div>
                    <div class="media-info">
                        <h4>${item.title}</h4>
                        <p>${isYoutube ? 'YouTube' : 'Arquivo Local'}</p>
                    </div>
                </div>
            `;
        });
        
        recentMedia.innerHTML = html;
        
        // Configurar eventos de clique nos itens
        setupMediaItemEvents();
    }
    
    // Configurar eventos de clique nos itens de mídia
    function setupMediaItemEvents() {
        // Evento de clique no botão de reprodução
        document.querySelectorAll('.play-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const mediaItem = this.closest('.media-item');
                const mediaId = mediaItem.dataset.id;
                
                // Reproduzir mídia
                playMedia(mediaId);
            });
        });
        
        // Evento de clique no item de mídia
        document.querySelectorAll('.media-item').forEach(item => {
            item.addEventListener('click', function() {
                const mediaId = this.dataset.id;
                
                // Reproduzir mídia
                playMedia(mediaId);
            });
        });
        
        // Evento de clique no botão de adicionar à playlist
        document.querySelectorAll('.add-to-playlist-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const mediaItem = this.closest('.media-item');
                const mediaId = mediaItem.dataset.id;
                
                // Abrir modal de adicionar à playlist
                if (window.playlist) {
                    window.playlist.openAddToPlaylistModal(mediaId);
                }
            });
        });
    }
    
    // Reproduzir mídia
    function playMedia(mediaId) {
        // Obter biblioteca
        const library = JSON.parse(localStorage.getItem('musicflix_library') || '[]');
        
        // Encontrar item de mídia
        const mediaItem = library.find(item => item.id === mediaId);
        
        if (!mediaItem) {
            showNotification('Erro', 'Item de mídia não encontrado.', 'error');
            return;
        }
        
        // Adicionar aos recentes
        addToRecent(mediaId);
        
        // Reproduzir mídia
        if (window.player) {
            window.player.playMedia(mediaItem);
        }
    }
    
    // Adicionar aos recentes
    function addToRecent(mediaId) {
        // Obter recentes
        let recent = JSON.parse(localStorage.getItem('musicflix_recent') || '[]');
        
        // Remover se já existir
        recent = recent.filter(id => id !== mediaId);
        
        // Adicionar ao início
        recent.unshift(mediaId);
        
        // Limitar a 20 itens
        recent = recent.slice(0, 20);
        
        // Salvar recentes
        localStorage.setItem('musicflix_recent', JSON.stringify(recent));
        
        // Atualizar interface
        renderRecentItems();
    }
    
    // Mostrar notificação
    function showNotification(title, message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        // Definir ícone com base no tipo
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        // Criar HTML da notificação
        notification.innerHTML = `
            <div class="notification-icon ${type}">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Adicionar ao container
        notificationContainer.appendChild(notification);
        
        // Configurar evento de clique no botão de fechar
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.remove();
        });
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Inicializar
    init();
    
    // Expor funções para uso externo
    window.app = {
        loadLibrary,
        playMedia,
        showNotification
    };
});
