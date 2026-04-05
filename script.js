import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBdlHar22iODe81f-nrUi06PLWKQReb9Gc",
    authDomain: "siteescolaeduarda.firebaseapp.com",
    databaseURL: "https://siteescolaeduarda-default-rtdb.firebaseio.com",
    projectId: "siteescolaeduarda"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let nome = localStorage.getItem("nome") || prompt("Qual o seu nome?") || "Estudante";
localStorage.setItem("nome", nome);

window.mudarAba = (id) => {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("active"));
    document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active-btn"));
    document.getElementById(id).classList.add("active");
    if(document.getElementById("btn-"+id)) document.getElementById("btn-"+id).classList.add("active-btn");
};

// CHAT
window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;
    push(ref(db, "mensagens"), { nome, texto: input.value, hora: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) });
    input.value = "";
};
onValue(ref(db, "mensagens"), snap => {
    const feed = document.getElementById("feed-forum"); feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === nome ? 'me' : 'outro'}`;
        div.innerHTML = `<b>${d.nome}</b><br><span>${d.texto}</span>`;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

// MURAL
window.salvarIdeia = () => {
    const input = document.getElementById("input-ideia");
    if(input.value.trim()) push(ref(db, "mural"), { autor: nome, texto: input.value, votos: 0 });
    input.value = "";
};
window.votarIdeia = (id) => runTransaction(ref(db, `mural/${id}/votos`), v => (v || 0) + 1);
onValue(ref(db, "mural"), snap => {
    const feed = document.getElementById("feed-mural"); feed.innerHTML = "";
    let lista = []; snap.forEach(c => lista.push({id: c.key, ...c.val()}));
    lista.sort((a,b) => (b.votos || 0) - (a.votos || 0)).forEach(d => {
        const div = document.createElement("div");
        div.className = "msg-post outro"; div.style.maxWidth = "100%";
        div.innerHTML = `<b>${d.autor}:</b> ${d.texto} <button onclick="votarIdeia('${d.id}')" style="float:right; background:var(--sec); color:white; border:none; padding:4px 8px; border-radius:8px;">👍 ${d.votos || 0}</button>`;
        feed.appendChild(div);
    });
});

// ALERTAS (Senha: Chernobyl)
window.salvarAviso = () => {
    if(prompt("Chave de Segurança:") === "Chernobyl") {
        const input = document.getElementById("input-aviso");
        if(input.value.trim()) push(ref(db, "avisos"), { texto: input.value });
        input.value = "";
    }
};
onValue(ref(db, "avisos"), snap => {
    const feed = document.getElementById("feed-avisos"); feed.innerHTML = "";
    snap.forEach(c => {
        const div = document.createElement("div");
        div.className = "card-evento";
        div.innerHTML = `<b>DIREÇÃO:</b> ${c.val().texto}`;
        feed.prepend(div);
    });
});

// FEEDBACK E HUMOR
window.enviarFeedback = () => {
    const t = document.getElementById("texto-feedback");
    if(t.value.trim()){
        push(ref(db, "feedbacks_privados"), { aluno: nome, texto: t.value, data: new Date().toLocaleString() });
        t.value = ""; alert("Feedback enviado!");
    }
};
window.votarHumor = (h) => { push(ref(db, "humor"), { nome, status: h }); alert("Humor registrado!"); };
