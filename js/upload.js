// Gerenciamento de upload de arquivos
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos da interface
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const progressContainer = document.getElementById('upload-progress-container');
    const progressList = document.getElementById('progress-list');
    
    // Inicialização
    function init() {
        // Configurar eventos de drag and drop
        setupDragAndDrop();
        
        // Configurar evento de seleção de arquivo
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Configurar eventos de drag and drop
    function setupDragAndDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        dropArea.addEventListener('drop', handleDrop, false);
    }
    
    // Prevenir comportamento padrão
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Destacar área de drop
    function highlight() {
        dropArea.classList.add('drag-over');
    }
    
    // Remover destaque da área de drop
    function unhighlight() {
        dropArea.classList.remove('drag-over');
    }
    
    // Manipular evento de drop
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        handleFiles(files);
    }
    
    // Manipular seleção de arquivos
    function handleFileSelect(e) {
        const files = e.target.files;
        
        handleFiles(files);
    }
    
    // Processar arquivos
    function handleFiles(files) {
        if (files.length === 0) return;
        
        // Mostrar container de progresso
        progressContainer.style.display = 'block';
        
        // Processar cada arquivo
        Array.from(files).forEach(file => {
            uploadFile(file);
        });
        
        // Limpar input de arquivo
        fileInput.value = '';
    }
    
    // Fazer upload de arquivo
    function uploadFile(file) {
        // Verificar se o arquivo é de mídia suportada
        if (!isMediaFile(file)) {
            app.showNotification('Erro', `${file.name} não é um arquivo de mídia suportado.`, 'error');
            return;
        }
        
        // Criar item de progresso
        const progressItem = createProgressItem(file);
        progressList.appendChild(progressItem);
        
        // Processar arquivo local (sem envio para servidor)
        processLocalFile(file, progressItem);
    }
    
    // Verificar se é um arquivo de mídia suportado
    function isMediaFile(file) {
        const audioTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'];
        const videoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        
        return audioTypes.includes(file.type) || videoTypes.includes(file.type);
    }
    
    // Criar item de progresso
    function createProgressItem(file) {
        const item = document.createElement('div');
        item.className = 'progress-item';
        item.dataset.filename = file.name;
        
        const header = document.createElement('div');
        header.className = 'progress-item-header';
        
        const name = document.createElement('div');
        name.className = 'progress-item-name';
        name.textContent = file.name;
        
        const status = document.createElement('div');
        status.className = 'progress-item-status uploading';
        status.textContent = 'Processando...';
        
        const progressBarContainer = document.createElement('div');
        progressBarContainer.className = 'progress-bar-container';
        
        const progressBarFill = document.createElement('div');
        progressBarFill.className = 'progress-bar-fill';
        progressBarFill.style.width = '0%';
        
        header.appendChild(name);
        header.appendChild(status);
        progressBarContainer.appendChild(progressBarFill);
        
        item.appendChild(header);
        item.appendChild(progressBarContainer);
        
        return item;
    }
    
    // Processar arquivo local
    function processLocalFile(file, progressItem) {
        const progressFill = progressItem.querySelector('.progress-bar-fill');
        const status = progressItem.querySelector('.progress-item-status');
        let progress = 0;
        
        // Criar URL do arquivo local
        const fileUrl = URL.createObjectURL(file);
        
        // Simular progresso de processamento
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Atualizar status
                status.textContent = 'Concluído';
                status.className = 'progress-item-status success';
                
                // Adicionar à biblioteca
                addToLibrary(file, fileUrl);
                
                // Remover item de progresso após alguns segundos
                setTimeout(() => {
                    progressItem.remove();
                    
                    // Esconder container se não houver mais itens
                    if (progressList.children.length === 0) {
                        progressContainer.style.display = 'none';
                    }
                }, 3000);
            }
            
            // Atualizar barra de progresso
            progressFill.style.width = `${progress}%`;
        }, 200);
    }
    
    // Gerar thumbnail para vídeo
    function generateVideoThumbnail(file, fileUrl) {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.src = fileUrl;
            video.currentTime = 1; // Capturar frame após 1 segundo
            video.muted = true;
            
            video.onloadeddata = function() {
                // Criar canvas para capturar frame
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                // Desenhar frame no canvas
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Converter canvas para URL de dados
                const thumbnailUrl = canvas.toDataURL('image/jpeg');
                resolve(thumbnailUrl);
            };
            
            video.onerror = function() {
                // Falha ao gerar thumbnail
                resolve(null);
            };
        });
    }
    
    // Adicionar à biblioteca
    async function addToLibrary(file, fileUrl) {
        // Determinar tipo de mídia
        const isAudio = file.type.startsWith('audio/');
        
        // Gerar thumbnail para vídeo
        let thumbnail = null;
        if (!isAudio) {
            thumbnail = await generateVideoThumbnail(file, fileUrl);
        }
        
        // Criar objeto de mídia
        const mediaItem = {
            id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title: file.name.replace(/\.[^/.]+$/, ""), // Remover extensão
            type: isAudio ? 'audio' : 'video',
            source: 'local',
            url: fileUrl,
            thumbnail: thumbnail,
            dateAdded: new Date().toISOString()
        };
        
        // Adicionar à biblioteca
        const library = JSON.parse(localStorage.getItem('musicflix_library') || '[]');
        library.push(mediaItem);
        localStorage.setItem('musicflix_library', JSON.stringify(library));
        
        // Atualizar interface
        app.loadLibrary();
        
        // Mostrar mensagem de sucesso
        app.showNotification('Sucesso', `${file.name} adicionado à biblioteca.`, 'success');
    }
    
    // Inicializar
    init();
    
    // Expor funções para uso externo
    window.upload = {
        handleFiles
    };
});
