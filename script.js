import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, runTransaction, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

let nomeUser = localStorage.getItem("nome") || prompt("Como se chama?") || "Anônimo";
localStorage.setItem("nome", nomeUser);
let replyObj = null;

// NAVEGAÇÃO E TEMA
window.mudarAba = (id) => {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("active"));
    document.querySelectorAll(".nav-scroll button").forEach(b => b.classList.remove("active-btn"));
    document.getElementById(id).classList.add("active");
    document.getElementById("btn-"+id).classList.add("active-btn");
};

window.toggleTheme = () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("dark", isDark);
    document.getElementById("theme-toggle").innerText = isDark ? "☀️" : "🌑";
};
if(localStorage.getItem("dark") === "true") toggleTheme();

// DIRECT COM RESPOSTA
window.prepararResposta = (autor, texto) => {
    replyObj = { autor, texto };
    document.getElementById("reply-preview").style.display = "flex";
    document.getElementById("reply-user").innerText = `Respondendo a ${autor}`;
    document.getElementById("reply-text").innerText = texto;
};

window.cancelarResposta = () => {
    replyObj = null; document.getElementById("reply-preview").style.display = "none";
};

window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;
    const msg = {
        nome: "Jussara", dono: nomeUser, texto: input.value,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    if (replyObj) { msg.replyTo = replyObj.autor; msg.replyTxt = replyObj.texto; }
    push(ref(db, "mensagens"), msg);
    input.value = ""; cancelarResposta();
};

onValue(ref(db, "mensagens"), snap => {
    const feed = document.getElementById("feed-forum"); feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const card = document.createElement("div");
        card.className = `msg-post ${d.dono === nomeUser ? 'me' : 'outro'}`;
        card.onclick = () => window.prepararResposta(d.dono, d.texto);
        let html = `<span class="msg-name">${d.nome}</span>`;
        if (d.replyTo) html += `<div class="reply-tag">↳ ${d.replyTo}: ${d.replyTxt}</div>`;
        html += `<span class="msg-text">${d.texto}</span><span class="msg-time">${d.hora}</span>`;
        card.innerHTML = html; feed.appendChild(card);
    });
    feed.scrollTop = feed.scrollHeight;
});

// MURAL COM RANKING DOURADO
window.salvarIdeia = () => {
    const input = document.getElementById("input-ideia");
    if(input.value.trim()) { push(ref(db, "mural"), { autor: nomeUser, texto: input.value, votos: 0 }); input.value = ""; }
};
window.votarIdeia = (id) => runTransaction(ref(db, `mural/${id}/votos`), v => (v || 0) + 1);

onValue(ref(db, "mural"), snap => {
    const feed = document.getElementById("feed-mural"); feed.innerHTML = "";
    let lista = []; snap.forEach(c => lista.push({id: c.key, ...c.val()}));
    lista.sort((a,b) => (b.votos || 0) - (a.votos || 0));
    lista.forEach((d, idx) => {
        const destaque = (idx === 0 && d.votos > 0) ? "ideia-vencedora" : "";
        feed.innerHTML += `<div class="card-modern ${destaque}">
            <strong>${d.autor}:</strong> ${d.texto}
            <button onclick="votarIdeia('${d.id}')" style="float:right; border:none; background:var(--white); padding:8px 12px; border-radius:10px; cursor:pointer; font-weight:800; box-shadow:0 2px 5px var(--shadow);">👍 ${d.votos || 0}</button>
        </div>`;
    });
});

// SENTIMENTOS / ADMIN
window.enviarSentimento = (humor, emoji) => {
    push(ref(db, "sentimentos"), { aluno: nomeUser, humor, icone: emoji, data: new Date().toLocaleString() });
    document.getElementById("status-sentimento").innerText = `Registrado: Você está ${humor} ${emoji}`;
    setTimeout(() => document.getElementById("status-sentimento").innerText = "", 3000);
};

window.postarAviso = () => {
    if(prompt("Senha Master:") === "Chernobyl"){
        const txt = prompt("Aviso:");
        if(txt) push(ref(db, "avisos"), { texto: txt, data: new Date().toLocaleString() });
    }
};

onValue(ref(db, "avisos"), snap => {
    const feed = document.getElementById("feed-avisos"); feed.innerHTML = "";
    snap.forEach(c => feed.insertAdjacentHTML('afterbegin', `<div class="card-modern" style="border-left-color:red"><strong>DIREÇÃO:</strong> ${c.val().texto}<br><small>${c.val().data}</small></div>`));
});

window.editarCronograma = () => {
    if(prompt("Senha Master:") === "Chernobyl"){
        const tipo = prompt("'olimp' ou 'escola'?");
        const info = prompt("Evento:");
        if(info) push(ref(db, `cronograma/${tipo}`), info);
    }
};
onValue(ref(db, "cronograma/olimp"), snap => {
    const b = document.getElementById("cronograma-olimpiadas"); b.innerHTML = "";
    snap.forEach(c => b.innerHTML += `<div class="card-modern" style="border-left-color:#ffd700">${c.val()}</div>`);
});
onValue(ref(db, "cronograma/escola"), snap => {
    const b = document.getElementById("cronograma-eventos"); b.innerHTML = "";
    snap.forEach(c => b.innerHTML += `<div class="card-modern">${c.val()}</div>`);
});

window.enviarFeedback = () => {
    const txt = document.getElementById("texto-feedback");
    if(txt.value.trim()){ push(ref(db, "feedbacks"), { user: nomeUser, texto: txt.value, data: new Date().toLocaleString() }); txt.value = ""; alert("Feedback enviado com sucesso!"); }
};
