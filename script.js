import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBdlHar22iODe81f-nrUi06PLWKQReb9Gc",
    authDomain: "siteescolaeduarda.firebaseapp.com",
    databaseURL: "https://siteescolaeduarda-default-rtdb.firebaseio.com",
    projectId: "siteescolaeduarda"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let nome = localStorage.getItem("nome") || prompt("Qual seu nome?") || "Aluno";
localStorage.setItem("nome", nome);

window.mudarAba = (id) => {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.menu-scroll button').forEach(b => b.classList.remove('active-btn'));
    document.getElementById(id).classList.add('active');
    if(document.getElementById('btn-'+id)) document.getElementById('btn-'+id).classList.add('active-btn');
};

window.toggleTheme = () => document.body.classList.toggle('dark-mode');

window.mostrarToast = (msg) => {
    const t = document.getElementById("toast");
    t.innerText = msg; t.style.display = "block";
    setTimeout(() => { t.style.display = "none"; }, 2500);
};

window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;
    push(ref(db, "mensagens"), { nome, texto: input.value, timestamp: serverTimestamp() });
    input.value = "";
    mostrarToast("Mensagem enviada! ✓");
};

onValue(ref(db, "mensagens"), snap => {
    const feed = document.getElementById("feed-forum"); if(!feed) return;
    feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === nome ? 'me' : 'outro'}`;
        div.innerHTML = `<small style="font-size:10px; margin:0 10px; opacity:0.6">${d.nome}</small><div class="bubble">${d.texto}</div>`;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

window.votarHumor = (h) => {
    push(ref(db, "humor"), { usuario: nome, voto: h });
    mostrarToast("Votado com sucesso! ✓");
};
