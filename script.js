import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBdlHar22iODe81f-nrUi06PLWKQReb9Gc",
    authDomain: "siteescolaeduarda.firebaseapp.com",
    databaseURL: "https://siteescolaeduarda-default-rtdb.firebaseio.com",
    projectId: "siteescolaeduarda"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let nome = localStorage.getItem("nome") || prompt("Qual o seu nome?") || "Aluno";
localStorage.setItem("nome", nome);

window.mudarAba = (id) => {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.menu-scroll button').forEach(b => b.classList.remove('active-btn'));
    document.getElementById(id).classList.add('active');
    document.getElementById('btn-'+id).classList.add('active-btn');
};

window.toggleTheme = () => document.body.classList.toggle('dark-mode');

window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;
    push(ref(db, "mensagens"), { nome, texto: input.value, hora: new Date().toLocaleTimeString() });
    input.value = "";
};

onValue(ref(db, "mensagens"), snap => {
    const feed = document.getElementById("feed-forum"); feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === nome ? 'me' : 'outro'}`;
        div.innerHTML = `<div class="bubble">${d.texto}</div>`;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

window.salvarAviso = () => {
    const chave = prompt("Digite a chave de segurança:");
    if (chave === "Chernobyl") {
        const input = document.getElementById("input-aviso");
        if(input.value.trim()){
            push(ref(db, "avisos"), { msg: input.value, data: new Date().toLocaleDateString() });
            input.value = "";
        }
    } else { alert("Acesso negado!"); }
};
