// Gerenciamento de playlists
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos da interface
    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    const playlistModal = document.getElementById('playlist-modal');
    const addToPlaylistModal = document.getElementById('add-to-playlist-modal');
    const playlistName = document.getElementById('playlist-name');
    const playlistDescription = document.getElementById('playlist-description');
    const savePlaylistBtn = document.getElementById('save-playlist-btn');
    const confirmAddToPlaylistBtn = document.getElementById('confirm-add-to-playlist-btn');
    const playlistsContainer = document.getElementById('playlists-container');
    const playlistSelection = document.getElementById('playlist-selection');
    
    // Variáveis de estado
    let selectedMediaForPlaylist = null;
    let selectedPlaylistId = null;
    
    // Inicialização
    function init() {
        // Configurar eventos de modal
        setupModalEvents();
        
        // Configurar evento de criação de playlist
        createPlaylistBtn.addEventListener('click', openCreatePlaylistModal);
        
        // Configurar evento de salvar playlist
        savePlaylistBtn.addEventListener('click', handleSavePlaylist);
        
        // Configurar evento de adicionar à playlist
        confirmAddToPlaylistBtn.addEventListener('click', handleAddToPlaylist);
        
        // Carregar playlists
        loadPlaylists();
    }
    
    // Configurar eventos de modal
    function setupModalEvents() {
        // Fechar modais ao clicar no botão de fechar
        document.querySelectorAll('.close-modal, .cancel-modal').forEach(element => {
            element.addEventListener('click', function() {
                closeAllModals();
            });
        });
        
        // Fechar modais ao clicar fora do conteúdo
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                closeAllModals();
            }
        });
    }
    
    // Abrir modal de criação de playlist
    function openCreatePlaylistModal() {
        // Limpar campos
        playlistName.value = '';
        playlistDescription.value = '';
        
        // Abrir modal
        playlistModal.classList.add('active');
    }
    
    // Abrir modal de adicionar à playlist
    function openAddToPlaylistModal(mediaId) {
        // Armazenar ID da mídia selecionada
        selectedMediaForPlaylist = mediaId;
        
        // Carregar playlists disponíveis
        loadPlaylistOptions();
        
        // Abrir modal
        addToPlaylistModal.classList.add('active');
    }
    
    // Fechar todos os modais
    function closeAllModals() {
        playlistModal.classList.remove('active');
        addToPlaylistModal.classList.remove('active');
        
        // Limpar seleções
        selectedPlaylistId = null;
    }
    
    // Manipular salvamento de playlist
    function handleSavePlaylist() {
        const name = playlistName.value.trim();
        const description = playlistDescription.value.trim();
        
        if (!name) {
            app.showNotification('Erro', 'Por favor, insira um nome para a playlist.', 'error');
            return;
        }
        
        // Criar objeto de playlist
        const playlist = {
            id: 'playlist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: name,
            description: description,
            items: [],
            dateCreated: new Date().toISOString(),
            dateModified: new Date().toISOString()
        };
        
        // Adicionar à lista de playlists
        const playlists = JSON.parse(localStorage.getItem('musicflix_playlists') || '[]');
        playlists.push(playlist);
        localStorage.setItem('musicflix_playlists', JSON.stringify(playlists));
        
        // Atualizar interface
        loadPlaylists();
        
        // Fechar modal
        closeAllModals();
        
        // Mostrar mensagem de sucesso
        app.showNotification('Sucesso', 'Playlist criada com sucesso.', 'success');
    }
    
    // Carregar opções de playlist
    function loadPlaylistOptions() {
        const playlists = JSON.parse(localStorage.getItem('musicflix_playlists') || '[]');
        
        if (playlists.length === 0) {
            playlistSelection.innerHTML = '<p class="empty-message">Você ainda não criou nenhuma playlist</p>';
            return;
        }
        
        // Limpar seleção anterior
        selectedPlaylistId = null;
        
        // Criar opções de playlist
        let html = '';
        playlists.forEach(playlist => {
            html += `
                <div class="playlist-option" data-id="${playlist.id}">
                    <div class="playlist-option-icon">
                        <i class="fas fa-list"></i>
                    </div>
                    <div class="playlist-option-info">
                        <h4>${playlist.name}</h4>
                        <p>${playlist.items.length} itens</p>
                    </div>
                </div>
            `;
        });
        
        playlistSelection.innerHTML = html;
        
        // Configurar eventos de clique nas opções
        document.querySelectorAll('.playlist-option').forEach(option => {
            option.addEventListener('click', function() {
                // Remover seleção anterior
                document.querySelectorAll('.playlist-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Adicionar seleção atual
                this.classList.add('selected');
                
                // Armazenar ID da playlist selecionada
                selectedPlaylistId = this.dataset.id;
            });
        });
    }
    
    // Manipular adição à playlist
    function handleAddToPlaylist() {
        if (!selectedMediaForPlaylist) {
            app.showNotification('Erro', 'Nenhuma mídia selecionada.', 'error');
            return;
        }
        
        if (!selectedPlaylistId) {
            app.showNotification('Erro', 'Por favor, selecione uma playlist.', 'error');
            return;
        }
        
        // Obter playlists
        const playlists = JSON.parse(localStorage.getItem('musicflix_playlists') || '[]');
        
        // Encontrar playlist selecionada
        const playlistIndex = playlists.findIndex(p => p.id === selectedPlaylistId);
        
        if (playlistIndex === -1) {
            app.showNotification('Erro', 'Playlist não encontrada.', 'error');
            return;
        }
        
        // Verificar se a mídia já está na playlist
        if (playlists[playlistIndex].items.includes(selectedMediaForPlaylist)) {
            app.showNotification('Aviso', 'Esta mídia já está na playlist.', 'warning');
            return;
        }
        
        // Adicionar mídia à playlist
        playlists[playlistIndex].items.push(selectedMediaForPlaylist);
        playlists[playlistIndex].dateModified = new Date().toISOString();
        
        // Salvar playlists
        localStorage.setItem('musicflix_playlists', JSON.stringify(playlists));
        
        // Atualizar interface
        loadPlaylists();
        
        // Fechar modal
        closeAllModals();
        
        // Mostrar mensagem de sucesso
        app.showNotification('Sucesso', 'Mídia adicionada à playlist.', 'success');
    }
    
    // Carregar playlists
    function loadPlaylists() {
        const playlists = JSON.parse(localStorage.getItem('musicflix_playlists') || '[]');
        
        if (playlists.length === 0) {
            playlistsContainer.innerHTML = '<p class="empty-message">Você ainda não criou nenhuma playlist</p>';
            return;
        }
        
        // Obter biblioteca para informações de mídia
        const library = JSON.parse(localStorage.getItem('musicflix_library') || '[]');
        
        // Criar HTML para cada playlist
        let html = '';
        playlists.forEach(playlist => {
            // Obter thumbnail da primeira mídia, se existir
            let thumbnailUrl = '';
            let itemCount = playlist.items.length;
            
            if (itemCount > 0) {
                const firstItemId = playlist.items[0];
                const firstItem = library.find(item => item.id === firstItemId);
                
                if (firstItem && firstItem.thumbnail) {
                    thumbnailUrl = firstItem.thumbnail;
                }
            }
            
            html += `
                <div class="playlist-item" data-id="${playlist.id}">
                    <div class="playlist-cover">
                        ${thumbnailUrl ? 
                            `<img src="${thumbnailUrl}" alt="${playlist.name}">` : 
                            `<div class="playlist-icon"><i class="fas fa-music"></i></div>`
                        }
                    </div>
                    <div class="playlist-info">
                        <h4>${playlist.name}</h4>
                        <p>${playlist.description || 'Sem descrição'}</p>
                        <div class="playlist-stats">
                            <span><i class="fas fa-music"></i> ${itemCount} itens</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        playlistsContainer.innerHTML = html;
        
        // Configurar eventos de clique nas playlists
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', function() {
                const playlistId = this.dataset.id;
                openPlaylist(playlistId);
            });
        });
    }
    
    // Abrir playlist
    function openPlaylist(playlistId) {
        // Obter playlist
        const playlists = JSON.parse(localStorage.getItem('musicflix_playlists') || '[]');
        const playlist = playlists.find(p => p.id === playlistId);
        
        if (!playlist) {
            app.showNotification('Erro', 'Playlist não encontrada.', 'error');
            return;
        }
        
        // Obter biblioteca para informações de mídia
        const library = JSON.parse(localStorage.getItem('musicflix_library') || '[]');
        
        // Criar lista de reprodução
        const playlistItems = playlist.items.map(itemId => {
            return library.find(item => item.id === itemId);
        }).filter(item => item !== undefined);
        
        // Iniciar reprodução
        if (playlistItems.length > 0) {
            if (window.player) {
                window.player.loadPlaylist(playlistItems, playlist.name);
                app.showNotification('Playlist', `Reproduzindo: ${playlist.name}`, 'info');
            }
        } else {
            app.showNotification('Aviso', 'Esta playlist está vazia.', 'warning');
        }
    }
    
    // Inicializar
    init();
    
    // Expor funções para uso externo
    window.playlist = {
        openCreatePlaylistModal,
        openAddToPlaylistModal,
        loadPlaylists,
        openPlaylist
    };
});
