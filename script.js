<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Ouvidoria - CETI JM</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="light-mode">
    <nav class="top-menu">
        <div class="menu-scroll">
            <button id="btn-forum" class="active-btn" onclick="mudarAba('forum')">💬 Chat</button>
            <button id="btn-avisos" onclick="mudarAba('avisos')">📢 Alertas</button>
            <button id="btn-sentimentos" onclick="mudarAba('sentimentos')">🎭 Humor</button>
            <button id="btn-cronograma" onclick="mudarAba('cronograma')">📅 Agenda</button>
            <button id="btn-contatos" onclick="mudarAba('contatos')">📱 Contatos</button>
        </div>
    </nav>

    <main class="main-content">
        <section id="forum" class="aba active">
            <div class="header-escola">
                <img src="logo.png" class="logo-fixa" alt="Logo">
                <div class="info-escola">
                    <h2>Direct CETI JM</h2>
                    <small>● Ativo agora</small>
                </div>
            </div>
            <div id="feed-forum" class="feed"></div>
            <div class="footer-input">
                <div class="input-wrapper">
                    <input type="text" id="input-msg" placeholder="Enviar mensagem...">
                    <button class="send-btn" onclick="salvarMensagem()">Enviar</button>
                </div>
            </div>
        </section>

        <section id="sentimentos" class="aba">
            <div class="header-escola">
                <img src="logo.png" class="logo-fixa" alt="Logo">
                <div class="info-escola"><h2>Como você está?</h2></div>
            </div>
            <div class="emoji-grid">
                <div class="emoji-item" onclick="votarHumor('Ansioso')"><span>😰</span><p>Ansioso</p><small>Inquieto</small></div>
                <div class="emoji-item" onclick="votarHumor('Feliz')"><span>😊</span><p>Feliz</p><small>Dia ótimo</small></div>
                <div class="emoji-item" onclick="votarHumor('Triste')"><span>😢</span><p>Triste</p><small>Preciso de apoio</small></div>
                <div class="emoji-item" onclick="votarHumor('Focado')"><span>🤯</span><p>Focado</p><small>Estudando</small></div>
                <div class="emoji-item" onclick="votarHumor('Irritado')"><span>😡</span><p>Irritado</p><small>Estressado</small></div>
                <div class="emoji-item" onclick="votarHumor('Cansado')"><span>😴</span><p>Exausto</p><small>Sem energia</small></div>
            </div>
        </section>

        </main>

    <div id="toast">Enviado com sucesso! ✓</div>
    <button class="fab-theme" onclick="toggleTheme()">🌓</button>

    <script type="module" src="script.js"></script>
</body>
</html>
