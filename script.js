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

window.mudarAba = (id) => {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.menu-scroll button').forEach(b => b.classList.remove('active-btn'));
    document.getElementById(id).classList.add('active');
    document.getElementById('btn-'+id).classList.add('active-btn');
};

window.toggleTheme = () => document.body.classList.toggle('dark-mode');

window.mostrarToast = (msg) => {
    const t = document.getElementById("toast"); t.innerText = msg;
    t.style.display = "block"; setTimeout(() => t.style.display = "none", 2500);
};

// CHAT
window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;
    push(ref(db, "mensagens"), { nome, texto: input.value, timestamp: serverTimestamp() });
    input.value = ""; mostrarToast("Enviado! ✓");
};

onValue(ref(db, "mensagens"), snap => {
    const feed = document.getElementById("feed-forum"); feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === nome ? 'me' : 'outro'}`;
        div.innerHTML = `<small style="font-size:10px; margin:2px 10px; opacity:0.6">${d.nome}</small><div class="bubble">${d.texto}</div>`;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

// MURAL (VOTOS)
window.salvarMural = () => {
    const input = document.getElementById("input-mural");
    if (!input.value.trim()) return;
    push(ref(db, "ideias"), { nome, texto: input.value, votos: 0 });
    input.value = ""; mostrarToast("Ideia enviada! ✓");
};

onValue(ref(db, "ideias"), snap => {
    const feed = document.getElementById("feed-mural"); feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = "idea-card";
        div.innerHTML = `<strong>${d.nome}</strong><p>${d.texto}</p>
                         <button class="vote-btn" onclick="votarIdeia('${c.key}', ${d.votos})">❤️ ${d.votos} Votos</button>`;
        feed.prepend(div);
    });
});

window.votarIdeia = (id, atual) => {
    update(ref(db, `ideias/${id}`), { votos: atual + 1 });
};

// CHERNOBYL SECURITY
const acaoSegura = (caminho, inputId) => {
    const chave = prompt("Chave Chernobyl:");
    if (chave === "Chernobyl") {
        const input = document.getElementById(inputId);
        if(input.value.trim()){
            push(ref(db, caminho), { texto: input.value, data: new Date().toLocaleDateString() });
            input.value = ""; mostrarToast("Publicado! ✓");
        }
    } else { alert("Acesso negado!"); }
};

window.salvarAviso = () => acaoSegura("avisos", "input-aviso");
window.salvarAgenda = () => acaoSegura("agenda", "input-agenda");

onValue(ref(db, "avisos"), snap => {
    const f = document.getElementById("feed-avisos"); f.innerHTML = "";
    snap.forEach(c => {
        const d = c.val(); f.insertAdjacentHTML('afterbegin', `<div class="card-alerta"><strong>⚠️ ${d.data}</strong><p>${d.texto}</p></div>`);
    });
});

onValue(ref(db, "agenda"), snap => {
    const f = document.getElementById("feed-agenda"); f.innerHTML = "";
    snap.forEach(c => {
        const d = c.val(); f.insertAdjacentHTML('afterbegin', `<div class="idea-card"><small>📅 ${d.data}</small><p>${d.texto}</p></div>`);
    });
});

// HUMOR
window.votarHumor = (h) => {
    push(ref(db, "humor"), { usuario: nome, voto: h });
    mostrarToast("Humor registrado! ✓");
};

// FEEDBACK
window.enviarFeedback = () => {
    const texto = document.getElementById("texto-feedback").value;
    if(texto.trim()){
        push(ref(db, "feedback"), { nome, texto });
        document.getElementById("texto-feedback").value = "";
        mostrarToast("Obrigado pelo feedback! ✓");
    }
};
