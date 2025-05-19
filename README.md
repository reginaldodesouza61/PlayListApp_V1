# Instruções de Uso - MusicFlix

## Sobre o Sistema
MusicFlix é um sistema web para criação e gerenciamento de playlists de áudios e vídeos. Desenvolvido por Reginaldo de Souza, o sistema permite:

- Upload e reprodução de arquivos de áudio e vídeo locais
- Integração com vídeos do YouTube
- Criação e salvamento de playlists personalizadas
- Interface responsiva para uso em dispositivos móveis e desktop

## Como Usar

### Requisitos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexão com internet para reprodução de vídeos do YouTube

### Instalação
Não é necessária instalação. Basta abrir o arquivo `index.html` em qualquer navegador moderno.

### Login
- Na tela inicial, clique no botão "Google" para fazer login
- **Nota importante**: Esta é uma versão de demonstração com autenticação Google simulada
- Em um ambiente de produção, seria implementada a autenticação real com Google

### Upload de Mídia Local
1. Após o login, navegue até a seção "Upload" no menu lateral
2. Arraste e solte arquivos de áudio ou vídeo na área indicada, ou clique em "Selecionar Arquivos"
3. Os formatos suportados são:
   - Áudio: MP3, WAV, OGG, FLAC
   - Vídeo: MP4, WebM, OGV

### Adicionar Vídeos do YouTube
1. Navegue até a seção "YouTube" no menu lateral
2. Cole a URL do vídeo do YouTube no campo indicado
3. Uma prévia do vídeo será exibida
4. Clique em "Adicionar à Biblioteca" para salvar o vídeo

### Gerenciar Biblioteca
1. Acesse a seção "Biblioteca" no menu lateral
2. Use os filtros para visualizar áudios, vídeos ou conteúdo do YouTube
3. Use a barra de pesquisa para encontrar itens específicos
4. Clique em qualquer item para iniciar a reprodução

### Criar Playlists
1. Acesse a seção "Playlists" no menu lateral
2. Clique em "Nova Playlist"
3. Dê um nome e descrição opcional para sua playlist
4. Para adicionar itens à playlist:
   - Na biblioteca, clique no ícone de lista em qualquer item
   - Selecione a playlist desejada

### Reprodução de Mídia
- Use os controles do player na parte inferior da tela
- Clique no botão de expansão para visualizar vídeos em tela maior
- Controles disponíveis: play/pause, anterior/próximo, aleatório, repetir, volume

## Características Técnicas

- Desenvolvido 100% em HTML, CSS e JavaScript puro
- Não requer servidor backend ou banco de dados
- Dados armazenados localmente no navegador (localStorage)
- Interface responsiva para dispositivos móveis e desktop
- Suporte para reprodução de áudio e vídeo local
- Integração com vídeos do YouTube via iframe
- Autenticação simulada (sem requisitos de servidor)

## Limitações da Versão Atual

- Autenticação Google simulada (não requer conta real)
- Dados armazenados apenas localmente no navegador
- Arquivos de mídia são referenciados localmente (URLs de objeto)
- Vídeos do YouTube são incorporados via iframe, respeitando as políticas do YouTube
- As URLs de objeto para arquivos locais são temporárias e serão perdidas ao fechar o navegador

## Personalização

Para personalizar o sistema:
- Modifique os arquivos CSS em `css/styles.css`
- Altere o HTML em `index.html`
- Modifique a lógica JavaScript nos arquivos em `js/`

## Créditos
Desenvolvido por Reginaldo de Souza
