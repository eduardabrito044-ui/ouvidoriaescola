import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
    meuNome = prompt("Seja bem-vindo ao Portal! Qual o seu nome ou apelido?") || "Estudante";
    localStorage.setItem("nome_usuario", meuNome);
}

let msgParaResponder = null;

window.mudarAba = (id) => {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
    document.getElementById(id).classList.add('active');
};

window.prepararResposta = (nome, texto) => {
    msgParaResponder = { nome, texto };
    const preview = document.getElementById('reply-preview');
    const previewText = document.getElementById('reply-text');
    preview.style.display = 'flex';
    previewText.innerText = `Respondendo a ${nome}`;
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

        let html = `<span class="user-name">${dados.nome}</span>`;
        
        if (dados.respostaDe) {
            html += `
                <div class="reply-bubble">
                    <strong style="font-size:0.7rem;">↳ ${dados.respostaDe}</strong><br>
                    <span style="opacity:0.8;">${dados.textoOriginal.substring(0, 45)}...</span>
                </div>`;
        }

        html += `<div class="text-body">${dados.texto}</div>`;
        html += `<small>${dados.hora}</small>`;
        
        div.innerHTML = html;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

// Outras funções
window.salvarIdeia = function() {
    const input = document.getElementById("input-ideia");
    if (!input.value.trim()) return;
    push(ref(db, "mural"), { autor: meuNome, texto: input.value.trim(), data: new Date().toLocaleDateString() });
    input.value = "";
    alert("Sua ideia foi enviada!");
};

window.votarHumor = (tipo) => {
    push(ref(db, "humor"), { usuario: meuNome, voto: tipo, data: new Date().toLocaleDateString() });
    alert("Voto registrado!");
};

window.enviarFeedback = () => {
    const area = document.getElementById("texto-feedback");
    if (!area.value.trim()) return;
    push(ref(db, "feedback"), { usuario: meuNome, comentario: area.value.trim(), data: new Date().toLocaleString() });
    area.value = "";
    alert("Obrigado pelo seu feedback!");
};

document.addEventListener("keypress", (e) => {
    if(e.key === "Enter" && document.activeElement.id === "input-msg") salvarMensagem();
});
