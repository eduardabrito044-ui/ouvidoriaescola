import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Suas chaves Firebase (Mantidas exatamente iguais)
const firebaseConfig = {
  apiKey: "AIzaSyBdlHar22iODe81f-nrUi06PLWKQReb9Gc",
  authDomain: "siteescolaeduarda.firebaseapp.com",
  databaseURL: "https://siteescolaeduarda-default-rtdb.firebaseio.com",
  projectId: "siteescolaeduarda",
  storageBucket: "siteescolaeduarda.firebasestorage.app",
  messagingSenderId: "381495876879",
  appId: "1:381495876879:web:4366dc25b119a2567e327a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let meuNome = localStorage.getItem("nome_usuario");
if (!meuNome) {
    meuNome = prompt("Seja bem-vindo! Qual o seu nome?") || "Anônimo";
    localStorage.setItem("nome_usuario", meuNome);
}

let msgParaResponder = null;

window.mudarAba = (id) => {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
    document.getElementById(id).classList.add('active');
};

// Função para preparar a resposta ao clicar na mensagem
window.prepararResposta = (nome, texto) => {
    msgParaResponder = { nome, texto };
    const preview = document.getElementById('reply-preview');
    const userText = document.getElementById('reply-user');
    const msgText = document.getElementById('reply-text');
    
    preview.style.display = 'flex';
    userText.innerText = `Respondendo a ${nome}`;
    msgText.innerText = texto.substring(0, 40) + (texto.length > 40 ? "..." : "");
    document.getElementById('input-msg').focus();
};

window.cancelarResposta = () => {
    msgParaResponder = null;
    document.getElementById('reply-preview').style.display = 'none';
};

const chatRef = ref(db, "mensagens");

window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    const texto = input.value.trim();
    if (!texto) return;

    const payload = {
        nome: meuNome,
        texto: texto,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (msgParaResponder) {
        payload.respostaDe = msgParaResponder.nome;
        payload.textoOriginal = msgParaResponder.texto;
    }

    push(chatRef, payload);
    input.value = "";
    cancelarResposta();
};

onValue(chatRef, (snapshot) => {
    const feed = document.getElementById("feed-forum");
    if (!feed) return;
    feed.innerHTML = "";
    snapshot.forEach((child) => {
        const dados = child.val();
        const div = document.createElement("div");
        div.className = `msg-post ${dados.nome === meuNome ? 'me' : 'outro'}`;
        
        div.onclick = () => prepararResposta(dados.nome, dados.texto);

        let html = `<span class="msg-name">${dados.nome}</span>`;
        
        if (dados.respostaDe) {
            html += `
                <div class="reply-inside">
                    <strong style="color:#7c3aed; font-size: 0.7rem;">↳ ${dados.respostaDe}</strong><br>
                    <span>${dados.textoOriginal.substring(0, 35)}...</span>
                </div>`;
        }

        html += `<span class="msg-text">${dados.texto}</span>`;
        html += `<span class="msg-time">${dados.hora}</span>`;
        
        div.innerHTML = html;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

// Outras Funções do Mural e Feedback
window.salvarIdeia = function() {
    const input = document.getElementById("input-ideia");
    const texto = input.value.trim();
    if (!texto) return;
    push(ref(db, "mural"), { autor: meuNome, texto: texto, data: new Date().toLocaleDateString() });
    input.value = "";
    alert("Sua ideia foi enviada!");
};

window.votarHumor = (tipo) => {
    push(ref(db, "humor"), { usuario: meuNome, voto: tipo, data: new Date().toLocaleDateString() });
    alert("Voto registrado!");
};

window.enviarFeedback = () => {
    const area = document.getElementById("texto-feedback");
    const texto = area.value.trim();
    if (!texto) return;
    push(ref(db, "feedback"), { usuario: meuNome, comentario: texto, data: new Date().toLocaleString() });
    area.value = "";
    alert("Feedback enviado!");
};

document.addEventListener("keypress", (e) => {
    if(e.key === "Enter" && document.activeElement.id === "input-msg") salvarMensagem();
});
