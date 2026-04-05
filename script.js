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
let responderInfo = null;

window.mudarAba = (id) => {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("active"));
    document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active-btn"));
    const target = document.getElementById(id);
    if(target) target.classList.add("active");
    if(document.getElementById("btn-"+id)) document.getElementById("btn-"+id).classList.add("active-btn");
};

window.toggleTheme = () => document.body.classList.toggle("dark-mode");

window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;
    const msg = { nome, texto: input.value, hora: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    if (responderInfo) { msg.replyTo = responderInfo.autor; msg.replyText = responderInfo.texto; }
    push(ref(db, "mensagens"), msg);
    input.value = ""; cancelarResposta();
};

onValue(ref(db, "mensagens"), snap => {
    const feed = document.getElementById("feed-forum"); feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === nome ? 'me' : 'outro'}`;
        div.onclick = () => prepararResposta(d.nome, d.texto);
        div.innerHTML = `<strong style="font-size:0.7rem">${d.nome}</strong>
            ${d.replyTo ? `<div style="background:rgba(0,0,0,0.1); padding:5px; border-radius:5px; font-size:0.7rem;">↳ ${d.replyTo}: ${d.replyText}</div>` : ''}
            <span>${d.texto}</span><small style="font-size:0.6rem; align-self:flex-end;">${d.hora}</small>`;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

window.prepararResposta = (autor, texto) => {
    responderInfo = { autor, texto };
    document.getElementById("reply-preview").style.display = "flex";
    document.getElementById("reply-user").innerText = `Respondendo a ${autor}`;
    document.getElementById("reply-text").innerText = texto;
};

window.cancelarResposta = () => { responderInfo = null; document.getElementById("reply-preview").style.display = "none"; };

window.enviarFeedback = () => {
    const texto = document.getElementById("texto-feedback");
    if (texto.value.trim()) {
        push(ref(db, "feedbacks_privados"), { aluno: nome, mensagem: texto.value, data: new Date().toLocaleString() });
        alert("Feedback enviado com sucesso!");
        texto.value = ""; mudarAba('forum');
    }
};

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
        div.innerHTML = `<strong>${d.autor}:</strong> ${d.texto} <button onclick="votarIdeia('${d.id}')" style="background:var(--primary); color:white; border:none; border-radius:10px; padding:4px 10px; float:right;">👍 ${d.votos || 0}</button>`;
        feed.appendChild(div);
    });
});

window.salvarAviso = () => {
    if(prompt("Chave de Segurança:") === "Chernobyl") {
        const input = document.getElementById("input-aviso");
        if(input.value.trim()) push(ref(db, "avisos"), { texto: input.value, hora: new Date().toLocaleString() });
        input.value = "";
    }
};

onValue(ref(db, "avisos"), snap => {
    const feed = document.getElementById("feed-avisos"); feed.innerHTML = "";
    snap.forEach(c => {
        const div = document.createElement("div"); div.className = "msg-post outro"; div.style.maxWidth = "100%";
        div.innerHTML = `<strong>DIREÇÃO:</strong> ${c.val().texto}<br><small>${c.val().hora}</small>`;
        feed.prepend(div);
    });
});

window.votarHumor = (h) => { push(ref(db, "humor"), { nome, status: h }); alert("Registrado!"); };
