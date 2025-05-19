// Player de mídia
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos da interface
    const playerTitle = document.getElementById('player-title');
    const playerSource = document.getElementById('player-source');
    const playerThumbnail = document.getElementById('player-thumbnail');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTime = document.getElementById('current-time');
    const totalTime = document.getElementById('total-time');
    const volumeProgress = document.getElementById('volume-progress');
    const muteBtn = document.getElementById('mute-btn');
    const expandBtn = document.getElementById('expand-btn');
    const playerExpanded = document.getElementById('player-expanded');
    const playerVideoContainer = document.getElementById('player-video-container');
    
    // Variáveis de estado
    let currentMedia = null;
    let currentPlaylist = [];
    let currentPlaylistName = '';
    let currentPlaylistIndex = -1;
    let isPlaying = false;
    let isMuted = false;
    let isExpanded = false;
    let isShuffled = false;
    let repeatMode = 'none'; // none, one, all
    let volume = 1;
    let audioPlayer = new Audio();
    let youtubePlayer = null;
    
    // Inicialização
    function init() {
        // Configurar eventos do player
        setupPlayerEvents();
        
        // Configurar eventos de áudio
        setupAudioEvents();
    }
    
    // Configurar eventos do player
    function setupPlayerEvents() {
        // Play/Pause
        playPauseBtn.addEventListener('click', togglePlayPause);
        
        // Anterior/Próximo
        prevBtn.addEventListener('click', playPrevious);
        nextBtn.addEventListener('click', playNext);
        
        // Shuffle
        shuffleBtn.addEventListener('click', toggleShuffle);
        
        // Repeat
        repeatBtn.addEventListener('click', toggleRepeat);
        
        // Progresso
        progressBar.parentElement.addEventListener('click', seekTo);
        
        // Volume
        volumeProgress.parentElement.addEventListener('click', changeVolume);
        muteBtn.addEventListener('click', toggleMute);
        
        // Expandir
        expandBtn.addEventListener('click', toggleExpand);
    }
    
    // Configurar eventos de áudio
    function setupAudioEvents() {
        // Atualizar progresso
        audioPlayer.addEventListener('timeupdate', updateProgress);
        
        // Atualizar estado ao terminar
        audioPlayer.addEventListener('ended', handleMediaEnded);
        
        // Atualizar duração quando metadados estiverem disponíveis
        audioPlayer.addEventListener('loadedmetadata', function() {
            updateDuration();
        });
    }
    
    // Reproduzir mídia
    function playMedia(media) {
        // Parar reprodução atual
        stopCurrentMedia();
        
        // Atualizar mídia atual
        currentMedia = media;
        currentPlaylist = [media];
        currentPlaylistIndex = 0;
        currentPlaylistName = '';
        
        // Atualizar interface
        updatePlayerInfo();
        
        // Iniciar reprodução
        startPlayback();
    }
    
    // Carregar playlist
    function loadPlaylist(playlist, name) {
        if (!playlist || playlist.length === 0) return;
        
        // Parar reprodução atual
        stopCurrentMedia();
        
        // Atualizar playlist atual
        currentPlaylist = [...playlist];
        currentPlaylistName = name || '';
        currentPlaylistIndex = 0;
        currentMedia = currentPlaylist[currentPlaylistIndex];
        
        // Atualizar interface
        updatePlayerInfo();
        
        // Iniciar reprodução
        startPlayback();
    }
    
    // Iniciar reprodução
    function startPlayback() {
        if (!currentMedia) return;
        
        // Verificar tipo de mídia
        if (currentMedia.source === 'youtube') {
            // Reproduzir vídeo do YouTube
            playYoutubeVideo();
        } else {
            // Reproduzir mídia local
            playLocalMedia();
        }
        
        // Atualizar estado
        isPlaying = true;
        updatePlayPauseButton();
    }
    
    // Reproduzir mídia local
    function playLocalMedia() {
        // Definir fonte
        audioPlayer.src = currentMedia.url;
        
        // Definir volume
        audioPlayer.volume = volume;
        
        // Iniciar reprodução
        audioPlayer.play();
        
        // Esconder player de vídeo do YouTube
        hideYoutubePlayer();
        
        // Esconder player expandido se for áudio
        if (currentMedia.type === 'audio' && isExpanded) {
            toggleExpand();
        }
    }
    
    // Reproduzir vídeo do YouTube
    function playYoutubeVideo() {
        // Pausar áudio
        audioPlayer.pause();
        
        // Criar elemento iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'youtube-iframe';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        
        // Adicionar ao container
        playerVideoContainer.innerHTML = '';
        playerVideoContainer.appendChild(iframe);
        
        // Inicializar player do YouTube
        iframe.src = `https://www.youtube.com/embed/${currentMedia.youtubeId}?enablejsapi=1&autoplay=1&controls=1`;
        
        // Expandir player
        if (!isExpanded) {
            toggleExpand();
        }
    }
    
    // Esconder player de vídeo do YouTube
    function hideYoutubePlayer() {
        playerVideoContainer.innerHTML = '';
    }
    
    // Parar reprodução atual
    function stopCurrentMedia() {
        // Pausar áudio
        audioPlayer.pause();
        
        // Limpar vídeo do YouTube
        hideYoutubePlayer();
        
        // Atualizar estado
        isPlaying = false;
        updatePlayPauseButton();
    }
    
    // Alternar reprodução/pausa
    function togglePlayPause() {
        if (!currentMedia) return;
        
        if (isPlaying) {
            // Pausar
            if (currentMedia.source === 'youtube') {
                // Não podemos controlar o iframe diretamente
                // Em produção, usar a API do YouTube
            } else {
                audioPlayer.pause();
            }
        } else {
            // Reproduzir
            if (currentMedia.source === 'youtube') {
                playYoutubeVideo();
            } else {
                audioPlayer.play();
            }
        }
        
        // Atualizar estado
        isPlaying = !isPlaying;
        updatePlayPauseButton();
    }
    
    // Reproduzir anterior
    function playPrevious() {
        if (currentPlaylist.length <= 1) return;
        
        // Verificar se deve voltar ao início da mídia atual
        if (audioPlayer.currentTime > 3) {
            // Voltar ao início
            audioPlayer.currentTime = 0;
            return;
        }
        
        // Calcular índice anterior
        let prevIndex = currentPlaylistIndex - 1;
        if (prevIndex < 0) {
            prevIndex = currentPlaylist.length - 1;
        }
        
        // Atualizar índice e mídia atual
        currentPlaylistIndex = prevIndex;
        currentMedia = currentPlaylist[currentPlaylistIndex];
        
        // Atualizar interface
        updatePlayerInfo();
        
        // Iniciar reprodução
        startPlayback();
    }
    
    // Reproduzir próximo
    function playNext() {
        if (currentPlaylist.length <= 1) return;
        
        // Calcular próximo índice
        let nextIndex = currentPlaylistIndex + 1;
        if (nextIndex >= currentPlaylist.length) {
            nextIndex = 0;
        }
        
        // Atualizar índice e mídia atual
        currentPlaylistIndex = nextIndex;
        currentMedia = currentPlaylist[currentPlaylistIndex];
        
        // Atualizar interface
        updatePlayerInfo();
        
        // Iniciar reprodução
        startPlayback();
    }
    
    // Alternar modo aleatório
    function toggleShuffle() {
        isShuffled = !isShuffled;
        
        // Atualizar interface
        shuffleBtn.classList.toggle('active', isShuffled);
        
        // Embaralhar playlist se ativado
        if (isShuffled && currentPlaylist.length > 1) {
            // Salvar mídia atual
            const currentItem = currentPlaylist[currentPlaylistIndex];
            
            // Embaralhar playlist
            shuffleArray(currentPlaylist);
            
            // Encontrar novo índice da mídia atual
            currentPlaylistIndex = currentPlaylist.findIndex(item => item.id === currentItem.id);
        }
    }
    
    // Embaralhar array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    // Alternar modo de repetição
    function toggleRepeat() {
        // Alternar entre modos: none -> one -> all -> none
        switch (repeatMode) {
            case 'none':
                repeatMode = 'one';
                break;
            case 'one':
                repeatMode = 'all';
                break;
            case 'all':
                repeatMode = 'none';
                break;
        }
        
        // Atualizar interface
        updateRepeatButton();
    }
    
    // Atualizar botão de repetição
    function updateRepeatButton() {
        // Remover classes
        repeatBtn.classList.remove('active', 'one');
        
        // Adicionar classes conforme modo
        if (repeatMode === 'one') {
            repeatBtn.classList.add('active', 'one');
            repeatBtn.innerHTML = '<i class="fas fa-redo-alt"></i><span class="repeat-one">1</span>';
        } else if (repeatMode === 'all') {
            repeatBtn.classList.add('active');
            repeatBtn.innerHTML = '<i class="fas fa-redo-alt"></i>';
        } else {
            repeatBtn.innerHTML = '<i class="fas fa-redo-alt"></i>';
        }
    }
    
    // Buscar posição
    function seekTo(e) {
        if (!currentMedia || currentMedia.source === 'youtube') return;
        
        const progressBarWidth = this.offsetWidth;
        const clickPosition = e.offsetX;
        const seekPercentage = clickPosition / progressBarWidth;
        
        // Atualizar posição
        audioPlayer.currentTime = audioPlayer.duration * seekPercentage;
    }
    
    // Alterar volume
    function changeVolume(e) {
        const volumeBarWidth = this.offsetWidth;
        const clickPosition = e.offsetX;
        const newVolume = clickPosition / volumeBarWidth;
        
        // Atualizar volume
        volume = Math.max(0, Math.min(1, newVolume));
        audioPlayer.volume = volume;
        
        // Atualizar interface
        updateVolumeUI();
    }
    
    // Alternar mudo
    function toggleMute() {
        isMuted = !isMuted;
        
        // Atualizar volume
        audioPlayer.muted = isMuted;
        
        // Atualizar interface
        updateVolumeUI();
    }
    
    // Atualizar interface de volume
    function updateVolumeUI() {
        // Atualizar barra de volume
        volumeProgress.style.width = `${isMuted ? 0 : volume * 100}%`;
        
        // Atualizar ícone
        if (isMuted || volume === 0) {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volume < 0.5) {
            muteBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }
    
    // Alternar expansão
    function toggleExpand() {
        isExpanded = !isExpanded;
        
        // Atualizar interface
        playerExpanded.classList.toggle('active', isExpanded);
        expandBtn.innerHTML = isExpanded ? 
            '<i class="fas fa-compress"></i>' : 
            '<i class="fas fa-expand"></i>';
    }
    
    // Atualizar informações do player
    function updatePlayerInfo() {
        if (!currentMedia) {
            // Limpar informações
            playerTitle.textContent = 'Nenhuma mídia selecionada';
            playerSource.textContent = '-';
            playerThumbnail.innerHTML = '<i class="fas fa-music"></i>';
            return;
        }
        
        // Atualizar título
        playerTitle.textContent = currentMedia.title;
        
        // Atualizar fonte
        playerSource.textContent = currentMedia.source === 'youtube' ? 
            'YouTube' : 
            'Arquivo Local';
        
        // Atualizar thumbnail
        if (currentMedia.thumbnail) {
            playerThumbnail.innerHTML = `<img src="${currentMedia.thumbnail}" alt="${currentMedia.title}">`;
        } else {
            playerThumbnail.innerHTML = `<i class="${currentMedia.type === 'audio' ? 'fas fa-music' : 'fas fa-video'}"></i>`;
        }
    }
    
    // Atualizar botão de reprodução/pausa
    function updatePlayPauseButton() {
        playPauseBtn.innerHTML = isPlaying ? 
            '<i class="fas fa-pause"></i>' : 
            '<i class="fas fa-play"></i>';
    }
    
    // Atualizar progresso
    function updateProgress() {
        if (!currentMedia || currentMedia.source === 'youtube') return;
        
        // Calcular porcentagem
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        
        // Atualizar barra de progresso
        progressBar.style.width = `${percentage}%`;
        
        // Atualizar tempo atual
        currentTime.textContent = formatTime(audioPlayer.currentTime);
    }
    
    // Atualizar duração
    function updateDuration() {
        if (!currentMedia || currentMedia.source === 'youtube') return;
        
        // Atualizar tempo total
        totalTime.textContent = formatTime(audioPlayer.duration);
    }
    
    // Formatar tempo
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    
    // Manipular fim da mídia
    function handleMediaEnded() {
        // Verificar modo de repetição
        if (repeatMode === 'one') {
            // Repetir mídia atual
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else if (repeatMode === 'all' || currentPlaylistIndex < currentPlaylist.length - 1) {
            // Reproduzir próxima
            playNext();
        } else {
            // Parar reprodução
            isPlaying = false;
            updatePlayPauseButton();
        }
    }
    
    // Inicializar
    init();
    
    // Expor funções para uso externo
    window.player = {
        playMedia,
        loadPlaylist,
        togglePlayPause,
        playPrevious,
        playNext
    };
});
