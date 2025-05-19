// Integração com YouTube
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos da interface
    const youtubeUrlInput = document.getElementById('youtube-url');
    const addYoutubeBtn = document.getElementById('add-youtube-btn');
    const youtubePreview = document.getElementById('youtube-preview');
    const youtubeMedia = document.getElementById('youtube-media');
    
    // Inicialização
    function init() {
        // Configurar evento de clique no botão de adicionar
        addYoutubeBtn.addEventListener('click', handleAddYoutube);
        
        // Configurar evento de entrada no campo de URL
        youtubeUrlInput.addEventListener('input', debounce(handleUrlInput, 500));
    }
    
    // Manipular entrada de URL
    function handleUrlInput() {
        const url = youtubeUrlInput.value.trim();
        
        if (url && isValidYoutubeUrl(url)) {
            // Extrair ID do vídeo
            const videoId = extractYoutubeVideoId(url);
            
            if (videoId) {
                // Mostrar prévia
                showYoutubePreview(videoId);
            }
        } else {
            // Limpar prévia
            clearYoutubePreview();
        }
    }
    
    // Manipular adição de vídeo do YouTube
    function handleAddYoutube() {
        const url = youtubeUrlInput.value.trim();
        
        if (!url) {
            app.showNotification('Erro', 'Por favor, insira uma URL do YouTube.', 'error');
            return;
        }
        
        if (!isValidYoutubeUrl(url)) {
            app.showNotification('Erro', 'URL do YouTube inválida.', 'error');
            return;
        }
        
        // Extrair ID do vídeo
        const videoId = extractYoutubeVideoId(url);
        
        if (!videoId) {
            app.showNotification('Erro', 'Não foi possível extrair o ID do vídeo.', 'error');
            return;
        }
        
        // Verificar se o vídeo já existe na biblioteca
        const library = JSON.parse(localStorage.getItem('musicflix_library') || '[]');
        const exists = library.some(item => 
            item.source === 'youtube' && item.youtubeId === videoId
        );
        
        if (exists) {
            app.showNotification('Aviso', 'Este vídeo já está na sua biblioteca.', 'warning');
            return;
        }
        
        // Obter informações do vídeo (em produção, use a API do YouTube)
        getYoutubeVideoInfo(videoId)
            .then(videoInfo => {
                // Adicionar à biblioteca
                addYoutubeToLibrary(videoId, videoInfo);
                
                // Limpar campo de URL
                youtubeUrlInput.value = '';
                
                // Limpar prévia
                clearYoutubePreview();
                
                // Mostrar mensagem de sucesso
                app.showNotification('Sucesso', 'Vídeo adicionado à biblioteca.', 'success');
            })
            .catch(error => {
                app.showNotification('Erro', 'Erro ao obter informações do vídeo: ' + error.message, 'error');
            });
    }
    
    // Verificar se é uma URL válida do YouTube
    function isValidYoutubeUrl(url) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        return youtubeRegex.test(url);
    }
    
    // Extrair ID do vídeo do YouTube
    function extractYoutubeVideoId(url) {
        let videoId = null;
        
        // Padrão youtu.be
        const shortUrlRegex = /youtu\.be\/([a-zA-Z0-9_-]+)/;
        const shortMatch = url.match(shortUrlRegex);
        
        if (shortMatch && shortMatch[1]) {
            videoId = shortMatch[1];
        } else {
            // Padrão youtube.com
            const longUrlRegex = /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
            const longMatch = url.match(longUrlRegex);
            
            if (longMatch && longMatch[1]) {
                videoId = longMatch[1];
            }
        }
        
        return videoId;
    }
    
    // Mostrar prévia do vídeo do YouTube
    function showYoutubePreview(videoId) {
        youtubePreview.innerHTML = `
            <iframe 
                width="100%" 
                height="200" 
                src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    }
    
    // Limpar prévia do vídeo do YouTube
    function clearYoutubePreview() {
        youtubePreview.innerHTML = '<p>A prévia do vídeo aparecerá aqui</p>';
    }
    
    // Obter informações do vídeo do YouTube
    function getYoutubeVideoInfo(videoId) {
        // Em produção, use a API do YouTube
        // Aqui, simulamos a obtenção de informações
        return new Promise((resolve) => {
            // Simular atraso de rede
            setTimeout(() => {
                resolve({
                    title: 'Vídeo do YouTube ' + videoId,
                    thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
                    duration: '3:45' // Duração simulada
                });
            }, 500);
        });
    }
    
    // Adicionar vídeo do YouTube à biblioteca
    function addYoutubeToLibrary(videoId, videoInfo) {
        // Criar objeto de mídia
        const mediaItem = {
            id: 'youtube_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title: videoInfo.title,
            type: 'video',
            source: 'youtube',
            youtubeId: videoId,
            thumbnail: videoInfo.thumbnail,
            duration: videoInfo.duration,
            dateAdded: new Date().toISOString()
        };
        
        // Adicionar à biblioteca
        const library = JSON.parse(localStorage.getItem('musicflix_library') || '[]');
        library.push(mediaItem);
        localStorage.setItem('musicflix_library', JSON.stringify(library));
        
        // Atualizar interface
        app.loadLibrary();
    }
    
    // Função de debounce para evitar chamadas excessivas
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Inicializar
    init();
    
    // Expor funções para uso externo
    window.youtube = {
        addYoutubeVideo: function(url) {
            youtubeUrlInput.value = url;
            handleUrlInput();
        }
    };
});
