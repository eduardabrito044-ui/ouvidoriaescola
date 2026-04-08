import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, update, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBdlHar22iODe81f-nrUi06PLWKQReb9Gc",
    authDomain: "siteescolaeduarda.firebaseapp.com",
    databaseURL: "https://siteescolaeduarda-default-rtdb.firebaseio.com",
    projectId: "siteescolaeduarda"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let nome = localStorage.getItem("nome") || prompt("Qual seu nome?") || "Estudante";
localStorage.setItem("nome", nome);

let respondendoA = null;

window.mudarAba = (id) => {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.menu-scroll button').forEach(b => b.classList.remove('active-btn'));
    document.getElementById(id).classList.add('active');
    document.getElementById('btn-'+id).classList.add('active-btn');
};

window.toggleTheme = () => document.body.classList.toggle('dark-mode');

window.prepararResposta = (msg, autor) => {
    respondendoA = { msg, autor };
    const display = document.getElementById("reply-preview");
    display.style.display = "block";
    display.innerHTML = `<small>Respondendo <b>${autor}</b></small> <span onclick="cancelarReply()">✖</span>`;
};

window.cancelarReply = () => { respondendoA = null; document.getElementById("reply-preview").style.display = "none"; };

// --- CHAT COM RANKING E MEDALHAS ---
window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;
    push(ref(db, "mensagens"), { nome, texto: input.value, resposta: respondendoA, timestamp: serverTimestamp() });
    input.value = ""; cancelarReply();
};

onValue(ref(db, "mensagens"), snap => {
    const feed = document.getElementById("feed-forum"); feed.innerHTML = "";
    let contagem = {}; snap.forEach(c => { contagem[c.val().nome] = (contagem[c.val().nome] || 0) + 1; });
    const topUser = Object.keys(contagem).reduce((a, b) => contagem[a] > contagem[b] ? a : b, "");

    snap.forEach(c => {
        const d = c.val();
        const isOlympic = d.texto.toLowerCase().includes("olimpíada");
        const isEvent = d.texto.toLowerCase().includes("evento");
        const isTop = d.nome === topUser;

        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === nome ? 'me' : 'outro'} ${isTop ? 'ranking-ouro' : ''} ${isOlympic ? 'olimpiada-msg' : ''} ${isEvent ? 'evento-msg' : ''}`;
        
        div.innerHTML = `
            <small style="font-size:10px; margin: 0 10px">${isTop ? '👑 ' : ''}${isOlympic ? '🥇 ' : ''}${d.nome}</small>
            <div class="bubble" onclick="prepararResposta('${d.texto}', '${d.nome}')">
                ${d.resposta ? `<div style="font-size:11px; opacity:0.6; border-bottom:1px solid rgba(0,0,0,0.1)">⤴️ ${d.resposta.autor}: ${d.resposta.msg}</div>` : ''}
                ${d.texto}
            </div>`;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

// --- SEGURANÇA CHERNOBYL ---
const acaoSegura = (caminho, inputId) => {
    if (prompt("Chave Chernobyl:") === "Chernobyl") {
        const input = document.getElementById(inputId);
        push(ref(db, caminho), { texto: input.value, data: new Date().toLocaleDateString() });
        input.value = "";
    } else { alert("Acesso Negado!"); }
};

window.salvarAviso = () => acaoSegura("avisos", "input-aviso");
window.salvarAgenda = () => acaoSegura("agenda", "input-agenda");
window.enviarFeedback = () => {
    const txt = document.getElementById("texto-feedback").value;
    push(ref(db, "feedback"), { nome, texto: txt });
    document.getElementById("texto-feedback").value = "";
};
// ... (Logica de Humor e Mural seguem o mesmo padrão)
