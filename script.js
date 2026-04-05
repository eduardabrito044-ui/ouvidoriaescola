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

let nome = localStorage.getItem("nome") || prompt("Qual o seu nome?") || "Anônimo";
localStorage.setItem("nome", nome);

let responderInfo = null;

window.mudarAba = (id) => {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("active"));
    document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active-btn"));
    const target = document.getElementById(id);
    if(target) target.classList.add("active");
    const btn = document.getElementById("btn-"+id);
    if(btn) btn.classList.add("active-btn");
};

// --- CHAT ---
window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;
    const dados = { 
        nome, 
        texto: input.value, 
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    if (responderInfo) { 
        dados.respostaPara = responderInfo.autor; 
        dados.textoOriginal = responderInfo.texto; 
    }
    push(ref(db, "mensagens"), dados);
    input.value = ""; 
    window.cancelarResposta();
};

onValue(ref(db, "mensagens"), (snapshot) => {
    const feed = document.getElementById("feed-forum");
    if(!feed) return; 
    feed.innerHTML = "";
    snapshot.forEach((child) => {
        const d = child.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === nome ? 'me' : 'outro'}`;
        div.onclick = () => window.prepararResposta(d.nome, d.texto);
        let html = `<span class="msg-name">${d.nome}</span>`;
        if (d.respostaPara) html += `<div class="reply-inside" style="background: rgba(0,0,0,0.3); border-left: 2px solid #fff; padding: 5px; font-size: 0.7rem; border-radius: 5px; margin-bottom: 5px;">↳ ${d.respostaPara}: ${d.textoOriginal}</div>`;
        html += `<span class="msg-text">${d.texto}</span><span class="msg-time" style="font-size: 0.6rem; opacity: 0.5; text-align: right;">${d.hora}</span>`;
        div.innerHTML = html; 
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
    snapshot.forEach((child) => { ideias.push({ id: child.key, ...child.val() }); });
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

// --- AVISOS ---
window.salvarAviso = () => {
    if(prompt("Senha da Direção:") === "Chernobyl") {
        const input = document.getElementById("input-aviso");
        if(input.value.trim()) {
            push(ref(db, "avisos"), { texto: input.value, data: new Date().toLocaleString() });
            input.value = "";
        }
    } else { alert("Acesso negado."); }
};

onValue(ref(db, "avisos"), (snapshot) => {
    const feed = document.getElementById("feed-avisos");
    if(feed) {
        feed.innerHTML = "";
        snapshot.forEach((child) => {
            const d = child.val();
            feed.insertAdjacentHTML('afterbegin', `<div style="background:#1a1a1a; border-left:4px solid #ff4757; padding:15px; border-radius:10px; margin-bottom:10px;"><strong>DIREÇÃO:</strong> ${d.texto}<br><small style="opacity:0.5">${d.data}</small></div>`);
        });
    }
});

// --- EXTRAS ---
window.prepararResposta = (autor, texto) => { 
    responderInfo = { autor, texto }; 
    document.getElementById("reply-preview").style.display = "flex"; 
    document.getElementById("reply-user").innerText = `Respondendo a ${autor}`; 
    document.getElementById("reply-text").innerText = texto; 
};
window.cancelarResposta = () => { 
    responderInfo = null; 
    document.getElementById("reply-preview").style.display = "none"; 
};
window.votarHumor = (v) => { push(ref(db, "humor"), { nome, voto: v }); alert("Votado!"); };
window.enviarFeedback = () => { 
    const t = document.getElementById("texto-feedback"); 
    push(ref(db, "feedback"), { nome, texto: t.value }); 
    t.value = ""; alert("Feedback enviado!"); 
};
