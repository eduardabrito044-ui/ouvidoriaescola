import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// --- LÓGICA DE TEMAS (DARK/LIGHT) ---
window.toggleTheme = () => {
    const body = document.body;
    if (body.classList.contains("dark-mode")) {
        body.classList.replace("dark-mode", "light-mode");
        localStorage.setItem("theme", "light");
    } else {
        body.classList.replace("light-mode", "dark-mode");
        localStorage.setItem("theme", "dark");
    }
};
// Carregar tema salvo
if(localStorage.getItem("theme") === "light") document.body.classList.replace("dark-mode", "light-mode");

let nome = localStorage.getItem("nome") || prompt("Qual o seu nome?") || "Anônimo";
localStorage.setItem("nome", nome);

window.mudarAba = (id) => {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("active"));
    document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active-btn"));
    const t = document.getElementById(id); if(t) t.classList.add("active");
    if(document.getElementById("btn-"+id)) document.getElementById("btn-"+id).classList.add("active-btn");
};

// --- CHAT ---
window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;
    push(ref(db, "mensagens"), { nome, texto: input.value, hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    input.value = "";
};

onValue(ref(db, "mensagens"), (snapshot) => {
    const feed = document.getElementById("feed-forum");
    if(!feed) return; feed.innerHTML = "";
    snapshot.forEach((child) => {
        const d = child.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === nome ? 'me' : 'outro'}`;
        div.innerHTML = `<span class="msg-name">${d.nome}</span><span class="msg-text">${d.texto}</span><span class="msg-time">${d.hora}</span>`;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

// --- MURAL ---
window.salvarIdeia = () => {
    const input = document.getElementById("input-ideia");
    if (!input.value.trim()) return;
    push(ref(db, "mural"), { autor: nome, texto: input.value, votos: 0, data: new Date().toLocaleDateString() });
    input.value = "";
};

window.votarIdeia = (id) => {
    runTransaction(ref(db, `mural/${id}/votos`), (v) => (v || 0) + 1);
};

onValue(ref(db, "mural"), (snapshot) => {
    const feed = document.getElementById("feed-mural");
    if(!feed) return;
    let ideias = [];
    snapshot.forEach((c) => { ideias.push({ id: c.key, ...c.val() }); });
    ideias.sort((a, b) => (b.votos || 0) - (a.votos || 0));
    feed.innerHTML = "";
    ideias.forEach((d) => {
        const div = document.createElement("div");
        div.className = "msg-post outro"; div.style.maxWidth = "100%";
        div.innerHTML = `<span class="msg-name">${d.autor}</span><span class="msg-text">${d.texto}</span>
        <button class="btn-votar" onclick="votarIdeia('${d.id}')">👍 ${d.votos || 0}</button>`;
        feed.appendChild(div);
    });
});

// --- AVISOS (CHAVE CHERNOBYL) ---
window.salvarAviso = () => {
    if(prompt("Chave de acesso:") === "Chernobyl") {
        const input = document.getElementById("input-aviso");
        push(ref(db, "avisos"), { texto: input.value, data: new Date().toLocaleString() });
        input.value = "";
    } else { alert("Acesso negado."); }
};

onValue(ref(db, "avisos"), (snapshot) => {
    const feed = document.getElementById("feed-avisos");
    if(!feed) return; feed.innerHTML = "";
    snapshot.forEach((child) => {
        const d = child.val();
        const div = document.createElement("div");
        div.className = "aviso-card";
        div.innerHTML = `<strong>AVISO:</strong> ${d.texto} <br><small>${d.data}</small>`;
        feed.prepend(div);
    });
});

// --- EXTRAS ---
window.votarHumor = (v) => { push(ref(db, "humor"), { nome, voto: v }); alert("Votado!"); };
window.enviarFeedback = () => { const t = document.getElementById("texto-feedback"); push(ref(db, "feedback"), { nome, texto: t.value }); t.value = ""; alert("Enviado!"); };
