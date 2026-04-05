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

// --- TEMA ---
window.toggleTheme = () => {
    const body = document.body;
    body.classList.toggle("light-mode");
    body.classList.toggle("dark-mode");
    localStorage.setItem("theme", body.classList.contains("light-mode") ? "light" : "dark");
};
if(localStorage.getItem("theme") === "light") document.body.classList.replace("dark-mode", "light-mode");

let nome = localStorage.getItem("nome") || prompt("Qual o seu nome?") || "Anônimo";
localStorage.setItem("nome", nome);

window.mudarAba = (id) => {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("active"));
    document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active-btn"));
    document.getElementById(id).classList.add("active");
    if(document.getElementById("btn-"+id)) document.getElementById("btn-"+id).classList.add("active-btn");
};

// --- LÓGICA DE RESPOSTA ---
let respondendoA = null;

window.prepararResposta = (user, texto) => {
    respondendoA = { user, texto };
    const preview = document.getElementById("reply-preview");
    if(preview) {
        preview.style.display = "flex";
        document.getElementById("reply-user").innerText = user;
        document.getElementById("reply-text").innerText = texto;
    }
};

window.cancelarResposta = () => {
    respondendoA = null;
    const preview = document.getElementById("reply-preview");
    if(preview) preview.style.display = "none";
};

// --- CHAT ---
window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;

    const novaMsg = {
        nome,
        texto: input.value,
        hora: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
        resposta: respondendoA // Salva a citação se houver
    };

    push(ref(db, "mensagens"), novaMsg);
    input.value = "";
    cancelarResposta();
};

onValue(ref(db, "mensagens"), (snapshot) => {
    const feed = document.getElementById("feed-forum");
    if(!feed) return; feed.innerHTML = "";
    snapshot.forEach((child) => {
        const d = child.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === nome ? 'me' : 'outro'}`;
        
        // Se a mensagem for uma resposta, adiciona o balão de citação
        let htmlResposta = "";
        if(d.resposta) {
            htmlResposta = `<div style="background: rgba(0,0,0,0.1); padding: 5px 8px; border-left: 3px solid var(--azul); border-radius: 4px; margin-bottom: 5px; font-size: 0.75rem;">
                <b style="color: var(--azul)">${d.resposta.user}</b>: ${d.resposta.texto}
            </div>`;
        }

        div.innerHTML = `
            ${htmlResposta}
            <small style="display:block; font-weight:800; opacity:0.8">${d.nome}</small>
            ${d.texto}
            <button onclick="prepararResposta('${d.nome}', '${d.texto}')" style="background:none; border:none; color:var(--verde); font-size:0.6rem; cursor:pointer; margin-top:5px; display:block;">Responder</button>
        `;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

// --- MURAL, AVISOS E EXTRAS ---
window.salvarIdeia = () => {
    const input = document.getElementById("input-ideia");
    if (!input.value.trim()) return;
    push(ref(db, "mural"), { autor: nome, texto: input.value, votos: 0 });
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
        div.innerHTML = `<strong>${d.autor}:</strong> ${d.texto}<br><button class="btn-votar" onclick="votarIdeia('${d.id}')">👍 ${d.votos || 0}</button>`;
        feed.appendChild(div);
    });
});

window.salvarAviso = () => {
    const senha = prompt("Identificação de Administrador:");
    if(senha === "Chernobyl") {
        const input = document.getElementById("input-aviso");
        if(!input.value.trim()) return;
        push(ref(db, "avisos"), { texto: input.value, data: new Date().toLocaleDateString() });
        input.value = "";
    } else if (senha !== null) { alert("Chave incorreta!"); }
};

onValue(ref(db, "avisos"), (snapshot) => {
    const feed = document.getElementById("feed-avisos");
    if(!feed) return; feed.innerHTML = "";
    snapshot.forEach((child) => {
        const d = child.val();
        const div = document.createElement("div");
        div.className = "aviso-card";
        div.innerHTML = `<strong>OFICIAL:</strong> ${d.texto}<br><small>${d.data}</small>`;
        feed.prepend(div);
    });
});

window.votarHumor = (v) => { push(ref(db, "humor"), { nome, voto: v }); alert("Votado!"); };
window.enviarFeedback = () => {
    const t = document.getElementById("texto-feedback");
    push(ref(db, "feedback"), { nome, texto: t.value });
    t.value = ""; alert("Enviado!");
};
